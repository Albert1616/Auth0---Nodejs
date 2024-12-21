import { Request, Response } from 'express'
import { PrismaClient } from "@prisma/client";
import { User } from '../models/user';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
}

export const createUser = async (req: Request, res: Response) => {
    const { email, name, password }: User = req.body;
    try {
        if (!email || !name || !password) res.status(500).json({ message: "Email or name or password are null" });

        const userExists = await prisma.user.findMany({
            where: {
                email: {
                    equals: email
                }
            }
        });

        if (userExists.length > 0) res.status(500).json({ message: "User already exists" });

        await prisma.user.create({
            data: {
                email,
                name,
                password: await bcrypt.hash(password, 10)
            }
        })
        res.status(201).json({ message: "User created with sucess!" });
    } catch (error) {
        res.status(500).json({ message: `Error to created user: ${error}` })
    }
}