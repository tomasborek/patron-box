import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../db/prisma";
import bcrypt from "bcrypt";
//interface
interface Params {
  userId: number;
  institutionName: string;
}

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  const userId: number = Array.isArray(req.query.userId)
    ? parseInt(req.query.userId[0])
    : parseInt(req.query.userId);
  const institutionName: string = Array.isArray(req.query.institutionName)
    ? req.query.userId[0]
    : req.query.institutionName;
  const params = { userId, institutionName };
  if (req.method === "DELETE") return createConnection(req, res, params);
  else return res.status(405).send({ message: "Method not allowed" });
}

const createConnection = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: Params
) => {
  try {
    const institution = await prisma.institution.findUnique({
      where: { name: params.institutionName },
    });
    const validPassword = await bcrypt.compare(
      req.body.password,
      institution.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Unauthorized" });
    await prisma.user.update({
      where: { id: params.userId },
      data: { institution: { connect: { id: institution.id } } },
    });
    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};
