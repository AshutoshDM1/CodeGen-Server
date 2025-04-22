import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AiRoute from './routes/AI.route';
import MessageRoute from './routes/message.route';
import ProjectRoute from './routes/project.route';
import CodeRoute from './routes/code.route';
import SwaggerRoute from './routes/swagger.route';
dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://codegen.elitedev.tech',
      'https://codegen-aws.elitedev.tech',
      'http://localhost:4000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(express.json());
const port: Number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

app.use('/api/v1/ai', AiRoute);
app.use('/api/v1/message', MessageRoute);
app.use('/api/v1/project', ProjectRoute);
app.use('/api/v1/code', CodeRoute);
app.use('/api-docs', SwaggerRoute);

app.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Welcome to CodeGen Server v2' });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});
