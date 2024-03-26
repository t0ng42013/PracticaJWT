import { Request, Response } from "express";
import prisma from "../models/client";

export const getAll = async (req: Request, res: Response) => {
  try {
    const client = await prisma.findMany();
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
  }
};

export const postClient = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description)
      return res
        .status(400)
        .json({ message: "El nombre y la description son obligatorias" });

    const client = await prisma.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.log(error);

    return;
  }
};

export const getClient = async (req: Request, res: Response) => {

  const { id } = req.params;

  try {

    if (!id) return res.status(400).json({ message: "Id Obligatorio" });
    const client = await prisma.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!client)
      return res.status(400).json({ message: "cliente no encontrado" });
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const updateClient = async (req: Request, res: Response) =>{
   const {id} = req.params;
    const {name, description} = req.body
    try {
        
        let updateClient = {...req.body}
        if(name) updateClient.name = name;
        if(description) updateClient.description = description;

        const client = await prisma.update(
            {
            where: {
                id: parseInt(id)
            },
            data: updateClient
        });
        
        return res.status(200).json(client);
    } catch (error:any) {
      return res.status(400).json({ message: 'error updating client'});
    }
};

export const deleteClient = async (req: Request, res: Response) =>{
    const {id} = req.params
  
    try {
          await prisma.delete({
        where:{
            id: parseInt(id)
        }
    })
    res.status(200).json({message:'El ususario a sido eliminado'}).end()
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'error deleting client'});
    }
};