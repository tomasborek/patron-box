import { NextApiRequest, NextApiResponse } from "next";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
  //Create new user
}
