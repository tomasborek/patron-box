import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../db/prisma";
import { authorize } from "../../../../../utils/auth";
import { getParam } from "../../../../../utils/helpers";
import bcrypt from "bcrypt";

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") return createConnection(req, res);
  else if (req.method === "DELETE") return deleteConnection(req, res);
  else return res.status(405).send({ message: "Method not allowed" });
}

const createConnection = async (req: NextApiRequest, res: NextApiResponse) => {
  const token: string = req.headers.authorization;
  const id: number = Number(getParam(req, "userId"));
  if (!authorize(token, id))
    return res.status(401).send({ message: "Unauthorized" });
  try {
    const institution = await prisma.institution.findUnique({
      where: { name: req.body.institution },
    });
    const validPassword = await bcrypt.compare(
      req.body.password,
      institution.password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Wrong institution password" });
    await prisma.user.update({
      where: { id },
      data: { institution: { connect: { id: institution.id } } },
    });
    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deleteConnection = async (req: NextApiRequest, res: NextApiResponse) => {
  const token: string = req.headers.authorization;
  const id: number = Number(getParam(req, "userId"));
  if (!authorize(token, id))
    return res.status(401).send({ message: "Unauthorized" });
  try {
    await prisma.user.update({
      where: { id: id },
      data: { institution: { disconnect: true } },
    });
    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};
