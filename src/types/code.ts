export interface CreateCode {
  code?: Code;
  projectId: number;
}

export interface UpdateCode {
  id: number;
  code: Code;
  projectId: number;
}

export interface GetCode {
  id: number;
  projectId: number;
}

export type Code = {
  [key: string]: FileContent;
};

export interface FileContent {
  file?: {
    contents: string;
  };
  directory?: {
    [key: string]: FileContent;
  };
}
