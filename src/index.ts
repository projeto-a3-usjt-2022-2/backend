import express from "express";
import { Request, Response } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
  console.log("App is running");

  return res.json({ message: "Hello world!" });
});

app.listen(8080);
