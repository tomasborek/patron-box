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
    if (institution.authForm === "email") {
      const format = new RegExp(institution.emailFormat);
      if (!format.test(body.email)) {
        return res.status(401).send({
          message: "The email doesn't match institution's email format.",
        });
      }
    } else if (institution.authForm === "password") {
      const valid = await bcrypt.compare(
        body.institutionPassword,
        institution.password
      );
      if (!valid) {
        return res.status(401).send({
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
      include: {
        institution: {
          select: {
            name: true,
          },
        },
      },
    });
    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        institution: newUser.institution.name,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).send({
      token,
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error,
      code: "UNKNOWN_ERR",
    });
  }
}

const nameRegex = new RegExp("^.{1,}[ ].{1,}$");

const newUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(255).regex(nameRegex),
  email: Joi.string().required().email().min(5).max(30),
  password: Joi.string().required().min(5).max(255),
  institutionName: Joi.string().required(),
  institutionPassword: Joi.string(),
}).required();
