import { createUser, getUserByEmail } from "../db/queries";
import { IRegisterPayload } from "../types";
import { RequestHandler } from "express";

export const register: RequestHandler = async (req, res) => {
  try {
    const inputData: IRegisterPayload = req.body;

    const isUserExist = getUserByEmail(inputData.email);
    if (isUserExist) {
      throw new Error('User already exist');
    }
    const user = createUser(inputData);
    console.log({ user });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user');
  }
};

export const login = () => {

};
