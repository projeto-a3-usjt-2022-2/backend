import { Request, Response } from "express";
import { avaliableClinics } from "./_index";
import { IConsult } from "../../interfaces";
import { db } from "../../services/firebase";

export const createConsult = async (request: Request, response: Response) => {
    const consultInfo = request.body as IConsult;

    if (!avaliableClinics.includes(consultInfo.clinic))
        return response.status(400).json({
            error: "Clinic is not registrated",
            avaliableClinics: avaliableClinics,
        });

    const clinicsRef = db
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

    return response.status(200);
};