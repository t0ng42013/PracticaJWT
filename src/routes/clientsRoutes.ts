import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { deleteClient, getAll, getClient, postClient, updateClient } from "../controllers/clientController";

const router = express.Router();
const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;

//MIDDLEWARE: para saber si tenemos JWT
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }
  if (!JWT_SECRET_KEY) {
    throw new Error("JWT secret key is not defined.");
  }
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Error en la autenticación: ", err);
      return res.status(403).json({ error: "No autorizado" });
    }
    next();
  });
};

router.get("/", getAll);
router.post("/", authenticateToken,postClient);
router.get("/:id", getClient);
router.put("/:id", updateClient);
router.delete("/:id",authenticateToken ,deleteClient);

export default router;
