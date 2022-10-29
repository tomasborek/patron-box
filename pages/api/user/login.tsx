import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../db/prisma";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({
      message: "Method not allowed.",
    });
  }
  const body = req.body;
  const { error } = loginSchema.validate(body);
  if (error) return res.status(400).send(error);
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
      include: {
        institution: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Wrong password." });
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        institution: user.institution.name,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).send({
      token,
      user,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).required();
