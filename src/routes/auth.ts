import { Router } from "express";
import { CallBack, Login } from "../controller/auth";

const router = Router();
router.get("/login", Login);
router.get("/callback", CallBack);

export default router;