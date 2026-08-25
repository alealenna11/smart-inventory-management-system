import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

router.get("/metrics", async (req, res) => {
  try {
    const items = await Inventory.find();

    if (!items.length) {
      return res.json({
        efficiency: 0,
        utilisation: 0,
        risk: 0,
        governanceScore: 0,
        trend: [],
        prediction: [],
        hotspots: []
      });
    }

    let total = 0;
    let allocated = 0;
    const deptLoad = {};

    items.forEach(item => {
      total += item.quantity;
      allocated += item.allocated;

      if (!deptLoad[item.department]) {
        deptLoad[item.department] = 0;
      }

      deptLoad[item.department] += item.allocated;
    });

    const utilisation = (allocated / total) * 100;
    const efficiency = 100 - Math.abs(utilisation - 80);

    const values = Object.values(deptLoad);
    const max = Math.max(...values);
    const min = Math.min(...values);

    const imbalance = max - min;
    const risk = Math.min(100, (imbalance / total) * 200);

    const governanceScore =
      (efficiency * 0.4) +
      ((100 - risk) * 0.4) +
      (utilisation * 0.2);

    const prediction = Array.from({ length: 6 }, (_, i) => ({
      name: `T${i + 1}`,
      efficiency: efficiency - i * 1.2,
      utilisation: utilisation - i * 0.5,
      risk: risk + i * 1.5
    }));

    res.json({
      efficiency,
      utilisation,
      risk,
      governanceScore,
      trend: prediction,
      prediction,
      hotspots: Object.entries(deptLoad)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => ({
          name,
          risk: "High"
        }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
});

export default router;