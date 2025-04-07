import { RequestHandler } from 'express';
import prismaClient from '../config/db';
import { CreateProject, UpdateProject, DeleteProject, GetProject } from '../types/project';

const createProject: RequestHandler<{}, {}, CreateProject, {}> = async (req, res) => {
  const { projectName, projectDescription, userId } = req.body;
  try {
    const response = await prismaClient.project.create({
      data: {
        projectName,
        projectDescription,
        userId,
      },
    });
    res.status(200).json({ message: 'Project created', response });
  } catch (error: any) {
    res.status(500).json({ error: error || 'Failed to create project' });
  }
};

const updateProject: RequestHandler<{}, {}, UpdateProject, {}> = async (req, res) => {
  const { id, projectName, projectDescription, userId } = req.body;
  try {
    const response = await prismaClient.project.update({
      where: { id },
      data: { projectName, projectDescription, userId },
    });
    res.status(200).json({ message: 'Project updated', response });
  } catch (error: any) {
    res.status(500).json({ error: error || 'Failed to update project' });
  }
};

const deleteProject: RequestHandler<{}, {}, DeleteProject, {}> = async (req, res) => {
  const { id, userId } = req.body;
  try {
    const response = await prismaClient.project.delete({
      where: { id, userId },
    });
    res.status(200).json({ message: 'Project deleted', response });
  } catch (error: any) {
    res.status(500).json({ error: error || 'Failed to delete project' });
  }
};

const getProject: RequestHandler<{}, {}, GetProject, {}> = async (req, res) => {
  const { id, userId } = req.body;
  try {
    const response = await prismaClient.project.findUnique({
      where: { id, userId },
    });
    res.status(200).json({ message: response });
  } catch (error: any) {
    res.status(500).json({ error: error || 'Failed to fetch project' });
  }
};

const getAllProject: RequestHandler<{}, {}, { userEmail: string }, {}> = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const response = await prismaClient.user.findMany({
      where: { email: userEmail },
    });
    res.status(200).json({ message: 'Projects fetched', response });
  } catch (error: any) {
    res.status(500).json({ error: error || 'Failed to fetch project' });
  }
};

export { createProject, updateProject, deleteProject, getProject, getAllProject };
