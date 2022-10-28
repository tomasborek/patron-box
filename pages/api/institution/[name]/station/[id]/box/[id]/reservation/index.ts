import { NextApiRequest, NextApiResponse } from "next";

export default async function Hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return createReservation();
  } else if (req.method === "DELETE") {
    return deleteReservation();
  } else {
    return res.status(405).send({
      message: "Method not allowed",
    });
  }
}

const createReservation = async () => {
  //Create reservation
};
const deleteReservation = async () => {
  //Delete Reservation
};
