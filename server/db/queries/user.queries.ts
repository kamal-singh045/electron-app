import { dbInstance } from "../init";
import { UserSchema } from "../types";

// Create new user: name, email, phone and password are required
export const createUser = (input: Partial<UserSchema>) => {
  const statement = dbInstance.prepare('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)');
  const result = statement.run(input.name, input.email, input.password, input.phone);
  return result;
}

export const getUserByEmail = (email: string) => {
  const statement = dbInstance.prepare('SELECT * FROM users WHERE email = ?');
  const result = statement.get(email);
  return result;
}

export const getUserById = (id: number) => {
  const statement = dbInstance.prepare('SELECT * FROM users WHERE id = ?');
  const result = statement.get(id);
  return result;
}

export const getAllUsers = () => {
  const statement = dbInstance.prepare('SELECT * FROM users');
  const result = statement.all();
  return result;
}

export const updateUser = (id: number, input: Partial<UserSchema>) => {
  const keys = Object.keys(input) as (keyof UserSchema)[];

  if (!keys.length) {
    throw new Error('No fields provided for update');
  }
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => input[key]);
  const statement = dbInstance.prepare(`UPDATE users SET ${setClause} WHERE id = ?`);
  const result = statement.run(...values, id);
  return result;
}
