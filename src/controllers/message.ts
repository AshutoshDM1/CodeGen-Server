import { RequestHandler } from 'express';
import prismaClient from '../config/db';
import { CreateMessage, GetMessage } from '../types/message';

const createMessage: RequestHandler<{}, {}, CreateMessage, {}> = async (req, res) => {
  const { message, projectId } = req.body;
  try {
    const response = await prismaClient.message.create({
      data: {
        message: message,
        projectId: projectId,
      },
    });
    res.status(200).json({ message: response.message });
  } catch (error: any) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: error.message || 'Failed to create message' });
  }
};

const getMessage: RequestHandler<{}, {}, GetMessage, {}> = async (req, res) => {
  const { projectId } = req.body;
  const response = await prismaClient.message.findMany({
    where: {
      projectId: projectId,
    },
  });
  res.status(200).json({ messages: response });
};

export { createMessage, getMessage };
