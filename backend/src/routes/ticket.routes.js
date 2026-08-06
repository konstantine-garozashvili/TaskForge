import express from "express";
import * as ticketController from "../controllers/ticket.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", authenticate, ticketController.getAllTickets);
router.get("/:id", authenticate, ticketController.getTicketById);
router.post("/", authenticate, ticketController.createTicket);
router.put("/:id", authenticate, ticketController.updateTicket);
router.delete("/:id", authenticate, ticketController.deleteTicket);
router.patch("/:id/status", authenticate, ticketController.changeStatus);
router.patch("/:id/assign", authenticate, ticketController.assignTicket);

export default router;