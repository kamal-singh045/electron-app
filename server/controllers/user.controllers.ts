import { CustomRequest } from "../types";
import { getUserById, updateUser } from "../db/queries";
import { Response } from "express";
import { UserSchema } from "@/db/types";
import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

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
    const userProfileUrl = user.profile_image ? `http://localhost:3001/static/${user.profile_image}` : '';

    res.status(200).json({
      success: true,
      message: 'User profile fetched',
      data: {
        ...user,
        profile_image: userProfileUrl
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user');
  }
};

export const uploadProfileImage = async (req: CustomRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }
  const userId = req.userId;
  // now save the relative path of the image
  const relativePath = `images/${req.file.filename}`;
  // first get the old profile_image and delete if exists
  const user = getUserById(Number(userId));
  if (user.profile_image) {
    const oldRelativePath = user.profile_image;
    const oldAbsolutePath = path.join(app.getPath('userData'), oldRelativePath);
    try {
      if (fs.existsSync(oldAbsolutePath)) {
        fs.unlinkSync(oldAbsolutePath);
        console.log('🗑️ Old profile image deleted');
      }
    } catch (error) {
      console.error('Failed to delete old profile image:', error);
    }
  }
  updateUser(Number(userId), { profile_image: relativePath });

  res.status(200).json({
    success: true,
    message: 'Profile image uploaded',
    data: {
      profile_image: `http://localhost:3001/static/${relativePath}`
    }
  });
}

export const updateMe = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    const dataToUpdate: Partial<UserSchema> = req.body;
    if (!userId) {
      throw new Error('User id is required');
    }
    const user = getUserById(Number(userId));

    if (!user) {
      throw new Error('User does not exist');
    }

    updateUser(Number(userId), dataToUpdate);
    res.status(200).json({
      success: true,
      message: 'User profile updated',
    });

  } catch (error) {
    console.error(error);
    throw new Error('Failed to register user');
  }
};
