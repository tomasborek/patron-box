import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../../db/prisma";
import bcrypt from "bcrypt";
import { authorizeAdmin } from "../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name: string = Array.isArray(req.query.institutionName)
    ? req.query.institutionName[0]
    : req.query.institutionName;
  if (req.method === "GET") return getInstitution(req, res, name);
  else if (req.method === "PATCH") return editInstitution(req, res, name);
  else if (req.method === "DELETE") return deleteInstitution(req, res, name);
  else return res.status(405).send({ message: "Method not allowed" });
}

const getInstitution = async (
  req: NextApiRequest,
  res: NextApiResponse,
  name: string
) => {
  try {
    const institution = await prisma.institution.findUnique({
      where: { name },
    });
    if (!institution) return res.status(404).send({ message: "Not found." });
    return res.status(200).send(institution);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const editInstitution = async (
  req: NextApiRequest,
  res: NextApiResponse,
  name: string
) => {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token))
    return res.status(401).send({ messsage: "Unauthorized" });
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
  }
  try {
    const institution = await prisma.institution.findUnique({
      where: { name },
    });
    if (!institution) {
      return res.status(404).send({ message: "Not found" });
    }
    const editedInstitution = await prisma.institution.update({
      where: { name },
      data: {
        name: req.body.name ? req.body.name : institution.name,
        password: req.body.password ? req.body.password : institution.password,
      },
      select: {
        name: true,
      },
    });

    return res.status(200).send(editedInstitution);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteInstitution = async (
  req: NextApiRequest,
  res: NextApiResponse,
  name: string
) => {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token))
    return res.status(401).send({ messsage: "Unauthorized" });

  try {
    await prisma.institution.update({
      where: { name },
      data: {
        users: { set: [] },
      },
    });
    await prisma.station.deleteMany({
      where: {
        institution: {
          name,
        },
      },
    });
    await prisma.institution.delete({
      where: { name },
    });

    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};
