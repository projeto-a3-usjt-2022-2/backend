import { Request, Response } from "express";
import { avaliableClinics } from "./_index";
import { IUser } from "../../interfaces";
import { db } from "../../services/firebase";

export const createUser = async (request: Request, response: Response) => {
  const user = request.body as IUser;

  if (!avaliableClinics.includes(user.clinic))
    return response.status(400).json({
      error: "Clinic is not registrated",
      avaliableClinics: avaliableClinics,
    });
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
    .then(async ({ id }) => {
      console.log("this is data", id);

      await db
        .collection("LogIn")
        .doc(id)
        .set({
          email: user.email,
          id,
          cpf: user.cpf,
          password: user.password,
          crm: user.crm,
          clinic: user.clinic,
          name: user.name,
        })
        .catch((error) => {
          return response
            .status(400)
            .json({ error: `An error has ocurried: ${error}` });
        })
        .then(() => {
          return response.status(200).json({
            message: "User created successfully!",
            data: {
              email: user.email,
              cpf: user.cpf,
              clinic: user.clinic,
              id,
              crm: user.crm,
              name: user.name,
            },
          });
        });
    })
    .catch((err: any) => {
      console.log(err);

      response.status(401).json({ error: "Error, user was not created" });
    });
};
