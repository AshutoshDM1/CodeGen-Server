import { Router } from "express";
import { BASE_PROMPT, getSystemPrompt } from "../helper/prompts";
import { basePrompt as nodeBasePrompt } from "../defaults/node";
import { basePrompt as reactBasePrompt } from "../defaults/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { defaultresult } from "../helper/demo";
dotenv.config();

const router = Router();
const API = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(API);

router.post("/template", async (req, res) => {
  const modelTemplate = genAI.getGenerativeModel({
    model: "gemini-2.0-pro-exp-02-05",
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

router.post("/refinePrompt", async (req, res) => {
  try {
    const { prompt } = req.body;

    const modelRefine = genAI.getGenerativeModel({
      model: "gemini-2.0-pro-exp-02-05",
      systemInstruction:
        "You are a helpful assistant that refines prompts for Website genteration AI Agent dont add any extra content just return the refined prompt which out any typos or errors also add to do inhancement in the prompt",
    });

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const result = await modelRefine.generateContent({
      contents,
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.1,
      },
    });
    let answer = result.response.text();
    answer = answer.trim();
    res.json({ answer });
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
      role: "user",
      parts: [
        {
          text: msg.content,
        },
      ],
    }));

    const modelTemplate = genAI.getGenerativeModel({
      model: "gemini-2.0-pro-exp-02-05",
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
      for (const char of chunkText) {
        res.write(char);
        await new Promise((resolve) => setTimeout(resolve, 5)); // 10ms delay
      }
    }
    res.end();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

router.post("/chatDemo", async (req, res) => {
  try {
    // Set the content type to plain text
    res.setHeader("Content-Type", "text/plain");

    // Stream the defaultresult variable character by character
    for (const char of defaultresult) {
      res.write(char);
      await new Promise((resolve) => setTimeout(resolve, 7)); // 5ms delay
    }
    res.end();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

export default router;
