import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  AUTH_MESSAGES,
  AUTH_HEADERS,
  AUTH_PREFIXES,
  AUTH_DEFAULTS,
} from "../constants/middleware";

// Extend the Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export class AuthMiddleware {
  static async authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers[AUTH_HEADERS.AUTHORIZATION];

    // Ensure authHeader is a string before calling startsWith
    const token =
      typeof authHeader === "string" &&
      authHeader.startsWith(AUTH_PREFIXES.BEARER)
        ? authHeader.split(" ")[1]
        : null;

    if (!token)
      return res.status(401).json({ message: AUTH_MESSAGES.UNAUTHORIZED });

    try {
      const verified = jwt.verify(
        token,
        process.env.JWT_SECRET || AUTH_DEFAULTS.JWT_SECRET
      );
      req.user = verified as { id: number };
      next();
    } catch (err) {
      res.status(401).json({ message: AUTH_MESSAGES.UNAUTHORIZED });
    }
  }
}
