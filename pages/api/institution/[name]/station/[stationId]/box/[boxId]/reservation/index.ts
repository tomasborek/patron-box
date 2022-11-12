import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import {
  authentificate,
  authorize,
  authorizeAdmin,
} from "../../../../../../../../../utils/auth";

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
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const createReservation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: {
    institutionName: string;
    stationLocalId: number;
    boxLocalId: number;
  }
) => {
  const token: string = req.headers.authorization;
  const body = req.body;
  if (!authentificate(token))
    return res.status(401).send({ message: "Unauthorized" });
  const { error: schemaError } = newReservationSchema.validate(body);
  const { id: userId } = jwt.decode(token.split(" ")[1]);

  if (schemaError) return res.status(400).send(schemaError.details);
  try {
    const box = await prisma.box.findFirst({
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
    });
    await prisma.reservation.create({
      data: {
        box: { connect: { id: box.id } },
        user: { connect: { id: parseInt(userId) } },
        length: body.length,
        endTime: new Date(),
      },
    });
    return res.status(200).send(null);
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
  const token = req.headers.authorization;
  try {
    const box = await prisma.box.findFirst({
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
    });
    const reservation = await prisma.reservation.findUnique({
      where: {
        boxId: box.id,
      },
    });
    if (!authorizeAdmin(token) && !authorize(token, reservation.userId)) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    await prisma.reservation.delete({
      where: {
        id: reservation.id,
      },
    });
    return res.status(200).send(null);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const newReservationSchema = Joi.object({
  length: Joi.number().required(),
}).required();
