import { Request, Response } from "express";
import { IUser } from "../../interfaces";
import { db } from "../../services/firebase";

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
