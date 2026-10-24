import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getLeaves,
  createLeave,
  reviewLeave,
  cancelLeave,
} from "../controllers/leaveController.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", getLeaves);
router.post("/", createLeave);
router.patch("/:id/review", roleMiddleware("admin", "hr"), reviewLeave);
router.delete("/:id", roleMiddleware("employee"), cancelLeave);

export default router;
