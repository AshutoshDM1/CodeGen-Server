import { Router } from "express";
import { BASE_PROMPT, getSystemPrompt } from "../helper/prompts";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import { basePrompt as nodeBasePrompt } from "../defaults/node";
import { basePrompt as reactBasePrompt } from "../defaults/react";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const API = process.env.GROK_API;
const anthropic = new Anthropic({
  apiKey: `${API}`,
  baseURL: "https://api.x.ai/",
});

router.post("/template", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await anthropic.messages.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "grok-beta",
      max_tokens: 200,
      system:
        "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
    });
    const answer = (response.content[0] as TextBlock).text; // react or node
    if (answer == "react") {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.Here is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer === "node") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.Here is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: "You cant access this" });
    return;
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const stream: any = await anthropic.messages.create({
      model: "grok-beta",
      stream: true,
      max_tokens: 8000,
      system: getSystemPrompt(),
      messages: messages,
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

export default router;
