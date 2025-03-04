import mongoose from 'mongoose';
import { UserModel, IUser } from './user.js';
import { PostModel, IPost } from './post.js';

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
  const user2 = await newUser.save();
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

  // Agregar un comentario embebido dentro del post
  const postToUpdate = await PostModel.findById(savedPost._id);
  if (postToUpdate) {
    postToUpdate.comments?.push({
      content: '¡Me encantó este post!',
      author: user2._id as mongoose.Types.ObjectId
    });

    await postToUpdate.save();
    console.log("Comentario agregado al post:", postToUpdate);
  }

  // Asociar el post al usuario
  user2.posts?.push(savedPost._id as mongoose.Types.ObjectId);
  await user2.save();

  // Leer usuario con sus posts
  const populatedUser = await UserModel.findById(user2._id)
    .populate('posts');
  console.log("Usuario con posts:", populatedUser);

  // Leer post con comentarios embebidos
  const populatedPost = await PostModel.findById(savedPost._id);
  console.log("Post con comentarios embebidos:", populatedPost);

  // Actualizar un post
  await PostModel.updateOne({ _id: savedPost._id }, { title: 'Título actualizado' });
  console.log("Post actualizado");

  // Actualizar un comentario embebido
  const postWithComment = await PostModel.findById(savedPost._id);
  if (postWithComment) {
    const comment = postWithComment.comments?.find(c => c.author.equals(user2._id));
    if (comment) {
      comment.content = "Comentario actualizado";
      await postWithComment.save();
      console.log("Comentario actualizado:", postWithComment);
    }
  }

  // Eliminar un comentario embebido
  const postToDeleteComment = await PostModel.findById(savedPost._id);
  if (postToDeleteComment) {
    postToDeleteComment.comments = postToDeleteComment.comments?.filter(
      c => !c.author.equals(user2._id)
    ) || [];
    await postToDeleteComment.save();
    console.log("Comentario eliminado:", postToDeleteComment);
  }

  // Aggregation: contar comentarios en un post
  const commentCount = await PostModel.aggregate([
    { $match: { _id: savedPost._id } },
    { $project: { totalComments: { $size: "$comments" } } }
  ]);
  console.log("Número de comentarios en el post:", commentCount);

  // Cerrar la conexión
  mongoose.connection.close();
}

main();
