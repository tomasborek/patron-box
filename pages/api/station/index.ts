import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../db/prisma";
import { authentificate, authorizeAdmin } from "../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") return getStations(req, res);
  else if (req.method === "POST") return createStation(req, res);
  else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const createStation = async (req: NextApiRequest, res: NextApiResponse) => {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token))
    return res.status(401).send({ message: "Not authorized" });
  const { error: schemaError } = newStationSchema.validate(req.body);
  if (schemaError) return res.status(400).send(schemaError.details);
  if (!req.body.boxesCount) req.body.boxesCount = 9;

  const newBoxes = [];
  for (let i = 1; i <= req.body.boxesCount; i++) {
    newBoxes.push({
      localId: i,
    });
  }
  try {
    await prisma.station.create({
      data: {
        ...(req.body.instituionName && {
          institution: { connect: { name: req.body.instituionName } },
        }),
        address: req.body.address,
        boxes: { create: newBoxes },
      },
    });
    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getStations = async (req: NextApiRequest, res: NextApiResponse) => {
  const token: string = req.headers.authorization;
  if (!authentificate(token))
    return res.status(401).send({ message: "Unauthorized" });
  try {
    const stations = await prisma.station.findMany({
      include: {
        boxes: {
          select: { localId: true, available: true, reservation: true },
        },
      },
    });
    return res.status(200).send(stations);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const newStationSchema = Joi.object({
  address: Joi.string().required().min(3).max(255),
  institutionName: Joi.string().min(3).max(255),
  boxesCount: Joi.number(),
}).required();
