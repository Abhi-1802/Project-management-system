export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  projectName: string;
  description: string;
  color?: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface MeResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface ProjectResponse {
  success: boolean;
  data: {
    project: Project;
  };
}

export interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
  };
}

export interface TaskResponse {
  success: boolean;
  data: {
    task: Task;
  };
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
