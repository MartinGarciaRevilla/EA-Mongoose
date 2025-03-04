import mongoose from 'mongoose';
import { UserModel, IUser } from './user.js';
import { PostModel, IPost } from './post.js';
import { CommentModel, IComment } from './comment.js'

async function main() {
  mongoose.set('strictQuery', true);

  await mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar:', err));

  // Crear un usuario
  const user1: IUser = {
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  };

  console.log("user1:", user1);
  const newUser = new UserModel(user1);
  const user2 = await newUser.save(); // user2 ahora es una instancia del modelo
  console.log("Usuario creado:", user2);

  // Crear un post vinculado al usuario
  const post1: IPost = {
    title: 'Mi primer post',
    content: 'Este es el contenido del post.',
    author: user2._id as mongoose.Types.ObjectId
  };

  const newPost = new PostModel(post1);
  const savedPost = await newPost.save();
  console.log("Post creado:", savedPost);

  // Crear un comentario vinculado al post y usuario
  const comment1: IComment = {
    content: '¡Me encantó este post!',
    author: user2._id as mongoose.Types.ObjectId,
    post: savedPost._id as mongoose.Types.ObjectId
  };

  const newComment = new CommentModel(comment1);
  const savedComment = await newComment.save();
  console.log("Comentario creado:", savedComment);

  // Vincular post y comentario al usuario
  user2.posts?.push(savedPost._id as mongoose.Types.ObjectId);
  user2.comments?.push(savedComment._id as mongoose.Types.ObjectId);
  await user2.save();

  // Vincular comentario al post
  savedPost.comments?.push(savedComment._id as mongoose.Types.ObjectId);
  await savedPost.save();

  // Leer usuario con sus posts y comentarios
  const populatedUser = await UserModel.findById(user2._id)
    .populate('posts')
    .populate('comments');
  console.log("Usuario con posts y comentarios:", populatedUser);

  // Leer post con sus comentarios
  const populatedPost = await PostModel.findById(savedPost._id).populate('comments');
  console.log("Post con comentarios:", populatedPost);

  // Actualizar un post
  await PostModel.updateOne({ _id: savedPost._id }, { title: 'Título actualizado' });
  console.log("Post actualizado");

  // Eliminar un comentario
  await CommentModel.deleteOne({ _id: savedComment._id });
  console.log("Comentario eliminado");

  // Aggregation: contar comentarios por post
  const commentCount = await CommentModel.aggregate([
    { $match: { post: savedPost._id } },
    { $group: { _id: '$post', totalComments: { $sum: 1 } } }
  ]);
  console.log("Número de comentarios en el post:", commentCount);

  // Cerrar la conexión
  mongoose.connection.close();
}

main();
