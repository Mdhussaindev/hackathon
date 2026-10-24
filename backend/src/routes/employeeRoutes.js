
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);

router.post(
  "/",
  roleMiddleware("admin", "hr"),
  createEmployee
);

router.put(
  "/:id",
  roleMiddleware("admin", "hr"),
  updateEmployee
);

router.delete(
  "/:id",
  roleMiddleware("admin"),
  deleteEmployee
);

export default router;
