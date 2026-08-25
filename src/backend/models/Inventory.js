import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
{
  id: String,

  asset: String,

  department: String,

  owner: String,

  allocatedTo: String,

  status: String,

  validation: String,

  risk: String,

  governanceScore: Number,

  compliance: Number,

  riskScore: String,

  auditStatus: String,

  decision: String,

  nextAction: String,

  availableBudget: Number,

  allocatedBudget: Number,

  lastUpdated: Date
},
{
  timestamps: true
}
);

export default mongoose.model("Inventory", inventorySchema);