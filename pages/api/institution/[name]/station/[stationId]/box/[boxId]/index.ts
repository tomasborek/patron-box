import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../../../../db/prisma";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const institutionName: string = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;
  const stationLocalId: number = Array.isArray(req.query.stationId)
    ? parseInt(req.query.stationId[0])
    : parseInt(req.query.stationId);
  const boxLocalId: number = Array.isArray(req.query.boxId)
    ? parseInt(req.query.boxId[0])
    : parseInt(req.query.boxId);
  const params = {
    institutionName,
    stationLocalId,
    boxLocalId,
  };

  if (req.method === "GET") {
    return getBox(req, res, params);
  } else if (req.method === "PATCH") {
    return changeBoxAvailability(req, res, params);
  }
}

const getBox = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: {
    institutionName: string;
    stationLocalId: number;
    boxLocalId: number;
  }
) => {
  try {
    const box = await prisma.box.findFirst({
      where: {
        AND: [
          {
            station: {
              AND: [
                {
                  institution: {
                    name: params.institutionName,
                  },
                  localId: params.stationLocalId,
                },
              ],
            },
          },
          {
            localId: params.boxLocalId,
          },
        ],
      },
      select: { localId: true, available: true, reservation: true },
    });

    if (!box) {
      return res.status(404).send({
        message: "Not found",
      });
    }

    return res.status(200).send(box);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const changeBoxAvailability = async (
  req: NextApiRequest,
  res: NextApiResponse,
  params: {
    institutionName: string;
    stationLocalId: number;
    boxLocalId: number;
  }
) => {
  try {
    const box = await prisma.box.findFirst({
      where: {
        AND: [
          {
            station: {
              AND: [
                {
                  institution: { name: params.institutionName },
                },
                {
                  localId: params.stationLocalId,
                },
              ],
            },
          },
          {
            localId: params.boxLocalId,
          },
        ],
      },
    });
    if (!box) {
      return res.status(404).send({
        message: "Not found.",
      });
    }

    const updatedBox = await prisma.box.update({
      where: {
        id: box.id,
      },
      data: {
        available: req.body.available,
      },
    });

    return res.status(200).send({
      available: updatedBox.available,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
