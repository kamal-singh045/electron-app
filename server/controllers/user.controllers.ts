import { CustomRequest } from "../types";
import { getUserById } from "../db/queries";
import { Response } from "express";

export const getMe = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new Error('User id is required');
    }
    const user = getUserById(Number(userId));

    if (!user) {
      throw new Error('User does not exist');
    }
    res.status(200).json({
      success: true,
      message: 'User profile fetched',
      data: user
    });

  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user');
  }
};
