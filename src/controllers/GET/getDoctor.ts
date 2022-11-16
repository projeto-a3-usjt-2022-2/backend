import { Request, Response } from "express";
import { db } from "../../services/firebase";
import { avaliableClinics } from "../POST/_index";

export const getDoctorsByClinic = async (
  request: Request,
  response: Response
) => {
  const { clinic, modality } = request.query as {
    clinic: string;
    modality?: string;
  };

  console.log(clinic);

  if (!avaliableClinics.includes(clinic))
    return response.status(400).json({
      error: "Clinic is not registrated",
      avaliableClinics: avaliableClinics,
    });

  let doctorsRef = await db
    .collection("Clinics")
    .doc(clinic)
    .collection("Doctors")
    .get();

  let allUsers: [] | any[] = [];

  if (modality) {
    allUsers = doctorsRef.docs.map((item) => {
      let itemData = item.data();

      if (itemData.modality === modality)
        return {
          crm: itemData.crm,
          doctorSchedule: itemData.doctorSchedule,
          modality: itemData.modality,
          name: itemData.name,
          id: item.id,
        };
    });
  } else {
    allUsers = doctorsRef.docs.map((item) => {
      let itemData = item.data();
      return {
        crm: itemData.crm,
        doctorSchedule: itemData.doctorSchedule,
        modality: itemData.modality,
        name: itemData.name,
        id: item.id,
      };
    });
  }
  doctorsRef.docs.map((item) => ({
    ...item.data(),
    id: item.id,
  }));

  allUsers = allUsers.filter((item) => item);
  return response.status(200).json({ data: allUsers });
};
