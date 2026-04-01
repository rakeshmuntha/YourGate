import { Post, PostCategory } from '../models/Post';
import { User } from '../models/User';
import { AppError } from '../utils/errors';
import { Role } from '../types';

const DUMMY_IMAGE = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop';

export class PostService {
  async createPost(data: {
    authorId: string;
    communityId: string;
    content: string;
    category?: PostCategory;
    hasImage?: boolean;
  }) {
    const post = await Post.create({
      authorId:    data.authorId,
      communityId: data.communityId,
      content:     data.content,
      category:    data.category ?? PostCategory.GENERAL,
      imageUrl:    data.hasImage ? DUMMY_IMAGE : undefined,
    });

    return Post.findById(post._id).populate('authorId', 'name flatNumber role');
  }

  async getCommunityPosts(communityId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find({ communityId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('authorId', 'name flatNumber role'),
      Post.countDocuments({ communityId }),
    ]);
    return { posts, total, totalPages: Math.ceil(total / limit), page };
  }

  async updatePost(postId: string, requesterId: string, requesterRole: Role, content: string, category?: PostCategory) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    const isOwner = post.authorId.toString() === requesterId;
    const isAdmin = requesterRole === Role.ADMIN;
    if (!isOwner && !isAdmin) throw new AppError('Not authorised to edit this post', 403);

    post.content = content;
    if (category) post.category = category;
    await post.save();
    return Post.findById(postId).populate('authorId', 'name flatNumber role');
  }

  async deletePost(postId: string, requesterId: string, requesterRole: Role) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    const isOwner = post.authorId.toString() === requesterId;
    const isAdmin = requesterRole === Role.ADMIN;
    if (!isOwner && !isAdmin) throw new AppError('Not authorised to delete this post', 403);

    await post.deleteOne();
  }
}
