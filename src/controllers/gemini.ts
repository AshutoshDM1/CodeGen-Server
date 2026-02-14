import { RequestHandler } from 'express';
import { BASE_PROMPT, getSystemPrompt } from '../helper/prompts';
import { basePrompt as nodeBasePrompt } from '../defaults/node';
import { basePrompt as reactBasePrompt } from '../defaults/react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { defaultresult } from '../helper/demo';
import demoAiChat from '../config/demoAiChat';
dotenv.config();

const API = process.env.GOOGLE_API_KEY || '';
const genAI = new GoogleGenerativeAI(API);

export interface TemplateRequest {
  prompt: string;
}

export interface RefinePromptRequest {
  prompt: string;
}

export interface ChatRequest {
  messages: any[];
}

const template: RequestHandler<{}, {}, TemplateRequest, {}> = async (req, res) => {
  const modelTemplate = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction:
      "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
  });
  try {
    const prompt = req.body.prompt;

    const result = await modelTemplate.generateContent(prompt, {});
    let answer = result.response.text();
    answer = answer.trim();

    if (answer === 'react') {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.Here is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer === 'node') {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.Here is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: 'You cant access this' });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const refinePrompt: RequestHandler<{}, {}, RefinePromptRequest, {}> = async (req, res) => {
  try {
    const { prompt } = req.body;

    const modelRefine = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction:
        "You are a specialized prompt refiner for React with TypeScript website generation in Vite. Your task is to enhance user prompts by: 1) Fixing typos and grammatical errors, 2) Clarifying requirements, and 3) Making the prompt more specific. Return ONLY the refined prompt without adding any new features, components, or functionality that wasn't explicitly requested. Do not add explanations, disclaimers, or additional content. Keep the scope limited to what was originally requested, even if minimal.",
    });

    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    // Use streaming response like in the chat route
    const result = await modelRefine.generateContentStream({
      contents,
      generationConfig: {
        maxOutputTokens: 4000,
        temperature: 0.1,
      },
    });

    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      for (const char of chunkText) {
        res.write(char);
        await new Promise((resolve) => setTimeout(resolve, 5)); // 5ms delay
      }
    }
    res.end();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const AiChat: RequestHandler<{}, {}, ChatRequest, {}> = async (req, res) => {
  try {
    const { messages } = req.body;

    // Transform messages into Gemini's content format
    const contents = messages.map((msg: any) => ({
      role: 'user',
      parts: [
        {
          text: msg.content,
        },
      ],
    }));

    const modelTemplate = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: getSystemPrompt(),
    });

    const result = await modelTemplate.generateContent({
      contents,
      generationConfig: {
        maxOutputTokens: 15000,
        temperature: 0.5,
      },
    });

    const text = result.response.text();
    res.setHeader('Content-Type', 'text/plain');
    res.send(text);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const AiChatDemo: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
  try {
    res.send(demoAiChat);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export { template, refinePrompt, AiChat, AiChatDemo };
