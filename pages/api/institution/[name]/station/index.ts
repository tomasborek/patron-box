import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { prisma } from "../../../../../db/prisma";
import { authorizeAdmin } from "../../../../../utils/auth";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }

  const token: string = req.headers.authorization;

  if (!authorizeAdmin(token)) {
    return res.status(401).send({
      message: "Not authorized",
    });
  }

  const body = req.body;
  const { error } = newStationSchema.validate(body);
  if (error) {
    return res.status(400).send(error);
  }
  const institutionName = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;
  try {
    const newStation = await prisma.station.create({
      data: {
        localId: body.localId,
        institution: {
          connect: {
            name: institutionName,
          },
        },
      },
    });
    return res.status(200).send(newStation);
  } catch (error) {
    return res.status(500).send(error);
  }
}

const newStationSchema = Joi.object({
  localId: Joi.number().required(),
}).required();
