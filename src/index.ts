import express from "express";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
const port: Number = 4000;
const API = process.env.GROK_API;

const anthropic = new Anthropic({
  apiKey: `${API}`,
  baseURL: "https://api.x.ai/",
});

app.get("/", async (req, res) => {
  res.status(300).json({ msg: "Welcome to CodeGen Server" });
});

app.get("/chat", async (req, res) => {
  try {
    const stream = await anthropic.messages.create({
      model: "grok-beta",
      stream: true,
      max_tokens: 128,
      system:
        "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
      messages: [
        {
          role: "user",
          content: "What is the meaning of life, the universe, and everything?",
        },
      ],
    });

    for await (const chunk of stream) {
      res.write(JSON.stringify(chunk));
    }
    res.end();
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is runing on port http://localhost:${port}`);
});
