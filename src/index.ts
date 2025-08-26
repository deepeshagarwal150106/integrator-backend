import express from 'express';
import {userRouter} from './router/user';
import {zapRouter} from './router/zap';
import {triggerRouter} from './router/trigger';
import {actionRouter} from './router/action';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/zap', authMiddleware, zapRouter);
app.use('/api/v1/trigger', authMiddleware, triggerRouter);
app.use('/api/v1/action', authMiddleware, actionRouter);
app.get('/', (req, res) => {
  res.send('Welcome to the Primary Backend API');
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});