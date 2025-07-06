import { Router } from "express";
import {
  getGadgets,
  createGadget,
  updateGadget,
  deleteGadget,
  selfDestruct,
} from "../controllers/gadget.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// GET /gadgets - Get all gadgets with optional status filter
router.get("/", authenticateToken, getGadgets);

// POST /gadgets - Create a new gadget
router.post("/", authenticateToken, createGadget);

// PATCH /gadgets/:id - Update a gadget
router.patch("/:id", authenticateToken, updateGadget);

// DELETE /gadgets/:id - Decommission a gadget
router.delete("/:id", authenticateToken, deleteGadget);

// POST /gadgets/:id/self-destruct - Trigger self-destruct sequence
router.post("/:id/self-destruct", authenticateToken, selfDestruct);

export default router;
