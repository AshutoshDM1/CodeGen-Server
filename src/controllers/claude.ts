import { RequestHandler } from 'express';
import { BASE_PROMPT, getSystemPrompt } from '../helper/prompts';
import { basePrompt as nodeBasePrompt } from '../defaults/node';
import { basePrompt as reactBasePrompt } from '../defaults/react';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { ChatRequest, TemplateRequest } from '../controllers/gemini';
dotenv.config();

const API_KEY = process.env.AnthropicAI || '';
const anthropic = new Anthropic({
  apiKey: API_KEY,
});

const template: RequestHandler<{}, {}, TemplateRequest, {}> = async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 100,
      system:
        "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    let answer = '';
    if (message.content[0].type === 'text') {
      answer = message.content[0].text;
    }
    console.log(answer);
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

const chat: RequestHandler<{}, {}, ChatRequest, {}> = async (req, res) => {
  try {
    const { messages } = req.body;

    // Transform messages into Anthropic's format
    const transformedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Create a streaming response
    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      system: getSystemPrompt(),
      messages: transformedMessages,
      stream: true,
      temperature: 0.1,
    });

    res.setHeader('Content-Type', 'text/plain');

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
        const chunkText = chunk.delta.text;
        for (const char of chunkText) {
          res.write(char);
          await new Promise((resolve) => setTimeout(resolve, 10)); // 10ms delay
        }
      }
    }

    res.end();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export { template, chat };
