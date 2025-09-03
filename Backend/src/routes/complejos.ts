import { Router } from "express";
import { getComplejos } from "../controllers/complejoController";

const router = Router();

router.get("/", getComplejos);

export default router;
