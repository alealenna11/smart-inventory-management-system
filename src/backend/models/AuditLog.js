

import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
{
userEmail: String,


userRole: String,

department: String,

action: String,

entityType: String,

entityId: String,

decisionOutcome: String,

explanation: String,

ip: String,

timestamp: {
  type: Date,
  default: Date.now,
},


}
);

export default mongoose.model("AuditLog", auditSchema);
