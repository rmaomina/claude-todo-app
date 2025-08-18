export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Epic {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  userId: string;
  user?: User;
  stories?: Story[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Story {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  epicId?: string | null;
  epic?: Epic | null;
  userId: string;
  user?: User;
  tasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  status: TaskStatus;
  priority: Priority;
  storyId?: string | null;
  story?: Story | null;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: Priority;
  storyId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TaskStatus;
  priority?: Priority;
  storyId?: string;
}

export interface CreateStoryData {
  title: string;
  description?: string;
  priority?: Priority;
  epicId?: string;
}

export interface UpdateStoryData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  epicId?: string;
}

export interface CreateEpicData {
  title: string;
  description?: string;
  priority?: Priority;
}

export interface UpdateEpicData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
}