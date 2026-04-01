import { useEffect, useState, useRef } from 'react';
import { postAPI } from '../../services/api';
import { Post, PostCategory, Role } from '../../types';
import { useAppSelector } from '../../hooks/useRedux';
import { MessageSquare, Plus, Pencil, Trash2, X, Check, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES: PostCategory[] = ['GENERAL', 'SERVICE', 'EVENT', 'SALE', 'HELP'];

const categoryColors: Record<PostCategory, string> = {
  GENERAL:  'bg-[#EEEEEE] text-[#545454] dark:bg-[#242424] dark:text-[#9E9E9E]',
  SERVICE:  'bg-[#EAF7F0] text-[#128B53] dark:bg-[#06C16720] dark:text-[#06C167]',
  EVENT:    'bg-[#EEF3FF] text-[#2563EB] dark:bg-[#276EF120] dark:text-[#60A5FA]',
  SALE:     'bg-[#FEF3C7] text-[#B45309] dark:bg-[#F59E0B20] dark:text-[#F59E0B]',
  HELP:     'bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#F4433620] dark:text-[#F44336]',
};

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const CommunityBoardPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // New post form
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<PostCategory>('GENERAL');
  const [hasImage, setHasImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<PostCategory>('GENERAL');
  const editRef = useRef<HTMLTextAreaElement>(null);

  const loadPosts = async (p = 1) => {
    try {
      setLoading(true);
      const res = await postAPI.getAll(p);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
      setPage(p);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(1); }, []);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [editingId]);

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      await postAPI.create({ content: newContent.trim(), category: newCategory, hasImage });
      toast.success('Post published');
      setNewContent('');
      setNewCategory('GENERAL');
      setHasImage(false);
      setShowForm(false);
      loadPosts(1);
    } catch {
      toast.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (post: Post) => {
    setEditingId(post._id);
    setEditContent(post.content);
    setEditCategory(post.category);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleUpdate = async (postId: string) => {
    if (!editContent.trim()) return;
    try {
      await postAPI.update(postId, { content: editContent.trim(), category: editCategory });
      toast.success('Post updated');
      setEditingId(null);
      loadPosts(page);
    } catch {
      toast.error('Failed to update post');
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await postAPI.delete(postId);
      toast.success('Post deleted');
      loadPosts(page);
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const canEdit = (post: Post) => {
    if (!user) return false;
    if (user.role === Role.ADMIN) return true;
    const authorId = typeof post.authorId === 'object' ? post.authorId._id : post.authorId;
    return authorId === (user._id ?? user.id);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#141414] dark:text-[#EEEEEE] tracking-tight">
            Community Board
          </h1>
          <p className="text-[#8A8A8A] dark:text-[#616161] mt-1 text-sm">
            Share updates, services, and events with your community
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary flex items-center gap-2 text-sm shrink-0"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {/* Create post form */}
      {showForm && (
        <div className="card mb-6 p-5">
          <h2 className="text-sm font-semibold text-[#141414] dark:text-[#EEEEEE] mb-4">
            What's on your mind?
          </h2>
          <textarea
            className="input-field w-full min-h-[100px] resize-none text-sm"
            placeholder="Write something for your community..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            maxLength={2000}
          />
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* Category picker */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                    newCategory === cat
                      ? categoryColors[cat] + ' ring-2 ring-offset-1 ring-current'
                      : 'bg-[#F6F6F6] dark:bg-[#1C1C1C] text-[#8A8A8A] dark:text-[#616161]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Image toggle */}
            <button
              onClick={() => setHasImage((v) => !v)}
              className={`ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                hasImage
                  ? 'bg-[#276EF1] text-white border-[#276EF1]'
                  : 'border-[#E2E2E2] dark:border-[#2C2C2C] text-[#8A8A8A] dark:text-[#616161] bg-white dark:bg-[#141414]'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              Image
            </button>

            <button
              onClick={handleCreate}
              disabled={!newContent.trim() || submitting}
              className="btn-primary text-xs px-4 py-2 disabled:opacity-40"
            >
              {submitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                'Publish'
              )}
            </button>
          </div>
          {newContent.length > 0 && (
            <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-2 text-right">
              {newContent.length}/2000
            </p>
          )}
        </div>
      )}

      {/* Posts feed */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#E2E2E2] dark:border-[#2C2C2C] border-t-[#276EF1] rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="card py-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EEEEEE] dark:bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-[#ADADAD] dark:text-[#616161]" />
          </div>
          <p className="font-semibold text-[#141414] dark:text-[#EEEEEE] text-sm">No posts yet</p>
          <p className="text-xs text-[#8A8A8A] dark:text-[#616161] mt-1">
            Be the first to share something with your community
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const author = typeof post.authorId === 'object' ? post.authorId : null;
            const isEditing = editingId === post._id;

            return (
              <div key={post._id} className="card p-5">
                {/* Author row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#141414] dark:bg-white flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white dark:text-[#141414]">
                        {author ? getInitials(author.name) : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#141414] dark:text-[#EEEEEE] leading-tight">
                        {author?.name ?? 'Unknown'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {author?.flatNumber && (
                          <span className="text-xs text-[#8A8A8A] dark:text-[#616161]">
                            {author.flatNumber}
                          </span>
                        )}
                        {author?.flatNumber && (
                          <span className="text-[#CCCCCC] dark:text-[#3C3C3C]">·</span>
                        )}
                        <span className="text-xs text-[#8A8A8A] dark:text-[#616161]">
                          {formatTime(post.createdAt)}
                        </span>
                        {post.createdAt !== post.updatedAt && (
                          <span className="text-xs text-[#ADADAD] dark:text-[#484848]">(edited)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[post.category]}`}>
                      {post.category}
                    </span>
                    {canEdit(post) && !isEditing && (
                      <>
                        <button
                          onClick={() => startEdit(post)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8A8A8A] dark:text-[#616161] hover:bg-[#F6F6F6] dark:hover:bg-[#1C1C1C] transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#F44336] hover:bg-[#FEE2E2] dark:hover:bg-[#F4433620] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Content */}
                {isEditing ? (
                  <div>
                    <textarea
                      ref={editRef}
                      className="input-field w-full min-h-[80px] resize-none text-sm"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      maxLength={2000}
                    />
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setEditCategory(cat)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                            editCategory === cat
                              ? categoryColors[cat] + ' ring-2 ring-offset-1 ring-current'
                              : 'bg-[#F6F6F6] dark:bg-[#1C1C1C] text-[#8A8A8A] dark:text-[#616161]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                      <div className="ml-auto flex gap-2">
                        <button
                          onClick={cancelEdit}
                          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(post._id)}
                          disabled={!editContent.trim()}
                          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 disabled:opacity-40"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[#141414] dark:text-[#EEEEEE] leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post attachment"
                        className="mt-3 w-full max-h-64 object-cover rounded-xl border border-[#E2E2E2] dark:border-[#242424]"
                        loading="lazy"
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => loadPosts(page - 1)}
                disabled={page <= 1}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="flex items-center text-sm text-[#8A8A8A] dark:text-[#616161] px-3">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => loadPosts(page + 1)}
                disabled={page >= totalPages}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityBoardPage;
