import { Schema, Types, model } from 'mongoose';

// Interfaz de un comentario embebido
interface IComment {
  content: string;
  author: Types.ObjectId;
  createdAt?: Date;
}

// Interfaz del Post
export interface IPost {
  title: string;
  content: string;
  author: Types.ObjectId;
  comments?: IComment[]; // Ahora los comentarios están embebidos
}

// Esquema de los comentarios embebidos
const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Esquema del Post con comentarios embebidos
const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [commentSchema] // Array de comentarios embebidos
});

// Modelo de Post
export const PostModel = model<IPost>('Post', postSchema);
