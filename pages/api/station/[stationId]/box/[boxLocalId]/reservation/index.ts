import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcrypt";
import { prisma } from "../../../../../../../db/prisma";
import {
  authentificate,
  authorize,
  authorizeAdmin,
} from "../../../../../../../utils/auth";
import { getParam } from "../../../../../../../utils/helpers";
//interfaces
interface Params {
  stationId: number;
  boxLocalId: number;
}
interface RecordParams extends Params {
  length: number;
  userId: number;
  reservationId: number;
  startTime: Date;
}

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stationId: number = Number(getParam(req, "stationId"));
  const boxLocalId: number = Number(getParam(req, "boxLocalId"));
  const params = { boxLocalId, stationId };
  if (req.method === "POST") return createReservation(req, res, params);
  else if (req.method === "DELETE") return deleteReservation(req, res, params);
  else if (req.method === "GET") return getReservation(req, res, params);
  else {
    return res.status(405).send({ message: "Method not allowed" });
  }
}

const createReservation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: Params
) => {
  const token: string = req.headers.authorization;
  if (!authentificate(token)) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const { error: schemaError } = newReservationSchema.validate(req.body);
  let { id: userId } = jwt.decode(token.split(" ")[1]);
  userId = Number(userId);

  if (schemaError) return res.status(400).send(schemaError.details);
  try {
    const box = await getBox(params);
    if (!box) return res.status(404).send({ message: "Not found" });
    if (box.reservation)
      return res.status(400).send({ message: "Reservation already exists." });

    const code = Math.floor(100000 + Math.random() * 900000); // generate 6 digit code
    const hashedCode = await bcrypt.hash(code.toString(), 10);

    const reservation = await prisma.reservation.create({
      data: {
        box: { connect: { id: box.id } },
        user: { connect: { id: userId } },
        length: req.body.length, //in hours
        endTime: new Date(
          new Date().setHours(new Date().getHours() + req.body.length)
        ),
        code: hashedCode,
      },
    });

    await createRecord({
      ...params,
      startTime: reservation.startTime,
      reservationId: reservation.id,
      userId,
      length: req.body.length,
    });
    return res.status(200).send(reservation);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
const deleteReservation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: Params
) => {
  const token: string = req.headers.authorization;
  try {
    const box = await getBox(params);
    if (!box) return res.status(404).send({ message: "Box not found" });

    if (!authorizeAdmin(token) && !authorize(token, box.reservation.userId)) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    await prisma.reservation.delete({
      where: { id: box.reservation.id },
    });

    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getReservation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: Params
) => {
  const token = req.headers.authorization;
  try {
    const box = await getBox(params);

    if (!box || !box.reservation) {
      return res.status(404).send({
        message: "Not found",
      });
    }

    if (!authorize(token, box.reservation.userId)) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    return res.status(200).send(box.reservation);
  } catch (error) {
    return res.status(500).send(error);
  }
};

//helper functions

const getBox = async (params: Params) => {
  return await prisma.box.findFirst({
    where: { station: { id: params.stationId }, localId: params.boxLocalId },
    include: { reservation: true },
  });
};

const createRecord = async (params: RecordParams) => {
  return await prisma.record.create({
    data: {
      length: params.length,
      reservationId: params.reservationId,
      stationId: params.stationId,
      userId: params.userId,
      startTime: params.startTime,
    },
  });
};

const newReservationSchema = Joi.object({
  length: Joi.number().required(),
}).required();
