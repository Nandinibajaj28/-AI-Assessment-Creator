import express from "express";
import {
  createAssignment,
  getAssignment,
  regenerateAssignment
} from "../controllers/assignment.controller";

const router = express.Router();

router.post("/", createAssignment);
router.post("/:id/regenerate", regenerateAssignment);
router.get("/:id", getAssignment);

export default router;
