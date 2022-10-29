import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../db/prisma";
import { authorizeAdmin } from "../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({
      message: "Not authorized",
    });
  }
  //Verify body
  const body = req.body;
  const { error } = newInstitutionSchema.validate(body);
  if (error) {
    return res.status(400).send(error);
  }
  let hashedPassword;
  if (body.password) {
    hashedPassword = await bcrypt.hash(body.password, 10);
  }
  try {
    const newInstituion = await prisma.institution.create({
      data: {
        name: body.name,
        password: hashedPassword ? hashedPassword : null,
        emailFormat: body.emailFormat ? body.emailFormat : null,
        authForm: body.authForm,
      },
    });

    return res.status(200).send(newInstituion);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

const newInstitutionSchema = Joi.object({
  name: Joi.string().required().min(3).max(255),
  password: Joi.string(),
  emailFormat: Joi.string(),
  authForm: Joi.string().allow("password", "email").required(),
}).required();
