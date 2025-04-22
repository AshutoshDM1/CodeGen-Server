import { RequestHandler } from 'express';
import { CreateCode, UpdateCode, GetCode } from '../types/code';
import prismaClient from '../config/db';

const createCode: RequestHandler<{}, {}, CreateCode, {}> = async (req, res) => {
  const { code, projectId } = req.body;
  try {
    const response = await prismaClient.code.create({
      data: {
        code: code as any,
        projectId,
      },
    });
    res.status(201).json({ message: 'Code created successfully', response });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const updateCode: RequestHandler<{}, {}, UpdateCode, {}> = async (req, res) => {
  const { code, projectId } = req.body;
  try {
    const updatedCode = await prismaClient.code.update({
      where: {
        projectId,
      },
      data: {
        code: code as any,
      },
    });

    res.status(200).json({ message: 'Code updated successfully', code: updatedCode });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getCode: RequestHandler<{ projectId: string }, {}, {}, {}> = async (req, res) => {
  const { projectId } = req.params;
  try {
    const code = await prismaClient.code.findUnique({
      where: {
        projectId: parseInt(projectId),
      },
    });
    res.status(200).json({ message: 'Code fetched successfully', code });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export { createCode, getCode, updateCode };
