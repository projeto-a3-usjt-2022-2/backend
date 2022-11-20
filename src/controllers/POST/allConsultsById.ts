import { Request, Response } from "express";
import { IGetConsults } from "../../interfaces";
import { db } from "../../services/firebase";
import { avaliableClinics } from "./_index";

export const allConsultsById = async (request: Request, response: Response) => {
  const { clinic, crm, userId } = request.body as unknown as IGetConsults;

  if (!avaliableClinics.includes(clinic))
    return response.status(400).json({
      error: "Clinic is not registrated",
      avaliableClinics: avaliableClinics,
    });

  let userRefInfo = db
    .collection("Clinics")
    .doc(clinic)
    .collection(crm ? "Doctors" : "Users")
    .doc(userId);

  let content = (await userRefInfo.get()).data() as any;

  let schedule = content ? content.schedule : undefined;

  if (!schedule) return response.status(200).json({ data: [] });

  const consultRef = db
    .collection("Consults")
    .doc(clinic)
    .collection("Consults");

  let allConsults: [] | any[] = [];
  for await (let item of schedule) {
    let { schedule } = await getConsultsBasedOnId(
      userId,
      crm,
      item,
      consultRef
    );

    allConsults = [...allConsults, ...schedule];
  }

  return response.status(200).json({ data: allConsults });
};

const getConsultsBasedOnId = async (
  userId: string,
  crm: null | string,
  currentDate: string,
  consultRef: any
) => {
  consultRef = consultRef.doc(currentDate);

  let consultData = (await consultRef.get()).data() as { schedule: any[] };

  if (crm) {
    consultData.schedule = consultData.schedule.filter(
      (item) => item.doctorId === userId
    );
  } else {
    consultData.schedule = consultData.schedule.filter(
      (item) => item.userId === userId
    );
  }

  return consultData;
};
