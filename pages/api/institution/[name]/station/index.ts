import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../../../db/prisma";
import { authorizeAdmin } from "../../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const institutionName = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;
  const params = {
    institutionName,
  };
  if (req.method === "GET") {
    return getStations(req, res, params);
  } else if (req.method === "POST") {
    return createStation(req, res, params);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const createStation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: { institutionName: string }
) => {
  const { institutionName } = params;
  const token: string = req.headers.authorization;
  const body = req.body;
  if (!authorizeAdmin(token))
    return res.status(401).send({ message: "Not authorized" });
  const { error: schemaError } = newStationSchema.validate(body);
  if (schemaError) return res.status(400).send(schemaError.details);
  if (!body.boxesCount) body.boxesCount = 9;

  const newBoxes = [];
  for (let i = 1; i <= body.boxesCount; i++) {
    newBoxes.push({
      localId: i,
    });
  }
  try {
    const institution = await prisma.institution.findUnique({
      where: {
        name: institutionName,
      },
    });

    if (!institution) {
      return res.status(404).send({ message: "Not found" });
    }
    const existingStations = await prisma.station.findMany({
      where: {
        institution: {
          id: institution.id,
        },
      },
    });
    console.log(newBoxes);
    const existingLocalIds = existingStations.map((station) => station.localId);
    if (existingLocalIds.includes(Number.parseInt(body.localId))) {
      return res.status(400).send({
        message:
          "Station with this local id already exists in this institution",
      });
    }
    await prisma.station.create({
      data: {
        localId: Number.parseInt(body.localId),
        institution: {
          connect: {
            name: institutionName,
          },
        },
        boxes: {
          create: newBoxes,
        },
      },
    });
    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getStations = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: { institutionName: string }
) => {
  const { institutionName } = params;
  const token = req.headers.authorization;
  if (!authorizeAdmin(token))
    return res.status(401).send({ message: "Unauthorized" });
  try {
    const stations = await prisma.station.findMany({
      where: { institution: { name: institutionName } },
      include: { boxes: { select: { localId: true, available: true } } },
    });

    return res.status(200).send(stations);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const newStationSchema = Joi.object({
  localId: Joi.number().required(),
  boxesCount: Joi.number(),
}).required();
