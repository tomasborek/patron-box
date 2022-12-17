import { NextApiRequest, NextApiResponse } from "next";
import { authorize, authorizeAdmin } from "../../../utils/auth";
import { prisma } from "../../../db/prisma";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") return getReservation(req, res);
  else {
    return res.status(405).send({ message: "Method not allowed" });
  }
}

const getReservation = async (req: NextApiRequest, res: NextApiResponse) => {
  const id: number = Array.isArray(req.query.id)
    ? parseInt(req.query.id[0])
    : parseInt(req.query.id);
  const token: string = req.headers.authorization;
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        box: {
          include: {
            station: true,
          },
        },
      },
    });
    if (!authorize(token, reservation.userId) && !authorizeAdmin(token)) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    return res.status(200).send(reservation);
  } catch (error) {
    return res.status(500).send(error);
  }
};
