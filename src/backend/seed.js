
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/invisor";

const users = [
  {
    name: "Executive Governance Director",
    email: "executive@invisor.com",
    password: "Exec0123",
    role: "executive",
    department: "Enterprise Governance",
  },
  {
    name: "System Administrator",
    email: "admin@invisor.com",
    password: "SysAdmin0123",
    role: "admin",
    department: "Enterprise Governance",
  },
  {
    name: "Remittance, Deposits and Treasury Manager",
    email: "rdt.manager@invisor.com",
    password: "RDT0123",
    role: "department_user",
    department: "SGAD - RDT",
  },
  {
    name: "Trade Services Manager",
    email: "trs.manager@invisor.com",
    password: "TRS0123",
    role: "department_user",
    department: "SGAD - TRS",
  },
  {
    name: "Loan and Operations Agency Manager",
    email: "loa.manager@invisor.com",
    password: "LOA0123",
    role: "department_user",
    department: "SGAD - LOA",
  },
  {
    name: "Corporate Banking Services Manager",
    email: "cbs.manager@invisor.com",
    password: "CBS0123",
    role: "department_user",
    department: "SGAD - CBS",
  },
  {
    name: "Operations and SWIFT Communications Manager",
    email: "opc.manager@invisor.com",
    password: "OPC0123",
    role: "department_user",
    department: "SGAD - OPC",
  },
  {
    name: "Global Transactions Banking Client Services Manager",
    email: "gtbd.manager@invisor.com",
    password: "GTBD0123",
    role: "department_user",
    department: "GTBD - Client Service",
  },
  {
    name: "Financial Control Division Manager",
    email: "fcd.manager@invisor.com",
    password: "FCD0123",
    role: "department_user",
    department: "SGAD - FCD",
  },
  {
    name: "Corporate Function Coordination Manager",
    email: "cpc.manager@invisor.com",
    password: "CPC0123",
    role: "department_user",
    department: "SGAD - CPC",
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");
    console.log("Seeding users");

    await User.deleteMany({});

    console.log("Existing users removed");

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        approvalStatus: "Approved",
        status: "Active",
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.insertMany(hashedUsers);

    console.log(`${hashedUsers.length} users seeded successfully`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedUsers();