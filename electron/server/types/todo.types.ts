export interface ICreateTodoPayload {
  text: string;
  completed?: boolean;
  image?: File;
}

export interface ICreateTodoHandlerPayload {
  text: string;
  completed?: boolean;
  image?: {
    name: string;
    type: string;
    buffer: Buffer;
  }
}

export interface IUpdateTodoPayload {
  id: number;
  text: string;
  completed: boolean;
}

export interface ITodoResponse {
  id: number;
  user_id: number;
  text: string;
  completed: boolean;
  image?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
