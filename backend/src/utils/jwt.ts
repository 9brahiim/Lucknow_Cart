import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export const signToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, env.jwtSecret as Secret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
