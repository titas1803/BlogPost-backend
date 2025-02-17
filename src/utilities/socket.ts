import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { IPopulatedPost, IUserDetails } from './types.js';

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
    });

    // Leave a room for a specific user's profile
    socket.on('leave_profile', (userId) => {
      socket.leave(userId);
    });

    // Join a room for a specific post
    socket.on('join_post', (postId) => {
      socket.join(postId);
    });
    // Leave a room for a specific post
    socket.on('leave_post', (postId) => {
      socket.leave(postId);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export function emitProfileDetailsUpdate(
  userid: string,
  userDetails: IUserDetails
) {
  if (io) {
    io.to(userid).emit('update_details', userDetails);
  }
}

export function emitNewPost(userid: string, post: IPopulatedPost) {
  if (io) {
    io.to(userid).emit('new_post', post); // Notify all clients
  }
}

// Function to emit a update post event
export function emitUpdatePostInProfile(userid: string, post: IPopulatedPost) {
  if (io) {
    io.to(userid).emit('update_post_inprofile', post); // Notify all clients
  }
}

export function emitDeletePostInProfile(userid: string, postid: string) {
  if (io) {
    io.to(userid).emit('delete_post_inprofile', postid);
  }
}
// Function to emit a update post event
export function emitUpdatePost(postid: string, post: IPopulatedPost) {
  if (io) {
    io.to(postid).emit('update_post', post); // Notify all clients
  }
}

export function emitDeletePost(postid: string) {
  if (io) {
    io.to(postid).emit('delete_post', postid);
  }
}
export default initSocket;
