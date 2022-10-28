import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import {
  authentificate,
  authorize,
  authorizeAdmin,
} from "../../../../../../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return createReservation(req, res);
  } else if (req.method === "DELETE") {
    return deleteReservation(req, res);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const createReservation = async (req: NextApiRequest, res: NextApiResponse) => {
  const token: string = req.headers.authorization;
  if (!authentificate(token)) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
  const boxId = Array.isArray(req.body.boxId)
    ? Number.parseInt(req.body.boxId[0])
    : Number.parseInt(req.body.boxId);
  const body = req.body;
  const { error } = newReservationSchema.validate(body);
  if (error) {
    return res.status(400).send(error);
  }
  try {
    const newReservation = await prisma.reservation.create({
      data: {
        boxId,
        userId: body.userId,
        length: body.length,
        endTime: new Date(),
      },
    });
    return res.status(200).send(newReservation);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteReservation = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization;

  const boxId = Array.isArray(req.body.boxId)
    ? Number.parseInt(req.body.boxId[0])
    : Number.parseInt(req.body.boxId);

  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        boxId,
      },
    });
    if (!authorizeAdmin(token) && !authorize(token, reservation.userId)) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    const deletedReservation = await prisma.reservation.delete({
      where: {
        boxId,
      },
    });
    return res.status(200).send(deleteReservation);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const newReservationSchema = Joi.object({
  userId: Joi.number().required(),
  length: Joi.number().required(),
}).required();
