import { Router } from "express";
import { BASE_PROMPT, getSystemPrompt } from "../helper/prompts";
import { basePrompt as nodeBasePrompt } from "../defaults/node";
import { basePrompt as reactBasePrompt } from "../defaults/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const API = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API);

router.post("/template", async (req, res) => {
  const modelTemplate = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
  });
  try {
    const prompt = req.body.prompt;

    const result = await modelTemplate.generateContent(prompt, {});
    let answer = result.response.text();
    console.log(answer);
    answer = answer.trim();

    if (answer === "react") {
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
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // Transform messages into Gemini's content format
    const contents = messages.map((msg: any) => ({
      role: msg.role,
      parts: [
        {
          text: msg.content,
        },
      ],
    }));

    const modelTemplate = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: getSystemPrompt(),
    });

    const result = await modelTemplate.generateContentStream({
      contents,
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.1,
      },
    });

    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      res.write(chunkText);
    }
    res.end();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

export default router;
