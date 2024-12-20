import express from "express";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";
import { BASE_PROMPT, getSystemPrompt } from "./helper/prompts";
import { ContentBlock, TextBlock } from "@anthropic-ai/sdk/resources";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

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
      max_tokens: 8000,
      system: getSystemPrompt(),
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

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  const response = await anthropic.messages.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 200,
    system:
      "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
  });

  const answer = (response.content[0] as TextBlock).text; // react or node
  if (answer == "react") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
    return;
  }

  if (answer === "node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt],
    });
    return;
  }

  res.status(403).json({ message: "You cant access this" });
  return;
});

app.listen(port, () => {
  console.log(`Server is runing on port http://localhost:${port}`);
});
