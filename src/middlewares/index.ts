import { NextFunction, Request, Response } from "express";
import { IConsult, IGetConsults, IUser } from "../interfaces";

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
    clinic: "typeof string",
    modality: "typeof string - required if crm exists",
  } as IUser;

  const {
    name,
    lastName,
    birthDate,
    cpf,
    crm,
    email,
    sex,
    password,
    clinic,
    modality,
  } = request.body as IUser;

  if (
    !name ||
    !lastName ||
    !birthDate ||
    !cpf ||
    !email ||
    !sex ||
    !password ||
    !clinic ||
    (crm && !modality) // if user is doctor, needs modality
  ) {
    return response.status(400).json({
      error: "Invalid body arguments, verify all them",
      example: keyValues,
    });
  }

  next();
};

export const validatedConsult = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const keyRequired = {
    cep: "typeof string",
    clinic: "typeof string",
    date: "typeof string",
    hour: "typeof string",
    modality: "typeof string",
    doctorId: "typeof string",
    userId: "typeof string",
  } as IConsult;

  const { clinic, date, doctorId, hour, modality, userId } =
    request.body as IConsult;
  if (!clinic || !date || !doctorId || !hour || !modality || !userId) {
    return response.status(400).json({
      error: "Invalid body arguments, verify all them",
      example: keyRequired,
    });
  }
  return next();
};

export const validateGetConsults = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { clinic, crm, userId } = request.body as unknown as IGetConsults;

  let requiredKeys = {
    clinic: "typeof string",
    crm: "typeof string | null",
    schedule: "typeof string[] | undefined",
    userId: "typeof string",
  };

  if (!clinic || !userId) {
    return response.status(400).json({
      error: "Invalid body arguments, verify all them",
      example: requiredKeys,
    });
  }

  return next();
};
