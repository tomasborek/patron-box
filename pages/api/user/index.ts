import { NextApiRequest, NextApiResponse } from "next";
import Joi, { valid } from "joi";
import { prisma } from "../../../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
  const body = req.body;
  const { error } = newUserSchema.validate(body);
  if (error) {
    return res.status(400).send(error);
  }
  //Hash password
  const hashedPassword = await bcrypt.hash(body.password, 10);
  try {
    const institution = await prisma.institution.findUnique({
      where: {
        name: body.institutionName,
      },
    });
    if (institution.emailFormat) {
      const format = new RegExp(institution.emailFormat);
      const email = body.email;
      const valid = format.test(email);
      if (!valid) {
        return res.status(400).send({
          message: "The email doesn't match institution's email format.",
        });
      }
    } else if (institution.password) {
      const validPassword = await bcrypt.compare(
        body.institutionPassword,
        institution.password
      );
      console.log(validPassword);
      if (!validPassword) {
        return res.status(400).send({
          message: "The institution password isn't right.",
        });
      }
    }

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        institution: {
          connect: {
            id: institution.id,
          },
        },
      },
    });
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

const nameRegex = new RegExp("^.{1,}[ ].{1,}$");

const newUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(255).regex(nameRegex),
  email: Joi.string().required().email().min(5).max(255),
  password: Joi.string().required(),
  institutionName: Joi.string().required(),
  institutionPassword: Joi.string(),
}).required();
