import { Router } from "express";
import { generateReportController } from "../controllers/user.controller";
import { verifyUser } from "../utils/verifyUser";

const router = Router()

router.post("/generate-report", verifyUser, generateReportController)


export default router