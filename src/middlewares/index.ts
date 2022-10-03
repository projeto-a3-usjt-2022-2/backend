import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces";

export const validatedUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const keyValues = {
    name: "typeof string",
    lastName: "typeof string",
    birthDate: "typeof string",
    cpf: "typeof string",
    crm: "typeof string | null",
    email: "typeof string",
    sex: "typeof string",
    password: "typeof string",
  } as IUser;

  const { name, lastName, birthDate, cpf, crm, email, sex, password } =
    request.body as IUser;

  if (
    !name ||
    !lastName ||
    !birthDate ||
    !cpf ||
    !!crm ||
    !email ||
    !sex ||
    !password
  ) {
    return response.status(400).json({
      error: "Invalid body arguments, verify all them",
      example: keyValues,
    });
  }

  next();
};