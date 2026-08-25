
import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

/* ========================= */
/* RESET INVENTORY DATABASE */
/* ========================= */

router.post("/reset", async (req, res) => {
  try {
    console.log("========== RESET CALLED ==========");

    await Inventory.deleteMany({});

    const departments = [
      {
        code: "SGAD-RDT",
        owner: "Treasury Manager",
        allocatedTo: "Treasury Operations",
        assets: [
          "Treasury Settlement Engine",
          "Liquidity Monitoring Platform",
          "FX Settlement Gateway",
          "Cash Position Dashboard"
        ]
      },
      {
        code: "SGAD-TRS",
        owner: "Trade Services Manager",
        allocatedTo: "Trade Services",
        assets: [
          "SWIFT Gateway",
          "Trade Finance Engine",
          "Transaction Validation Service",
          "Settlement Scheduler"
        ]
      },
      {
        code: "SGAD-LOA",
        owner: "Loan Operations Manager",
        allocatedTo: "Loan Operations",
        assets: [
          "Loan Processing Portal",
          "Credit Approval Engine",
          "Collateral Repository",
          "Loan Monitoring Dashboard"
        ]
      },
      {
        code: "SGAD-CBS",
        owner: "Corporate Banking Manager",
        allocatedTo: "Corporate Banking",
        assets: [
          "Core Banking Platform",
          "Deposit Management System",
          "Customer Account Service",
          "Interest Calculation Engine"
        ]
      },
      {
        code: "SGAD-OPC",
        owner: "Operations Manager",
        allocatedTo: "Operations Centre",
        assets: [
          "Operations Dashboard",
          "Workflow Engine",
          "Batch Scheduler",
          "Operations Console"
        ]
      },
      {
        code: "GTBD-Client Service",
        owner: "Client Services Manager",
        allocatedTo: "Client Services",
        assets: [
          "Client Relationship Portal",
          "CRM Platform",
          "Customer Dashboard",
          "Case Management System"
        ]
      },
      {
        code: "SGAD-FCD",
        owner: "Financial Controller",
        allocatedTo: "Finance Division",
        assets: [
          "Financial Control Platform",
          "General Ledger Interface",
          "Finance Dashboard",
          "Expense Validation Engine"
        ]
      },
      {
        code: "SGAD-CPC",
        owner: "Compliance Manager",
        allocatedTo: "Compliance Office",
        assets: [
          "Compliance Portal",
          "Policy Repository",
          "Regulatory Dashboard",
          "Exception Register"
        ]
      }
    ];

    const statuses = ["Active", "In Review", "Escalated"];
    const validations = ["Passed", "Pending", "Failed"];
    const risks = ["Low", "Medium", "High"];

    const seedData = [];

    let counter = 1;

    departments.forEach((dept, dIndex) => {
      dept.assets.forEach((asset, aIndex) => {
        seedData.push({
          id: `INV-${String(counter).padStart(3, "0")}`,
          asset,
          department: dept.code,
          owner: dept.owner,
          allocatedTo: dept.allocatedTo,
          status: statuses[(counter + dIndex) % statuses.length],
          validation: validations[(counter + aIndex) % validations.length],
          risk: risks[(counter + dIndex + aIndex) % risks.length],
          governanceScore: 88 + (counter % 10),
          compliance: 92 + (counter % 8),
          riskScore: `${55 + (counter % 40)}%`,
          auditStatus:
            counter % 3 === 0
              ? "Audit Ready"
              : counter % 3 === 1
              ? "Review Required"
              : "Pending Validation",
          decision:
            counter % 3 === 0
              ? "Monitor"
              : counter % 3 === 1
              ? "Review"
              : "Escalate",
          nextAction:
            counter % 3 === 0
              ? "Quarterly Review"
              : counter % 3 === 1
              ? "Department Approval"
              : "Executive Escalation",
          availableBudget: 500000,
          allocatedBudget: 300000 + counter * 2500,
          lastUpdated: new Date()
        });

        counter++;
      });
    });
    console.log(
  seedData.map(item => ({
    asset: item.asset,
    department: item.department,
  }))
);
    const created = await Inventory.insertMany(seedData);

    console.log(`${created.length} enterprise assets inserted.`);

    res.json({
      success: true,
      count: created.length,
      data: created
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Reset failed"
    });
  }
});
/* ========================= */
/* 🔍 GET ALL INVENTORY */
/* ========================= */

