import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../../../../db/prisma";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
  const id = Array.isArray(req.body.boxId)
    ? Number.parseInt(req.body.boxId[0])
    : Number.parseInt(req.body.boxId);
  try {
    const box = await prisma.box.findUnique({
      where: {
        id,
      },
    });
    if (!box) {
      return res.status(404).send({
        message: "Box not found.",
      });
    }
    return res.status(200).send(box);
  } catch (error) {
    return res.status(500).send(error);
  }
}
