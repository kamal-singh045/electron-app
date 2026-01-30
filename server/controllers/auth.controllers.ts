import { generateToken } from "../utils/jwt";
import { createUser, getUserByEmail } from "../db/queries";
import { ILoginPayload, IRegisterPayload } from "../types";
import { RequestHandler } from "express";

export const register: RequestHandler = async (req, res) => {
  try {
    const inputData: IRegisterPayload = req.body;

    const isUserExist = getUserByEmail(inputData.email);
    console.log({ isUserExist });
    if (isUserExist) {
      throw new Error('User already exist');
    }
    createUser(inputData);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user');
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const inputData: ILoginPayload = req.body;
    const isUserExist = getUserByEmail(inputData.email);
    console.log({ isUserExist });
    if (!isUserExist) {
      throw new Error('User does not exist, Please register first');
    } else if (isUserExist.password !== inputData.password) {
      throw new Error('Password does not match');
    }
    // will generate access token and send back later
    const accessToken = generateToken(isUserExist.id, isUserExist.email);
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: { accessToken }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user');
  }
};
