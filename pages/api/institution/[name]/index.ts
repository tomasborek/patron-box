import { NextApiRequest, NextApiResponse } from "next";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    return editInstitution();
  } else if (req.method === "DELETE") {
    return deleteInstitution();
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const editInstitution = async () => {
  //Edit institutions details
};
const deleteInstitution = async () => {
  //Delete Institution
};
