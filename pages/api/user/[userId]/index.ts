import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../db/prisma";
import { authorize, authorizeAdmin } from "../../../../utils/auth";
import { getParam } from "../../../../utils/helpers";
import bcrypt from "bcrypt";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return getUser(req, res);
  } else if (req.method === "PATCH") {
    return updateUser(req, res);
  } else if (req.method === "DELETE") {
    return deleteUser(req, res);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const id: number = Number(getParam(req, "userId"));
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
        institution: true,
        reservations: {
          include: {
            box: { include: { station: true } },
          },
        },
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
const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const token: string = req.headers.authorization;
  const id: number = Number(getParam(req, "userId"));
  if (!authorize(token, id))
    return res.status(401).send({ message: "Unauthorized" });
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name: req.body.name },
    });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;
  const id: number = Number(getParam(req, "userId"));
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
