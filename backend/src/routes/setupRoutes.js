
import { Router } from "express";
import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import User from "../models/User.js";

const router = Router();

router.get("/status", async (req, res) => {
  try {
    const initialized = Boolean(await Company.exists({}));

    res.json({ initialized });
  } catch (error) {
    res.status(500).json({ message: "Unable to check setup status" });
  }
});

router.post("/initialize", async (req, res) => {
  try {
    const {
      companyName,
      officeStart,
      graceMinutes,
      adminName,
      adminEmail,
      adminPassword
    } = req.body;

    if (await Company.exists({}) || await User.exists({ role: "admin" })) {
      return res.status(409).json({
        message: "Workspace already initialized"
      });
    }

    if (
      !companyName?.trim() ||
      !adminName?.trim() ||
      !adminEmail?.trim() ||
      typeof adminPassword !== "string" ||
      adminPassword.length < 8
    ) {
      return res.status(400).json({
        message: "Complete all required fields. Password must be at least 8 characters."
      });
    }

    if (
      officeStart &&
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(officeStart)
    ) {
      return res.status(400).json({ message: "Invalid office start time" });
    }

    const grace = graceMinutes === undefined ? 10 : Number(graceMinutes);

    if (!Number.isInteger(grace) || grace < 0 || grace > 180) {
      return res.status(400).json({ message: "Invalid grace period" });
    }

    const company = await Company.create({
      name: companyName.trim(),
      officeStart: officeStart || "09:00",
      graceMinutes: grace
    });

    try {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await User.create({
        name: adminName.trim(),
        email: adminEmail.trim().toLowerCase(),
        password: hashedPassword,
        role: "admin",
        company: company._id,
        mustChangePassword: false
      });
    } catch (error) {
      await Company.deleteOne({ _id: company._id });
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Workspace created successfully"
    });
  } catch (error) {
    console.error("Setup error:", error.message);

    res.status(500).json({
      message: "Workspace setup failed"
    });
  }
});

export default router;
