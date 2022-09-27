import express from "express";
import cors from "cors";
import healthInsurance from "./services/firebase";

import { Request, Response } from "express";
interface IHealthInsurance {
  name: string;
  cnpj: string;
  doctors: { name: string; id: number }[] | [];
}

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  console.log("App is running");

  return res.json({ message: "Hello world!" });
});

app.post("/health-insurance", async (req: Request, res: Response) => {
  const data = req.body as IHealthInsurance;

  await healthInsurance.add(data);

  res.send({ message: "Health Insurance has created!" });
});

app.listen(8080);
