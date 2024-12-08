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
    const stream = await anthropic.messages.create({
      model: "grok-beta",
      stream: true,
      max_tokens: 128,
      system: "you are a helpful assistant",
      messages: [
        {
          role: "user",
          content: "write a easy on javascript in 200 words",
        },
      ],
    });

    // Set proper headers for streaming JSON
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of stream) {
      console.log(chunk);
      const jsonChunk = {
        content:
          chunk.type === "content_block_delta"
            ? (chunk.delta as { type: "text_delta"; text: string }).text
            : "",
        type: chunk.type,
        // index: chunk.index,
        // index: chunk.index,
        message: chunk.type === "message_start" ? chunk.message : undefined,
      };
      res.write(JSON.stringify(jsonChunk) + "\n");
    }
    res.end();
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is runing on port http://localhost:${port}`);
});
