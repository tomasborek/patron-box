import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import bcrypt from "bcrypt";
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
    return res.status(401).send({ message: "Unathorized" });
  }
  const { error: schemaError } = newInstitutionSchema.validate(req.body);
  if (schemaError) return res.status(400).send(schemaError.details);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await prisma.institution.create({
      data: { name: req.body.name, password: hashedPassword },
    });

    return res.status(200).send(null);
  } catch (error) {
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
  password: Joi.string(),
}).required();
