import express from 'express';
import { config } from 'dotenv';
import { connectDB } from './utilities/dbConnect.js';
import { errorMiddleWare } from './middlewares/errorHandler.js';
import commentRoute from './routes/comment.routes.js';
import userRoute from './routes/user.routes.js';
import loginRoute from './routes/login.routes.js';
import postRoute from './routes/post.routes.js';
import subscribeRoute from './routes/subscribe.routes.js';
import jwtRoute from './routes/jwt.routes.js';
import cors from 'cors';
import { createServer } from 'http';
import initSocket from './utilities/socket.js';

config();

connectDB();
const PORT = process.env.BLOGPOST_BACKEND_PORT ?? 3000;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,POST,PATCH,PUT,DELETE',
  })
);

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API working with /api/v1');
});

app.use('/api/v1/login', loginRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/comment', commentRoute);
app.use('/api/v1/sub', subscribeRoute);
app.use('/api/v1/jwt', jwtRoute);

app.use('/uploads', express.static('uploads'));

app.use(errorMiddleWare);

const http = createServer(app);

initSocket(http);

http.listen(PORT, () => {
  console.log(`BlogPost is running at port ${PORT}`);
});
