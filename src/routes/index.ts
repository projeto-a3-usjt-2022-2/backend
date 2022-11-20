import express from "express";
import { getUser } from "../controllers/GET";
import { avaliableSchedule } from "../controllers/POST/avaliableSchedule";
import { getDoctorsByClinic } from "../controllers/GET/getDoctor";
import {
  createConsult,
  createUser,
  verifyUserLogin,
} from "../controllers/POST/_index";
import {
  validatedConsult,
  validatedUser,
  validateGetConsults,
} from "../middlewares";
import { allConsultsById } from "../controllers/POST/allConsultsById";
import { sendConsultToQueue } from "../controllers/queue/sendConsult";
import { receiveAllConsults } from "../controllers/queue/receiveAllConsults";
import { getCurrentConsult } from "../controllers/GET/getCurrentConsult";

export const router = express.Router();

router.get("/users", getUser);
router.get("/doctors", getDoctorsByClinic);
router.get("/currentConsult", getCurrentConsult);

router.post("/createUser", validatedUser, createUser);
router.post("/createConsult", validatedConsult, createConsult);
router.post("/login", verifyUserLogin);
router.post("/doctorSchedule", avaliableSchedule);
router.post("/consults", validateGetConsults, allConsultsById);

router.post("/addConsultQueue", sendConsultToQueue);
