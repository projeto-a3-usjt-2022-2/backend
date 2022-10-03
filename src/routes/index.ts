import express from "express";
import { getUser } from "../controllers/GET";
import { createUser } from "../controllers/POST";
import { validatedUser } from "../middlewares";

export const router = express.Router();

router.get("/users", getUser);

router.post("/createUser", validatedUser, createUser);
