import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../../db/prisma";
import bcrypt from "bcrypt";
import { authorizeAdmin } from "../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({
      messsage: "Unauthorized",
    });
  }
  if (req.method === "PATCH") {
    return editInstitution(req, res);
  } else if (req.method === "DELETE") {
    return deleteInstitution(req, res);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const editInstitution = async (req: NextApiRequest, res: NextApiResponse) => {
  const name = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;
  const body = req.body;
  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
  }
  try {
    const editedInstitution = await prisma.institution.update({
      where: {
        name,
      },
      data: req.body,
    });

    return res.status(200).send(editedInstitution);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteInstitution = async (req: NextApiRequest, res: NextApiResponse) => {
  const name = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;

  try {
    const users = await prisma.user.deleteMany({
      where: {
        institution: {
          name,
        },
      },
    });
    const deletedInstitution = await prisma.institution.delete({
      where: {
        name,
      },
    });

    return res.status(200).send(deletedInstitution);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const institutionDataSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  password: Joi.string().min(3).max(255),
  emailFormat: Joi.string().min(3).max(255),
}).required();
