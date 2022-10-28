import { NextApiRequest, NextApiResponse } from "next";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    return editStation();
  } else if (req.method === "POST") {
    return checkPassword();
  } else if (req.method === "DELETE") {
    return deleteStation();
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const editStation = async () => {
  //Edit institutions details
};

const checkPassword = async () => {
  //Cheks password
};
const deleteStation = async () => {
  //Delete Station
};
