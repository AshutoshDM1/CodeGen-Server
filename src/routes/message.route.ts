import { Router } from 'express';
import { createMessage, getMessage } from '../controllers/message';
const messageRouter = Router();

messageRouter.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Message Route' });
});

messageRouter.post('/createMessage', createMessage);
messageRouter.post('/getMessage', getMessage);

export default messageRouter;
