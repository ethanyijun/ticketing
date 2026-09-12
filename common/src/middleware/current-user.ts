import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type UserPayload = {
  id: string;
  email: string;
  role: string;
};
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = null;

  // Check if the token is present in the request headers (e.g., from client-side requests)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // If token is not found in the headers, check if it's present in the session (e.g., from server-side requests)
  if (!token && req.session?.jwt) {
    token = req.session.jwt;
  }

  if (!token) {
    // No token found, proceed to the next middleware
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = decoded;
  } catch (err) {}
  next();
};
