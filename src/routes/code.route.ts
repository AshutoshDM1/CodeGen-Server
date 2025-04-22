import { Router } from 'express';
import { createCode, getCode, updateCode } from '../controllers/code';

const CodeRouter = Router();

CodeRouter.post('/createCode', createCode);
CodeRouter.get('/getCode/:projectId', getCode);
CodeRouter.put('/updateCode', updateCode);

export default CodeRouter;
