import { Router } from 'express';
import { createMessage, getMessage } from '../controllers/message';
const messageRouter = Router();

messageRouter.post('/createMessage', createMessage);
messageRouter.post('/getMessage', getMessage);

export default messageRouter;
