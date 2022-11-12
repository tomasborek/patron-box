import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
  const body = req.body;
  const { error: schemaError } = authSchema.validate(body);
  if (schemaError) return res.status(400).send(schemaError.details);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
      include: {
        institution: true,
      },
    });
    if (!user) return res.status(404).send({ message: "User not found" });
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Unauthorized" });

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        institution: user.institution.name,
        admin: user.admin,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({ token });
  } catch (error) {
    return res.status(500).send(error);
  }
}

const authSchema = Joi.object({
  email: Joi.string().email().min(3).max(255).required(),
  password: Joi.string().required(),
}).required();
