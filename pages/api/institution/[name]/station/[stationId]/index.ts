import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../../../../db/prisma";
import { authorizeAdmin } from "../../../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stationId = Array.isArray(req.query.stationId)
    ? Number.parseInt(req.query.stationId[0])
    : Number.parseInt(req.query.stationId);
  if (req.method === "PATCH") {
    return editStation(req, res, stationId);
  } else if (req.method === "POST") {
    return checkPassword();
  } else if (req.method === "DELETE") {
    return deleteStation(req, res, stationId);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const editStation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: number
) => {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({
      message: "Unaithorized",
    });
  }
  const body = req.body;
  const { error } = editStationSchema.validate(body);
  if (error) {
    return res.status(400).send(error);
  }

  try {
    const station = await prisma.station.findUnique({ where: { id } });
    const editedStation = await prisma.station.update({
      where: {
        id,
      },
      data: {
        localId: body.localId ? body.localId : station.localId,
        boxes: {
          create: body.boxes ? body.newBoxes : [],
        },
      },
    });
    return res.status(200).send(editedStation);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deleteStation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: number
) => {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({
      message: "Unaithorized",
    });
  }
  try {
    const deleteBoxes = await prisma.station.update({
      where: {
        id,
      },
      data: {
        boxes: {
          deleteMany: {},
        },
      },
    });
    const deletedStation = await prisma.station.delete({
      where: {
        id,
      },
    });
    return res.status(200).send(deletedStation);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const checkPassword = async () => {
  //Cheks password
};

const editStationSchema = Joi.object({
  localId: Joi.number(),
  newBoxes: Joi.array().items(
    Joi.object({
      localId: Joi.number(),
    })
  ),
}).required();
