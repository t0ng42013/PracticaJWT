import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/passwordServices";
import prisma from "../models/user";
import { generateToken } from "../services/authServices";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
       if (!email) {
         res.status(400).json({ message: "Email es obligator" });
         return;
       }
       if (!password) {
         res.status(400).json({ message: "El password es obligatorio" });
         return;
       }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);
    res.status(201).json({ token });
    
  } catch (error: any) {
    if (!email) {
      res.status(400).json({ message: "email es obligatorio" });
    }

    if (!password) {
      res.status(400).json({ message: "password es obligatorio" });
      password;
    }

    if (error.code === "P2002" && error?.meta?.target?.includes("email")) {
     res.status(400).json({ message: "El email ingresado ya existe" });
     return; 
    }
    console.error(error);
    res.status(500).json({ error: "Error creating" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {

    if(!email) {
      res.status(400).json({ message: 'Email es obligator'});
      return
    }
    if(!password){
      res.status(400).json({message:'El password es obligatorio'})
      return
    }

    const user = await prisma.findUnique({ where: { email } });
    if(!user) {
      res.status(404).json({ message: "Usuario no encontrado"})
      return
    }

    const passwordMatch = await comparePassword(password, user.password);
    if(!passwordMatch) {
      res.status(401).json({messeage: "Usuario y contraseña no coincide"});
      return
    }
    
    const token = generateToken(user);
    res.status(200).json({ token })    


  } catch (error:any) {
    console.log('Error: ',error)
  }
};
