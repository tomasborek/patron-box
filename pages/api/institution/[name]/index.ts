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
  const name: string = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;
  const body = req.body;
  if (body.authForm) {
    if (body.authForm !== "email" && body.authForm !== "password") {
      return res.status(400).send({ message: "Auth form invalid" });
    }
    if (body.authForm === "password" && (body.emailFormat || !body.password)) {
      return res
        .status(400)
        .send({ message: "Invalid data for password auth form." });
    }
    if (body.authForm === "email" && (body.password || !body.emailFormat)) {
      return res
        .status(400)
        .send({ message: "Invalid data for email auth form." });
    }
  }
  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
  }
  try {
    const institution = await prisma.institution.findUnique({
      where: {
        name,
      },
    });
    if (!institution) {
      return res.status(404).send({
        message: "Institution not found",
      });
    }
    if (
      (institution.authForm === "email" && body.password) ||
      (institution.authForm === "password" && body.emailFormat)
    ) {
      return res
        .status(400)
        .send({ message: "Cannot change that without changin auth form" });
    }
    const editedInstitution = await prisma.institution.update({
      where: {
        name,
      },
      data: {
        name: body.name ? body.name : institution.name,
        authForm: body.authForm ? body.authForm : institution.authForm,
        password:
          body.authForm === "email"
            ? null
            : body.password
            ? body.password
            : institution.password,
        emailFormat:
          body.authForm === "password"
            ? null
            : body.emailFormat
            ? body.emailFormat
            : institution.emailFormat,
      },
      select: {
        name: body.name ? true : false,
        authForm: body.authForm ? true : false,
        emailFormat: body.emailFormat ? true : false,
      },
    });

    return res.status(200).send(editedInstitution);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteInstitution = async (req: NextApiRequest, res: NextApiResponse) => {
  const name: string = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;

  try {
    await prisma.user.deleteMany({
      where: {
        institution: {
          name,
        },
      },
    });
    await prisma.station.deleteMany({
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

    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const institutionSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  password: Joi.string().min(3).max(255),
  emailFormat: Joi.string().min(3).max(255),
  authForm: Joi.string().allow("password", "email"),
}).required();
