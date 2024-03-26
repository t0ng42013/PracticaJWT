import jwt from "jsonwebtoken";
import { User } from "../models/userinterface";

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;

export const generateToken = (user: User): string => {
 
  if (!JWT_SECRET_KEY) {
    throw new Error("JWT secret key is not defined.");
  }
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};


