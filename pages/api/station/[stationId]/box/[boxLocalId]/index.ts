import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../../db/prisma";
import { authorizeAdmin } from "../../../../../../utils/auth";
//interfaces
interface Params {
  stationId: number;
  boxLocalId: number;
}

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stationId: number = Array.isArray(req.query.stationId)
    ? parseInt(req.query.stationId[0])
    : parseInt(req.query.stationId);
  const boxLocalId: number = Array.isArray(req.query.boxId)
    ? parseInt(req.query.boxId[0])
    : parseInt(req.query.boxId);
  const params: Params = {
    stationId,
    boxLocalId,
  };

  if (req.method === "GET") return getBox(req, res, params);
  else if (req.method === "PATCH")
    return changeBoxAvailability(req, res, params);
  else {
    return res.status(405).send({ message: "Method not allowed." });
  }
}

const getBox = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: Params
) => {
  try {
    const box = await prisma.box.findFirst({
      where: { station: { id: params.stationId }, localId: params.boxLocalId },
      select: { localId: true, available: true, reservation: true },
    });
    if (!box) {
      return res.status(404).send({ message: "Not found" });
    }

    return res.status(200).send(box);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const changeBoxAvailability = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: Params
) => {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const box = await prisma.box.findFirst({
      where: { station: { id: params.stationId }, localId: params.boxLocalId },
    });
    if (!box) {
      return res.status(404).send({ message: "Not found" });
    }

    const updatedBox = await prisma.box.update({
      where: { id: box.id },
      data: { available: req.body.available },
    });

    return res.status(200).send({
      available: updatedBox.available,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
