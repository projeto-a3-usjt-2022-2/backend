import { Request, Response } from "express";
import { userInfo } from "os";
import { db } from "../../services/firebase";

export const verifyUserLogin = async (request: Request, response: Response) => {
  const { credential, password } = request.body;

  if (!credential || !password)
    return response.status(400).json({
      error: "Missing arguments!, credential and password is required",
    });

  const cpfUser = await db
    .collection("LogIn")
    .where("cpf", "==", credential)
    .get();
  const crmUser = await db
    .collection("LogIn")
    .where("cpf", "==", credential)
    .get();

  if (cpfUser.empty || crmUser.empty)
    return response.status(400).json({
      error: "User not found",
    });

  let result: any[] = [];

  if (cpfUser) {
    cpfUser.forEach((doc) => {
      result.push(doc.data());
    });
  } else {
    crmUser.forEach((doc) => {
      result.push(doc.data());
    });
  }

  return response.status(200).json({ users: result });
};
