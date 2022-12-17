import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authorizeAdmin } from "../../../utils/auth";
dotenv.config();

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return createNewUser(req, res);
  } else if (req.method === "GET") {
    return findUser(req, res);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const createNewUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const { error: schemaError } = newUserSchema.validate(body);
  if (schemaError) return res.status(400).send(schemaError.details);

  //Hash password
  const hashedPassword = await bcrypt.hash(body.password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingUser)
      return res
        .status(400)
        .send({ message: "User with this email already exists." });

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        admin: body.email === process.env.ADMIN_EMAIL,
      },
    });
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        admin: newUser.admin,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({ token });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const findUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({
      message: "Unauthoried.",
    });
  }
  const email: string = Array.isArray(req.query.email)
    ? req.query.email[0]
    : req.query.email;

  const name = Array.isArray(req.query.name)
    ? req.query.name[0].split("_").join(" ")
    : req.query.name?.split("_").join(" ");

  let query: { email?: string; name?: string } = {
    ...(email && { email }),
    ...(name && { name }),
  };

  try {
    const user = await prisma.user.findMany({
      where: query,
      select: {
        id: true,
        email: true,
        name: true,
        institution: {
          select: {
            name: true,
          },
        },
        reservations: {
          select: {
            box: true,
          },
        },
        verified: true,
      },
    });

    if (!user.length) {
      return res.status(404).send({
        message: "User not found.",
      });
    }
    return res.status(200).send(user[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const nameRegex = new RegExp("^.{1,}[ ].{1,}$");

const newUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(255).regex(nameRegex),
  email: Joi.string().required().email().min(3).max(255),
  password: Joi.string().required().min(5).max(30),
}).required();
