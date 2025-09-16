import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.sub).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
