import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import AuditLog from "../models/AuditLog.js";

export const getLeaves = async (req, res, next) => {
  try {
    const filter = { company: req.user.company };

    if (req.user.role === "employee") {
      const employee = await Employee.findOne({ user: req.user._id, company: req.user.company });
      if (!employee) return res.status(404).json({ success: false, message: "Employee profile not found" });
      filter.employee = employee._id;
    }

    const leaves = await Leave.find(filter)
      .populate("employee", "name employeeCode department")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: leaves });
  } catch (error) {
    next(error);
  }
};

export const createLeave = async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate, reason, leaveType } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: "Start date, end date and reason are required" });
    }
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: "End date cannot be before start date" });
    }

    let employee;
    if (req.user.role === "employee") {
      employee = await Employee.findOne({ user: req.user._id, company: req.user.company });
    } else {
      employee = await Employee.findOne({ _id: employeeId, company: req.user.company });
    }

    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    const leave = await Leave.create({
      employee: employee._id,
      company: req.user.company,
      startDate,
      endDate,
      reason,
      leaveType: leaveType || "casual",
      status: "pending",
    });

    res.status(201).json({ success: true, message: "Leave request submitted", data: leave });
  } catch (error) {
    next(error);
  }
};

export const reviewLeave = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be approved or rejected" });
    }

    const leave = await Leave.findOne({ _id: req.params.id, company: req.user.company });
    if (!leave) return res.status(404).json({ success: false, message: "Leave request not found" });
    if (leave.status !== "pending") {
      return res.status(400).json({ success: false, message: "This request has already been reviewed" });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    await leave.save();

    await AuditLog.create({
      company: req.user.company,
      user: req.user._id,
      action: `leave_${status}`,
      details: `Leave request ${leave._id} ${status}`,
    });

    res.json({ success: true, message: `Leave request ${status}`, data: leave });
  } catch (error) {
    next(error);
  }
};

export const cancelLeave = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id, company: req.user.company });
    if (!employee) return res.status(404).json({ success: false, message: "Employee profile not found" });

    const leave = await Leave.findOne({
      _id: req.params.id,
      employee: employee._id,
      company: req.user.company,
      status: "pending",
    });

    if (!leave) return res.status(404).json({ success: false, message: "Pending leave request not found" });

    await leave.deleteOne();
    res.json({ success: true, message: "Leave request cancelled" });
  } catch (error) {
    next(error);
  }
};
