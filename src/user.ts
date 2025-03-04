import { Schema, Types, model } from 'mongoose';

// Interfaz para un usuario
export interface IUser {
  name: string;
  email: string;
  avatar?: string;
  posts?: Types.ObjectId[];
  _id?: Types.ObjectId;
}

// Esquema del usuario
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }] // Mantiene la relación con los posts
});

// Modelo de usuario
export const UserModel = model<IUser>('User', userSchema);
