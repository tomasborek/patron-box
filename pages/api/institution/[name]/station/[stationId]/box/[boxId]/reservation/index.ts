import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcrypt";
import { prisma } from "../../../../../../../../../db/prisma";
import {
  authentificate,
  authorize,
  authorizeAdmin,
} from "../../../../../../../../../utils/auth";
//interfaces
interface Params {
  institutionName: string;
  stationLocalId: number;
  boxLocalId: number;
}

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const institutionName: string = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;
  const stationLocalId: number = Array.isArray(req.query.stationId)
    ? parseInt(req.query.name[0])
    : parseInt(req.query.stationId);
  const boxLocalId: number = Array.isArray(req.query.boxId)
    ? parseInt(req.query.name[0])
    : parseInt(req.query.boxId);
  const params = {
    institutionName,
    boxLocalId,
    stationLocalId,
  };
  if (req.method === "POST") {
    return createReservation(req, res, params);
  } else if (req.method === "DELETE") {
    return deleteReservation(req, res, params);
  } else if (req.method === "GET") {
    return getReservation(req, res, params);
  } else {
    return res.status(405).send({ message: "Method not allowed" });
  }
}

const createReservation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: Params
) => {
  const token: string = req.headers.authorization;
  const body = req.body;
  if (!authentificate(token))
    return res.status(401).send({ message: "Unauthorized" });
  const { error: schemaError } = newReservationSchema.validate(body);
  const { id: userId } = jwt.decode(token.split(" ")[1]);

  if (schemaError) return res.status(400).send(schemaError.details);
  try {
    const box = await getBox(params);
    if (!box) return res.status(404).send({ message: "Box not found" });
    if (box.reservation)
      return res.status(400).send({ message: "Reservation already exists." });

    const code = Math.floor(100000 + Math.random() * 900000); // generate 6 digit code
    const hashedCode = await bcrypt.hash(code.toString(), 10);

    const reservation = await prisma.reservation.create({
      data: {
        box: { connect: { id: box.id } },
        user: { connect: { id: parseInt(userId) } },
        length: body.length, //in hours
        endTime: new Date(
          new Date().setHours(new Date().getHours() + body.length)
        ),
        code: hashedCode,
      },
      select: { id: true },
    });

    return res.status(200).send(reservation);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteReservation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: {
    institutionName: string;
    stationLocalId: number;
    boxLocalId: number;
  }
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
      where: {
        id: box.reservation.id,
      },
    });

    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getReservation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: {
    institutionName: string;
    stationLocalId: number;
    boxLocalId: number;
  }
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

const getBox = async (params: Params) => {
  return await prisma.box.findFirst({
    where: {
      AND: [
        {
          station: {
            AND: [
              { localId: params.stationLocalId },
              { institution: { name: params.institutionName } },
            ],
          },
        },
        { localId: params.boxLocalId },
      ],
    },
    include: { reservation: true },
  });
};

const newReservationSchema = Joi.object({
  length: Joi.number().required(),
}).required();
