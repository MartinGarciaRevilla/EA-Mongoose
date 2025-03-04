import { Schema, Types, model } from 'mongoose';

export interface IComment {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
});

export const CommentModel = model<IComment>('Comment', commentSchema);