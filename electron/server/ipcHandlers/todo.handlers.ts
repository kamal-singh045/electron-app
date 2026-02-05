/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
import { serverConfig } from '../config/config';
import { ICreateTodoHandlerPayload, IUpdateTodoPayload } from "../types";
import { createTodo, deleteTodo, getAllTodos, updateTodo } from '../db/queries';
import { getCurrentUser } from '../../main';

export const createTodoHandler = async (_event: Electron.IpcMainInvokeEvent, payload: ICreateTodoHandlerPayload) => {
  const user_id = getCurrentUser();
  if (!user_id) {
    return {
      success: false,
      message: 'User not logged in'
    }
  }
  let relativePath: string | undefined = undefined;
  if (payload.image) {
    const imagesDir = path.join(app.getPath('userData'), serverConfig.todoImagesBaseDir);
    fs.mkdirSync(imagesDir, { recursive: true });
    const filename = `${Date.now()}-${payload.image.name}`;
    const absolutePath = path.join(imagesDir, filename);
    fs.writeFileSync(absolutePath, Buffer.from(payload.image.buffer));
    relativePath = `${serverConfig.todoImagesBaseDir}/${filename}`;
  }
  createTodo({ user_id, text: payload.text, image: relativePath });
  return {
    success: true,
    message: 'Todo created',
  }
}

export const getAllTodosHandler = (_event: Electron.IpcMainInvokeEvent) => {
  const user_id = getCurrentUser();
  if (!user_id) {
    return {
      success: false,
      message: 'User not logged in'
    }
  }
  const allTodos = getAllTodos(user_id);
  const modifiedTodos = allTodos.map(todo => todo.image ? { ...todo, image: `app://${todo.image}` } : todo);
  return {
    success: true,
    message: 'Todos fetched',
    data: modifiedTodos
  }
}

export const updateTodoHandler = (_event: Electron.IpcMainInvokeEvent, payload: IUpdateTodoPayload) => {
  const user_id = getCurrentUser();
  if (!user_id) {
    return {
      success: false,
      message: 'User not logged in'
    }
  }
  const { id, ...rest } = payload;
  updateTodo(payload.id, rest);
  return {
    success: true,
    message: 'Todo updated',
  }
}

export const deleteTodoHandler = (_event: Electron.IpcMainInvokeEvent, id: number) => {
  const user_id = getCurrentUser();
  if (!user_id) {
    return {
      success: false,
      message: 'User not logged in'
    }
  }
  deleteTodo(id);
  return {
    success: true,
    message: 'Todo deleted',
  }
}
