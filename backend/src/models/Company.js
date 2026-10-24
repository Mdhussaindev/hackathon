
import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    officeStart: { type: String, default: "09:00" },
    graceMinutes: { type: Number, default: 10, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
