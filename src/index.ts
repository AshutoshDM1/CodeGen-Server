import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AiRoute from './routes/AI.route';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port: Number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

app.use('/api/ai ', AiRoute);

app.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Welcome to CodeGen Server' });
});

app.listen(port, () => {
  console.log(`Server is runing on port http://localhost:${port}`);
});
