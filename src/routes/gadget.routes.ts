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

/**
 * @swagger
 * /gadgets:
 *   get:
 *     tags: [Gadgets]
 *     summary: Get all gadgets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Deployed, Destroyed, Decommissioned]
 *         description: Filter gadgets by status
 *     responses:
 *       200:
 *         description: Gadgets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 gadgets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gadget'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateToken, getGadgets);

/**
 * @swagger
 * /gadgets:
 *   post:
 *     tags: [Gadgets]
 *     summary: Create a new gadget
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGadgetRequest'
 *     responses:
 *       201:
 *         description: Gadget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, createGadget);

/**
 * @swagger
 * /gadgets/{id}:
 *   patch:
 *     tags: [Gadgets]
 *     summary: Update a gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gadget ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGadgetRequest'
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", authenticateToken, updateGadget);

/**
 * @swagger
 * /gadgets/{id}:
 *   delete:
 *     tags: [Gadgets]
 *     summary: Decommission a gadget
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gadget ID
 *     responses:
 *       200:
 *         description: Gadget decommissioned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, deleteGadget);

/**
 * @swagger
 * /gadgets/{id}/self-destruct:
 *   post:
 *     tags: [Gadgets]
 *     summary: Trigger self-destruct sequence
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Gadget ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SelfDestructRequest'
 *     responses:
 *       200:
 *         description: Self-destruct sequence completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gadget:
 *                   $ref: '#/components/schemas/Gadget'
 *                 destructionTime:
 *                   type: string
 *                   format: date-time
 *                 confirmationCode:
 *                   type: string
 *       400:
 *         description: Bad request or confirmation code required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 confirmationCode:
 *                   type: string
 *                 warning:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/self-destruct", authenticateToken, selfDestruct);

export default router;
