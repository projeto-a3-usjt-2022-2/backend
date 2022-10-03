import { Request, Response } from "express";
import { IConsult, IUser } from "../../interfaces";
import { db } from "../../services/firebase";
const avaliableClinics = ["Albert Einstein Morumbi"];
export const createUser = async (request: Request, response: Response) => {
  const user = request.body as IUser;

  const clinicRef = db.collection("Clinics").doc(user.clinic);

  let usersRef;

  if (!user.crm) {
    usersRef = clinicRef.collection("Users");
  } else {
    usersRef = clinicRef.collection("Doctors");
  }

  const createdAt = new Date().toISOString();

  await usersRef
    .add({ ...user, createdAt })
    .then(async () => {
      return response.status(200).json({
        message: "User created successfully!",
      });
    })
    .catch(() =>
      response.status(401).json({ error: "Error, user was not created" })
    );
};

export const createConsult = async (request: Request, response: Response) => {
  const consultInfo = request.body as IConsult;

  if (!avaliableClinics.includes(consultInfo.clinic))
    return response.status(400).json({
      error: "Clinic is not registrated",
      avaliableClinics: avaliableClinics,
    });

  const clinicsRef = await db
    .collection("Consults")
    .doc(consultInfo.clinic)
    .collection("Consults");

  clinicsRef.add(consultInfo);
  return response.status(200).json({
    body: consultInfo,
    clinicsRef: clinicsRef,
  });
};
