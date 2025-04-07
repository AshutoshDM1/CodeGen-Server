export interface CreateMessage {
  message: MessageContent;
  projectId: number;
  userId: number;
}

type MessageContent = {
  role: 'user' | 'assistant';
  content: string;
};

export interface GetMessage {
  id: number;
  projectId: number;
}
