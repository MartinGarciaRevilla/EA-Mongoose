import { Schema, Types, model } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  author: Types.ObjectId;
  comments?: Types.ObjectId[];
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

export const PostModel = model<IPost>('Post', postSchema);