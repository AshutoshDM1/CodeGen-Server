import express from "express";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
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
    const stream: any = await anthropic.messages.create({
      model: "grok-beta",
      stream: true,
      max_tokens: 3000,
      system:
        "you are a helpful assistant who write code in js you will only give code anything else is not allowed",
      messages: [
        {
          role: "user",
          content: "write a normal code to sum two numbers in js ",
        },
      ],
    });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");
    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta") {
        res.write(chunk.delta.text);
      }
    }
    res.end();
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is runing on port http://localhost:${port}`);
});
