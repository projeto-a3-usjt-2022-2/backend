import express from "express";
import { getUser } from "../controllers/GET";
import { validatedUser } from "../middlewares";

export const router = express.Router();

router.get("/users", validatedUser, getUser);
