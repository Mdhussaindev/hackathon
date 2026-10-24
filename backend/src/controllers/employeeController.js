
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({
      company: req.user.company,
    })
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      company: req.user.company,
    }).populate("department", "name");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const {
      employeeCode,
      name,
      email,
      phone,
      designation,
      department,
      joiningDate,
      employmentStatus,
      salary,
    } = req.body;

    if (!employeeCode || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Employee code, name and email are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = employeeCode.trim().toUpperCase();

    const duplicate = await Employee.findOne({
      company: req.user.company,
      $or: [
        { email: normalizedEmail },
        { employeeCode: normalizedCode },
      ],
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Employee email or code already exists",
      });
    }

    if (department) {
      const validDepartment = await Department.findOne({
        _id: department,
        company: req.user.company,
      });

      if (!validDepartment) {
        return res.status(400).json({
          success: false,
          message: "Invalid department",
        });
      }
    }

    const employee = await Employee.create({
      employeeCode: normalizedCode,
      name: name.trim(),
      email: normalizedEmail,
      phone,
      designation,
      department: department || null,
      joiningDate: joiningDate || undefined,
      employmentStatus: employmentStatus || "active",
      salary: salary ?? 0,
      company: req.user.company,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Employee email or code already exists",
      });
    }
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const allowedFields = [
      "employeeCode",
      "name",
      "email",
      "phone",
      "designation",
      "department",
      "joiningDate",
      "employmentStatus",
      "salary",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.email) {
      updates.email = updates.email.trim().toLowerCase();
    }

    if (updates.employeeCode) {
      updates.employeeCode = updates.employeeCode.trim().toUpperCase();
    }

    if (updates.department) {
      const validDepartment = await Department.findOne({
        _id: updates.department,
        company: req.user.company,
      });

      if (!validDepartment) {
        return res.status(400).json({
          success: false,
          message: "Invalid department",
        });
      }
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID or department ID",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Employee email or code already exists",
      });
    }

    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    next(error);
  }
};
