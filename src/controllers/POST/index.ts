import { Request, Response } from "express";
import { IConsult, IUser } from "../../interfaces";
import { db } from "../../services/firebase";

const avaliableClinics = ["Albert Einstein Morumbi"];

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
        .set({ email: user.email, id, cpf: user.cpf })
        .catch((error) => {
          return response
            .status(400)
            .json({ error: `An error has ocurried: ${error}` });
        });
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

  clinicsRef
    .add(consultInfo)
    .then(() => console.log("Consult created successfully"))
    .catch(() =>
      response.status(400).json({
        error: "Something went wrong!",
      })
    );

  const userId = consultInfo.user.id;

  const usersRef = db
    .collection("Clinics")
    .doc(consultInfo.clinic)
    .collection("Users");

  const currentUser = usersRef.doc(userId);
  let tmpConsult = {
    date: consultInfo.date,
    hour: consultInfo.hour,
    modality: consultInfo.modality,
  };

  let currentUserData = (await currentUser.get()).data();

  currentUser.update({
    ...currentUserData,
    consults: [...currentUserData?.consults, tmpConsult],
  });

  return response.status(200).json(currentUser);
  // return response.status(200).json({
  //   body: consultInfo,
  //   clinicsRef: clinicsRef,
  // });
};
