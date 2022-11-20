import { Request, Response } from "express";
import { IAvaliableSchedule, IConsult } from "../../interfaces";
import { db } from "../../services/firebase";
import { avaliableClinics } from "./_index";

export const avaliableSchedule = async (
  request: Request,
  response: Response
) => {
  const { doctorId, clinic, doctorSchedule, date } =
    request.body as IAvaliableSchedule;

  if (!avaliableClinics.includes(clinic))
    return response.status(400).json({
      error: "Clinic is not registrated",
      avaliableClinics: avaliableClinics,
    });

  //console.log(doctorId, clinic, doctorSchedule, date);

  let doctorRef = db
    .collection("Consults")
    .doc(clinic)
    .collection("Consults")
    .doc(date);

  let doctorData = (await doctorRef.get()).data() as
    | { schedule: IConsult[] }
    | undefined;

  console.log("doctorRef", doctorRef);

  if (doctorData) {
    let schedulesDoctor = doctorData.schedule
      .map((item) => {
        return item.doctorId === doctorId ? item.hour : null;
      })
      .filter((item) => item);

    //console.table({ selected: schedulesDoctor, hours: doctorSchedule });

    let avaliableHours = doctorSchedule
      .map((hour) => {
        if (!schedulesDoctor.includes(hour)) return hour;
        return null;
      })
      .filter((item) => item);

    return response.status(200).json({ data: avaliableHours });
  } else {
    return response.status(200).json({ data: doctorSchedule });
  }

  // console.table({
  //   selected: schedulesDoctor,
  //   hours: doctorSchedule,
  //   free: avaliableHours,
  // });
};
