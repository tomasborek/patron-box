import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../../db/prisma";
import { authorizeAdmin } from "../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stationId: number = Array.isArray(req.query.stationId)
    ? Number.parseInt(req.query.stationId[0])
    : Number.parseInt(req.query.stationId);

  if (req.method === "POST") return checkPassword();
  else if (req.method === "GET") return getStation(req, res, stationId);
  else if (req.method === "DELETE") return deleteStation(req, res, stationId);
  else if (req.method === "PATCH") return editStation(req, res, stationId);
  else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const getStation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: number
) => {
  try {
    const station = await prisma.station.findFirst({
      where: { id },
      include: { boxes: { include: { reservation: true } } },
    });
    return res.status(200).send(station);
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
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const station = await prisma.station.findFirst({
      where: { id },
    });
    if (!station) return res.status(404).send({ message: "Not found." });

    await prisma.box.deleteMany({
      where: { station: { id } },
    });

    await prisma.station.delete({
      where: { id },
    });

    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const editStation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: number
) => {
  try {
    const token: string = req.headers.authorization;
    if (!authorizeAdmin(token)) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const station = await prisma.station.update({
      where: { id },
      data: { address: req.body.address },
    });
    return res.status(200).send(station.address);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const checkPassword = async () => {
  //Cheks password
};
