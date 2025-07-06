import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Access token required" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
