import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: [
        "executive",
        "admin",
        "department_user"
      ],
      default: "department_user"
    },

    approvalStatus: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected"
      ],
      default: "Pending"
    },

    status: {
      type: String,
      default: "Active"
    },

    refreshToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "User",
  userSchema
);