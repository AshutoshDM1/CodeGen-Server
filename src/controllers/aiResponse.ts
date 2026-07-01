import { RequestHandler } from 'express';
import { BASE_PROMPT, getSystemPrompt } from '../helper/prompts';
import { basePrompt as nodeBasePrompt } from '../defaults/node';
import { basePrompt as reactBasePrompt } from '../defaults/react';
import { generateText, streamText, ModelMessage } from 'ai';
import { activeModel } from '../helper/ai';
import dotenv from 'dotenv';
import demoAiChat from '../config/demoAiChat';
dotenv.config();

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
  try {
    const prompt = req.body.prompt;

    const { text } = await generateText({
      model: activeModel,
      system:
        "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
      prompt: prompt,
    });

    let answer = text.trim();

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

    const result = await streamText({
      model: activeModel,
      system:
        "You are a specialized prompt refiner for React with TypeScript website generation in Vite. Your task is to enhance user prompts by: 1) Fixing typos and grammatical errors, 2) Clarifying requirements, and 3) Making the prompt more specific. Return ONLY the refined prompt without adding any new features, components, or functionality that wasn't explicitly requested. Do not add explanations, disclaimers, or additional content. Keep the scope limited to what was originally requested, even if minimal.",
      prompt: prompt,
      temperature: 0.1,
      maxOutputTokens: 4000,
    });

    res.setHeader('Content-Type', 'text/plain');

    for await (const textPart of result.textStream) {
      for (const char of textPart) {
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

    // Transform messages into Vercel AI SDK ModelMessage format
    const transformedMessages: ModelMessage[] = messages.map((msg: any) => ({
      role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    }));

    const { text } = await generateText({
      model: activeModel,
      system: getSystemPrompt(),
      messages: transformedMessages,
      temperature: 0.5,
      maxOutputTokens: 15000,
    });

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