router.get("/", async (req, res) => {
  try {

    const items = await Inventory.find().sort({
      department: 1,
      asset: 1
    });

    res.json({
      success: true,
      count: items.length,
      data: items
    });

  } catch (err) {

    console.error("🔥 GET ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory"
    });

  }
});


/* ========================= */
/* ➕ CREATE INVENTORY */
/* ========================= */

router.post("/", async (req, res) => {

  try {

    if (!req.body.asset || !req.body.department) {

      return res.status(400).json({
        success: false,
        message: "Asset and Department are required."
      });

    }

    const item = new Inventory({

      id: `INV-${Date.now()}`,

      asset: req.body.asset,

      department: req.body.department,

      owner: req.body.owner || "Department Manager",

      allocatedTo: req.body.allocatedTo || "Governance Team",

      status: req.body.status || "Active",

      validation: req.body.validation || "Passed",

      risk: req.body.risk || "Low",

      governanceScore: req.body.governanceScore || 95,

      compliance: req.body.compliance || 98,

      riskScore: req.body.riskScore || "15%",

      auditStatus: req.body.auditStatus || "Audit Ready",

      decision: req.body.decision || "Monitor",

      nextAction: req.body.nextAction || "Quarterly Review",

      availableBudget: req.body.availableBudget || 500000,

      allocatedBudget: req.body.allocatedBudget || 250000,

      lastUpdated: new Date()

    });

    await item.save();

    res.status(201).json({

      success: true,

      message: "Inventory created successfully.",

      data: item

    });

  } catch (err) {

    console.error("🔥 CREATE ERROR:", err);

    res.status(500).json({

      success: false,

      message: "Failed to create inventory."

    });

  }

});
/* ========================= */
/* ✏️ UPDATE INVENTORY */
/* ========================= */

router.put("/:id", async (req, res) => {

  try {

    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastUpdated: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {

      return res.status(404).json({
        success: false,
        message: "Inventory record not found."
      });

    }

    res.json({
      success: true,
      message: "Inventory updated successfully.",
      data: updated
    });

  } catch (err) {

    console.error("🔥 UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to update inventory."
    });

  }

});


/* ========================= */
/* ❌ DELETE INVENTORY */
/* ========================= */

router.delete("/:id", async (req, res) => {

  try {

    const deleted = await Inventory.findByIdAndDelete(req.params.id);

    if (!deleted) {

      return res.status(404).json({
        success: false,
        message: "Inventory record not found."
      });

    }

    res.json({
      success: true,
      message: "Inventory deleted successfully."
    });

  } catch (err) {

    console.error("🔥 DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to delete inventory."
    });

  }

});


/* ========================= */
/* 🔍 SEARCH INVENTORY */
/* ========================= */

router.get("/search/:query", async (req, res) => {

  try {

    const query = req.params.query;

    const results = await Inventory.find({

      $or: [

        {
          asset: {
            $regex: query,
            $options: "i"
          }
        },

        {
          department: {
            $regex: query,
            $options: "i"
          }
        },

        {
          owner: {
            $regex: query,
            $options: "i"
          }
        },

        {
          allocatedTo: {
            $regex: query,
            $options: "i"
          }
        }

      ]

    });

    res.json({

      success: true,

      count: results.length,

      data: results

    });

  } catch (err) {

    console.error("🔥 SEARCH ERROR:", err);

    res.status(500).json({

      success: false,

      message: "Search failed."

    });

  }

});


export default router;