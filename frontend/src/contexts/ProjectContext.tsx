import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  Project, Task, TaskStatus, TaskPriority,
  ProjectResponse, ProjectsResponse, TaskResponse, TasksResponse, DeleteResponse
} from "@/types";
import { api } from "@/lib/api";

interface ProjectState {
  projects: Project[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  createProject: (projectName: string, description: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, updates: { projectName?: string; description?: string }) => Promise<void>;
  getProject: (id: string) => Promise<Project>;
  addTask: (projectId: string, title: string, description: string, priority: TaskPriority, dueDate?: string) => Promise<void>;
  updateTask: (projectId: string, taskId: string, updates: Partial<Omit<Task, "_id" | "createdAt">>) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  changeTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => Promise<void>;
  fetchTasks: (projectId: string, page?: number, limit?: number, status?: TaskStatus) => Promise<TasksResponse["data"]>;
}

const ProjectContext = createContext<ProjectState | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ProjectsResponse>("/projects");
      setProjects(res.data.projects);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectName: string, description: string) => {
    const res = await api.post<ProjectResponse>("/projects", { projectName, description });
    setProjects((p) => [...p, res.data.project]);
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await api.delete<DeleteResponse>(`/projects/${id}`);
    setProjects((p) => p.filter((proj) => proj._id !== id));
  }, []);

  const updateProject = useCallback(async (id: string, updates: { projectName?: string; description?: string }) => {
    const res = await api.put<ProjectResponse>(`/projects/${id}`, updates);
    setProjects((p) => p.map((proj) => (proj._id === id ? res.data.project : proj)));
  }, []);

  const getProject = useCallback(async (id: string) => {
    const res = await api.get<ProjectResponse>(`/projects/${id}`);
    return res.data.project;
  }, []);

  const addTask = useCallback(async (projectId: string, title: string, description: string, priority: TaskPriority, dueDate?: string) => {
    const body: Record<string, string> = { title, description, priority, status: "todo" };
    if (dueDate) body.dueDate = dueDate;
    const res = await api.post<TaskResponse>(`/projects/${projectId}/tasks`, body);
    setProjects((p) =>
      p.map((proj) =>
        proj._id === projectId ? { ...proj, tasks: [...(proj.tasks || []), res.data.task] } : proj
      )
    );
  }, []);

  const updateTask = useCallback(async (projectId: string, taskId: string, updates: Partial<Omit<Task, "_id" | "createdAt">>) => {
    const res = await api.put<TaskResponse>(`/projects/${projectId}/tasks/${taskId}`, updates);
    setProjects((p) =>
      p.map((proj) =>
        proj._id === projectId
          ? { ...proj, tasks: (proj.tasks || []).map((t) => (t._id === taskId ? res.data.task : t)) }
          : proj
      )
    );
  }, []);

  const deleteTask = useCallback(async (projectId: string, taskId: string) => {
    await api.delete<DeleteResponse>(`/projects/${projectId}/tasks/${taskId}`);
    setProjects((p) =>
      p.map((proj) =>
        proj._id === projectId
          ? { ...proj, tasks: (proj.tasks || []).filter((t) => t._id !== taskId) }
          : proj
      )
    );
  }, []);

  const changeTaskStatus = useCallback(async (projectId: string, taskId: string, status: TaskStatus) => {
    await updateTask(projectId, taskId, { status });
  }, [updateTask]);

  const fetchTasks = useCallback(async (projectId: string, page = 1, limit = 10, status?: TaskStatus) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set("status", status);
    const res = await api.get<TasksResponse>(`/projects/${projectId}/tasks?${params}`);
    return res.data;
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects, loading, fetchProjects, createProject, deleteProject, updateProject,
        getProject, addTask, updateTask, deleteTask, changeTaskStatus, fetchTasks,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectProvider");
  return ctx;
};
