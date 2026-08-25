import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* GET USERS */
router.get("/", async (req, res) => {
  try {

    const users = await User.find().sort({
      createdAt: -1
    });

    res.json(users);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to load users"
    });

  }
});

/* APPROVE USER */
router.put("/:id/approve", async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "Approved"
      },
      {
        new: true
      }
    );

    res.json(user);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Approval failed"
    });

  }
});

/* REJECT USER */
router.put("/:id/reject", async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: "Rejected"
      },
      {
        new: true
      }
    );

    res.json(user);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Reject failed"
    });

  }
});

export default router;