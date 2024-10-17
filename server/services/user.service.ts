// get user by id

import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../connection/redis";

export const getUserbyId = async (id: string, res: Response) => {
  //   const user = await userModel.findById(id);
  const userJson = await redis.get(id);
  const user = JSON.parse(userJson as string);
  res.status(210).json({
    success: true,
    user,
  });
};

// get all users
export const getAllUserService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    users,
  });
};

// update user role service

export const updateUserRoleService = async (
  res: Response,
  id: string,
  role: string
) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
 return user;
};

export const verifyUserService = async (id: string, isVerified: string) => {
  const user = await userModel.findByIdAndUpdate(
    id,
    { isVerified },
    { new: true }
  );
  return user;
};
