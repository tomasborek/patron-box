import { NextApiRequest, NextApiResponse } from "next";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return getUser();
  } else if (req.method === "DELETE") {
    return deleteUser();
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const getUser = async () => {
  //get user
};
const deleteUser = async () => {
  //delete user
};
