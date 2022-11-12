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
  if (req.method == "POST") {
    return createInstitution(req, res);
  } else if (req.method === "GET") {
    return getAllInstitutions(req, res);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const createInstitution = async (req: NextApiRequest, res: NextApiResponse) => {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({ message: "Not authorized" });
  }
  //Verify body
  const body = req.body;
  const { error: schemaError } = newInstitutionSchema.validate(body);
  if (schemaError) return res.status(400).send(schemaError.details);
  let hashedPassword;
  switch (body.authForm) {
    case "password":
      if (!body.password) {
        return res
          .status(400)
          .send({ message: "There must be a password for this auth form." });
      }
      hashedPassword = await bcrypt.hash(body.password, 10);
      break;
    case "email":
      if (!body.emailFormat) {
        return res.status(400).send({
          message: "There must be a email format for this auth form.",
        });
      }
      break;
    default:
      return res.status(400).send({ message: "There must be a authForm" });
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

    return res.status(200).send(null);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const getAllInstitutions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const token = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({
      message: "Unauthorized.",
    });
  }
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        stations: {
          select: {
            boxes: true,
            id: true,
            localId: true,
            institution: true,
          },
        },
      },
    });
    return res.status(200).send(institutions);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const newInstitutionSchema = Joi.object({
  name: Joi.string().required().min(3).max(255),
  authForm: Joi.string().allow("password", "email").required(),
  password: Joi.string(),
  emailFormat: Joi.string(),
}).required();
