import { getDbInstance } from "../init";
import { TodoSchema } from "../types";

export const createTodo = (input: Partial<TodoSchema>) => {
  const db = getDbInstance();
  const statement = db.prepare('INSERT INTO todos (user_id, text, image) VALUES (?, ?, ?)');
  const result = statement.run(input.user_id, input.text, input.image);
  return result;
}

export const getTodoById = (id: number): TodoSchema => {
  const db = getDbInstance();
  const statement = db.prepare('SELECT * FROM todos WHERE id = ?');
  const result = statement.get(id) as TodoSchema;
  return result;
}

export const getAllTodos = (user_id: number): TodoSchema[] => {
  const db = getDbInstance();
  const statement = db.prepare('SELECT * FROM todos WHERE user_id = ?');
  const result = statement.all(user_id) as TodoSchema[];
  return result;
}

export const updateTodo = (id: number, input: Partial<TodoSchema>) => {
  input = input.completed ? { ...input, completed_at: new Date().toISOString() } : input;
  const db = getDbInstance();
  const keys = Object.keys(input) as (keyof TodoSchema)[];

  if (!keys.length) {
    throw new Error('No fields provided for update');
  }
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => (typeof input[key] === 'boolean' ? Number(input[key]) : input[key]));
  const statement = db.prepare(`UPDATE todos SET ${setClause} WHERE id = ?`);
  const result = statement.run(...values, id);
  return result;
}

export const deleteTodo = (id: number) => {
  const db = getDbInstance();
  const statement = db.prepare('DELETE FROM todos WHERE id = ?');
  const result = statement.run(id);
  return result;
}

export const deleteAllTodos = () => {
  const db = getDbInstance();
  const statement = db.prepare('DELETE FROM todos');
  const result = statement.run();
  return result;
}
