import express from "express";
import { createAssignment, getAssignment } from "../controllers/assignment.controller"

const router = express.Router();

router.post("/", createAssignment);
router.get("/:id", getAssignment);

export default router;