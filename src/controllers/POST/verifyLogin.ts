import { Request, Response } from "express";
import { userInfo } from "os";
import { db } from "../../services/firebase";

export const verifyUserLogin = async (request: Request, response: Response) => {
  const { credential, password } = request.body;

  if (!credential || !password)
    return response.status(400).json({
      message: "Missing arguments!, credential and password is required",
    });

  const cpfUser = await db
    .collection("LogIn")
    .where("cpf", "==", credential)
    .get();
  const crmUser = await db
    .collection("LogIn")
    .where("crm", "==", credential)
    .get();

  if (cpfUser.empty && crmUser.empty)
    return response.status(400).json({
      message: "User not found",
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

  console.log(result);

  const verifyPassword = () => {
    let samePassword = result
      .map((user) => {
        return user.password === password ? true : false;
      })
      .filter((item) => item);

    console.log("this is the result", result);

    let { email, cpf, clinic, id, name, crm } = result[0];

    if (samePassword.length === 0)
      return response
        .status(400)
        .json({ message: "please, check your password and try again!" });
    return response
      .status(200)
      .json({ data: { email, cpf, clinic, id, name, crm } });
  };

  verifyPassword();
};
