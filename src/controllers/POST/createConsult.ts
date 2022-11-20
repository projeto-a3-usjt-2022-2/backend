import { Request, Response } from "express";
import { avaliableClinics } from "./_index";
import { IConsult } from "../../interfaces";
import { db } from "../../services/firebase";

export const createConsult = async (request: Request, response: Response) => {
  const consultInfo = request.body as IConsult;

  console.log("consult info", consultInfo);

  const clinicRef = db.collection("Clinics").doc(consultInfo.clinic);

  const { cep } = (await clinicRef.get()).data() as any;

  if (!avaliableClinics.includes(consultInfo.clinic))
    return response.status(400).json({
      error: "Clinic is not registrated",
      avaliableClinics: avaliableClinics,
    });

  const clinicsRef = db
    .collection("Consults")
    .doc(consultInfo.clinic)
    .collection("Consults");

  let doc = (await clinicsRef.doc(consultInfo.date).get()).data() as
    | {
        schedule: IConsult[] | [];
      }
    | undefined;

  // Add date in each user
  let userRef = db
    .collection("Clinics")
    .doc(consultInfo.clinic)
    .collection("Users")
    .doc(consultInfo.userId);

  let doctorRef = db
    .collection("Clinics")
    .doc(consultInfo.clinic)
    .collection("Doctors")
    .doc(consultInfo.doctorId);

  let userInfo = (await userRef.get()).data();
  let doctorInfo = (await doctorRef.get()).data();

  if (!doc) {
    clinicsRef.doc(consultInfo.date).set({
      schedule: [{ ...consultInfo, status: "waiting", cep: cep }],
    });
  } else if (doc && doc.schedule.length === 0) {
    await clinicsRef
      .doc(consultInfo.date)
      .set({ schedule: [{ ...consultInfo, status: "waiting", cep: cep }] })
      .catch(() =>
        response.status(401).json({ message: "Something went wrong" })
      );
  } else {
    let tmpSchedule = doc.schedule;

    await clinicsRef
      .doc(consultInfo.date)
      .set({
        schedule: [
          ...tmpSchedule,
          { ...consultInfo, status: "waiting", cep: cep },
        ],
      })
      .catch(() =>
        response.status(401).json({ message: "Something went wrong" })
      );
  }
  // when consult was created, add a ref into Users and Doctor collections

  addNewDateIntoSchedule(doctorRef, doctorInfo, consultInfo.date);
  addNewDateIntoSchedule(userRef, userInfo, consultInfo.date);

  return response
    .status(200)
    .json({ data: "consult was created successfully" });
};

const addNewDateIntoSchedule = (userRef: any, userInfo: any, date: string) => {
  let tmpSchedule = userInfo.schedule as string[] | undefined;

  if (!tmpSchedule) return userRef.set({ schedule: [date] }, { merge: true });

  if (!tmpSchedule.some((item) => item === date)) {
    tmpSchedule = [...tmpSchedule, date];
    userRef.set({ schedule: tmpSchedule }, { merge: true });
  }
};
