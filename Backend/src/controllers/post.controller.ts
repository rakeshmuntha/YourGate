import { Response } from 'express';
import { AuthRequest } from '../types';
import { PostService } from '../services/post.service';
import { PostCategory } from '../models/Post';

const service = new PostService();

export class PostController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { content, category, hasImage } = req.body;
      const post = await service.createPost({
        authorId:    req.user!.userId,
        communityId: req.user!.communityId!,
        content,
        category,
        hasImage,
      });
      res.status(201).json({ post });
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ message: err.message });
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page  = parseInt(req.query.page  as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const data = await service.getCommunityPosts(req.user!.communityId!, page, limit);
      res.json(data);
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ message: err.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { content, category } = req.body;
      const post = await service.updatePost(
        req.params.id,
        req.user!.userId,
        req.user!.role,
        content,
        category,
      );
      res.json({ post });
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ message: err.message });
    }
  }

  async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await service.deletePost(req.params.id, req.user!.userId, req.user!.role);
      res.json({ message: 'Post deleted' });
    } catch (err: any) {
      res.status(err.statusCode ?? 500).json({ message: err.message });
    }
  }
}
