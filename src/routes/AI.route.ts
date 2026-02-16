import { Router } from 'express';
import { template, refinePrompt, AiChat, AiChatDemo } from '../controllers/gemini';

const AiRoute = Router();

AiRoute.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Welcome to CodeGen Server Ai Route' });
});
AiRoute.post('/template', template);
AiRoute.post('/refinePrompt', refinePrompt);
AiRoute.post('/chat', AiChat);
AiRoute.post('/demochat', AiChatDemo);

export default AiRoute;
