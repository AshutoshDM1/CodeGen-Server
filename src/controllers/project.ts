import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Project {
  name: string;
  description: string;
  userId: string;
  lastUpdatedCode: string;
  messages: [];
}

const createProject: RequestHandler<{}, {}, Project, {}> = async (req, res) => {
  res.status(200).json({ msg: 'Project created' });
};

const updateProject: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
  res.status(200).json({ msg: 'Project updated' });
};

const deleteProject: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
  res.status(200).json({ msg: 'Project deleted' });
};

const getProject: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
  res.status(200).json({ msg: 'Project fetched' });
};

export { createProject, updateProject, deleteProject, getProject };
