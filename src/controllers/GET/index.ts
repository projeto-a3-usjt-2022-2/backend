import { Request, Response } from "express";
import { IUser } from "../../interfaces";

export const getUser = async (request: Request, response: Response) => {
  const user = request.body as IUser;

  return response.status(200).json(user);
};
