import express from "express";
import { getUser } from "../controllers/GET";
import {
  createConsult,
  createUser,
  verifyUserLogin,
} from "../controllers/POST/_index";
import { validatedConsult, validatedUser } from "../middlewares";

export const router = express.Router();

router.get("/users", getUser);

router.post("/createUser", validatedUser, createUser);
router.post("/createConsult", validatedConsult, createConsult);
router.post("/login", verifyUserLogin);
