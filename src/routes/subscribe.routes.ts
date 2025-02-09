import express from 'express';
import { authenticateToken } from '../middlewares/userAuthentication.js';
import {
  getSubscribers,
  getSubscribeTo,
  subscribe,
  unSubscribe,
} from '../controllers/subscribe.controller.js';

const app = express.Router();

/**
 * /api/v1/sub
 */

app.use(authenticateToken);

app.put('/subscribe/:authorid', subscribe);
app.put('/unsubscribe/:authorid', unSubscribe);

app.get('/getSubscribers', getSubscribers);

app.get('/getSubscribeTo', getSubscribeTo);
app.get('/getSubscribeTo/:authorid', getSubscribeTo);

export default app;
