import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getAllProject,
  getProject,
  updateProject,
} from '../controllers/project';

const porjectRouter = Router();

porjectRouter.post('/getProject', getProject);
porjectRouter.post('/getAllProject', getAllProject);
porjectRouter.post('/createProject', createProject);
porjectRouter.put('/updateProject', updateProject);
porjectRouter.delete('/deleteProject', deleteProject);

export default porjectRouter;
