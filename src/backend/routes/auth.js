
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

const router = express.Router();

function buildUserResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  };
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      department: user.department,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        department,
        role: "department_user",
        approvalStatus: "Pending"
      });

    const token = generateToken(user);

    await AuditLog.create({
      userEmail: user.email,
      userRole: user.role,
      department: user.department,
      action: "REGISTER_SUCCESS",
      entityType: "User",
      entityId: user._id.toString(),
      decisionOutcome: "User account created",
      explanation: `${user.name} was registered under ${user.department} with ${user.role} access.`,
      ip: req.ip,
    });

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    console.log("LOGIN USER:", user);

    if (!user) {
      await AuditLog.create({
        userEmail: email,
        action: "LOGIN_FAILED",
        entityType: "Authentication",
        decisionOutcome: "Invalid email",
        explanation: "Login attempt failed because no matching user account was found.",
        ip: req.ip,
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.approvalStatus !== "Approved") {

  return res.status(403).json({
    message:
      "Account pending administrator approval"
  });

}

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      await AuditLog.create({
        userEmail: user.email,
        userRole: user.role,
        department: user.department,
        action: "LOGIN_FAILED",
        entityType: "Authentication",
        entityId: user._id.toString(),
        decisionOutcome: "Invalid password",
        explanation: "Login attempt failed because the password was incorrect.",
        ip: req.ip,
      });

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    await AuditLog.create({
      userEmail: user.email,
      userRole: user.role,
      department: user.department,
      action: "LOGIN_SUCCESS",
      entityType: "Authentication",
      entityId: user._id.toString(),
      decisionOutcome: "Access granted",
      explanation: `${user.name} logged in successfully as ${user.role} for ${user.department}.`,
      ip: req.ip,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;