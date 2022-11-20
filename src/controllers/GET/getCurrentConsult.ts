import { Request, Response } from "express";
import fs from "fs";

export const getCurrentConsult = async (
  request: Request,
  response: Response
) => {
  fs.readFile("./queueConsult.json", "utf-8", function (err: any, obj: any) {
    let objParse = JSON.parse(obj);

    console.log(objParse.consult);

    return response.status(200).json(objParse.consult);
  });
};
