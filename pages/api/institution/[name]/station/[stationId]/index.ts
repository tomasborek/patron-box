import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../../../../db/prisma";
import { authorizeAdmin } from "../../../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stationId: number = Array.isArray(req.query.stationId)
    ? Number.parseInt(req.query.stationId[0])
    : Number.parseInt(req.query.stationId);
  const institutionName: string = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;

  if (req.method === "POST") {
    return checkPassword();
  } else if (req.method === "DELETE") {
    return deleteStation(req, res, stationId, institutionName);
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const deleteStation = async (
  req: NextApiRequest,
  res: NextApiResponse,
  localId: number,
  institutionName: string
) => {
  const token: string = req.headers.authorization;
  if (!authorizeAdmin(token)) {
    return res.status(401).send({
      message: "Unaithorized",
    });
  }
  try {
    const station = await prisma.station.findFirst({
      where: {
        AND: [
          {
            institution: {
              name: institutionName,
            },
          },
          {
            localId: localId,
          },
        ],
      },
    });
    await prisma.box.deleteMany({
      where: {
        station: {
          id: station.id,
        },
      },
    });

    await prisma.station.delete({
      where: {
        id: station.id,
      },
    });
    return res.status(200).send(null);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const checkPassword = async () => {
  //Cheks password
};
