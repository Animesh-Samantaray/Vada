import UserModel from "../models/user.model.js";

export const createUser = async ({ firstname, lastname, email, password }) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.status = 409;
    throw error;
  }

  const user = await UserModel.create({
    fullname: { firstname, lastname },
    email,
    password,
  });

  return user;
};
