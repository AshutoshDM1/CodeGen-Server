export interface CreateProject {
  projectName: string;
  projectDescription: string;
  userEmail: string;
}

export interface UpdateProject {
  id: number;
  projectName?: string;
  projectDescription?: string;
  userId: number;
}

export interface GetProject {
  id: number;
  userId: number;
}
export interface DeleteProject {
  id: number;
  userId: number;
}
