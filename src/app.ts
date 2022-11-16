import express from "express";
import cors from "cors";

import { router } from "./routes";
import { checkAuth } from "./middlewares/checkAuth";
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.use("/login", checkAuth);

app.listen(8081, () => console.log("Server is running on port 8081"));
