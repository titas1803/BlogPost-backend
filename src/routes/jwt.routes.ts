import express from 'express';
import { verifyJWT } from '../controllers/jwt.controller.js';

const app = express.Router();

app.get('/verify', verifyJWT);

export default app;
