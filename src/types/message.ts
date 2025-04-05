export interface CreateMessage {
  id: number;
  content: MessageContent[];
  projectId: number;
}

type MessageContent = {
  role: 'user' | 'assistant';
  content: string;
};

export interface GetMessage {
  id: number;
  projectId: number;
}
