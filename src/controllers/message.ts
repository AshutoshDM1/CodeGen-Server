import { RequestHandler } from 'express';

const createMessage: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
  res.status(200).json({ msg: 'Message created' });
};

const getMessage: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
  res.status(200).json({ msg: 'Message created' });
};

export { createMessage, getMessage };
