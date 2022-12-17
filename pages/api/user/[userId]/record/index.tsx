import { NextApiRequest, NextApiResponse } from "next";
import { getParam } from "../../../../../utils/helpers";

export default function Handler(req: NextApiRequest, res: NextApiResponse) {
  const userId: number = Number(getParam(req, "userId"));
  if (req.method === "GET") return getRecords(req, res, userId);
  else {
    return res.status(405).send({ message: "Method not allowed" });
  }
}

const getRecords = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: number
) => {
  try {
    const records = await prisma.record.findMany({
      where: { userId },
    });
    return res.status(200).send(records);
  } catch (error) {
    return res.status(500).send(error);
  }
};
