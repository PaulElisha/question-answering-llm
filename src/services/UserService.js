/** @format */

import { UserModel } from "../models/UserModel";

class UserService {
  getCurrentUser = async (userId) => {
    const user = await UserModel.findById(userId);

    if (!user) throw new Error("User not found");

    return { user };
  };

  getUsers = async () => {
    const users = await UserModel.find();

    return users;
  };

  deleteUser = async (userId) => {
    await UserModel.findByIdAndDelete(userId);
    return;
  };
}

export { UserService };
