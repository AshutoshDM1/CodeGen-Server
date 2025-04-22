import { RequestHandler } from 'express';
import prismaClient from '../config/db';
import { CreateProject, UpdateProject, DeleteProject, GetProject } from '../types/project';

const createProject: RequestHandler<{}, {}, CreateProject, {}> = async (req, res) => {
  const { projectName, projectDescription, userEmail } = req.body;
  try {
    const userResponse = await prismaClient.user.findUnique({
      where: { email: userEmail },
    });
    const response = await prismaClient.project.create({
      data: {
        projectName,
        projectDescription,
        user: {
          connect: {
            id: userResponse?.id,
          },
        },
      },
    });
    res.status(200).json({ message: 'Project created', response });
  } catch (error: any) {
    console.log(error);
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

const deleteProject: RequestHandler<{ id: string }, {}, {}, {}> = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await prismaClient.project.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Project deleted', response });
  } catch (error: any) {
    res.status(500).json({ error: error || 'Failed to delete project' });
  }
};

const getProject: RequestHandler<{ id: string }, {}, {}, {}> = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await prismaClient.project.findUnique({
      where: { id: parseInt(id) },
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
    const projectResponse = await prismaClient.project.findMany({
      where: { userId: response[0].id },
    });
    res.status(200).json({ message: 'Projects fetched', projectResponse });
  } catch (error: any) {
    res.status(500).json({ error: error || 'Failed to fetch project' });
  }
};

export { createProject, updateProject, deleteProject, getProject, getAllProject };
