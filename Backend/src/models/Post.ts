import mongoose, { Schema, Document } from 'mongoose';

export enum PostCategory {
  GENERAL = 'GENERAL',
  SERVICE = 'SERVICE',
  EVENT = 'EVENT',
  SALE = 'SALE',
  HELP = 'HELP',
}

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  content: string;
  category: PostCategory;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    authorId:    { type: Schema.Types.ObjectId, ref: 'User',      required: true, index: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true, index: true },
    content:     { type: String, required: true, trim: true, maxlength: 2000 },
    category:    { type: String, enum: Object.values(PostCategory), default: PostCategory.GENERAL },
    imageUrl:    { type: String, trim: true },
  },
  { timestamps: true }
);

postSchema.index({ communityId: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
