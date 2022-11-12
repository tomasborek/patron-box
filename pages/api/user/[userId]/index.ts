import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../db/prisma";
import { authorize, authorizeAdmin } from "../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return getUser(req, res);
  } else if (req.method === "DELETE") {
    return deleteUser(req, res);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const id: number = Array.isArray(req.query.userId)
    ? parseInt(req.query.userId[0])
    : parseInt(req.query.userId);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        institutionId: true,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  const id: number = Array.isArray(req.query.userId)
    ? Number.parseInt(req.query.userId[0])
    : Number.parseInt(req.query.userId);
  if (!authorize(token, id) && !authorizeAdmin(token)) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).send(null);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
