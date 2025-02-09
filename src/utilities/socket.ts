import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { IPopulatedPost, IPost } from './types.js';

let io: Server;

const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      methods: 'GET,POST,PATCH,PUT,DELETE',
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room for a specific user's profile
    socket.on('join_profile', (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined room: ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

// Function to emit a update post event
export function emitUpdatePost(userid: string, post: IPopulatedPost) {
  if (io) {
    // console.log('updated post', post);
    io.to(userid).emit('update_post', post); // Notify all clients
  }
}

export function emitNewPost(userid: string, post: IPopulatedPost) {
  if (io) {
    // console.log('new post', post);
    io.to(userid).emit('new_post', post); // Notify all clients
  }
}

export function emitDeletePost(userid: string, postid: string) {
  if (io) {
    io.to(userid).emit('delete_post', postid);
  }
}
export default initSocket;
