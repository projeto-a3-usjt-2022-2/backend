import { Request, Response } from "express";
import { IUser } from "../../interfaces";
import { db } from "../../services/firebase";

const avaliableClinics = ["Albert Einstein Morumbi"];
export const getUser = async (request: Request, response: Response) => {
  const { clinic, type } = request.query as { clinic: string; type: string };

  if (!avaliableClinics.includes(clinic))
    return response.status(400).json({
      error: "Clinic is not registrated",
      avaliableClinics: avaliableClinics,
    });

  if (type !== "doctor" && type !== "user")
    return response.status(400).json({
      error: "Invalid type argument, must be doctor OR user",
    });

  let usersRef;

  if (type === "user") {
    usersRef = await db
      .collection("Clinics")
      .doc(clinic)
      .collection("Users")
      .get();
  } else {
    usersRef = await db
      .collection("Clinics")
      .doc(clinic)
      .collection("Doctors")
      .get();
  }

  let allUsers = usersRef.docs.map((item) => ({ ...item.data(), id: item.id }));

  return response.status(200).json(allUsers);
};
