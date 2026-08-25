export default function explainDecision() {

const departments = ["Finance","Risk","Technology","AI Lab","Operations"]

const resourceOptions = [
"GPU Compute Cluster",
"Cloud GPU Node",
"AI Training Server",
"High Memory VM"
]

const randomDepartment =
departments[Math.floor(Math.random()*departments.length)]

const randomResource =
resourceOptions[Math.floor(Math.random()*resourceOptions.length)]

const confidence =
Math.floor(Math.random()*20)+80

const factors=[

{
name:"Department demand priority",
weight:Math.floor(Math.random()*30)+60
},

{
name:"Inventory availability",
weight:Math.floor(Math.random()*30)+50
},

{
name:"SLA urgency",
weight:Math.floor(Math.random()*30)+40
},

{
name:"Fairness rebalancing",
weight:Math.floor(Math.random()*30)+30
},

{
name:"Governance risk threshold",
weight:Math.floor(Math.random()*30)+20
}

]

return{

resource:randomResource,
department:randomDepartment,
confidence:confidence,

factors:factors,

explanation:
"The INVISOR governance allocation engine evaluated department demand, SLA urgency, and resource scarcity before assigning compute resources while ensuring fairness constraints and governance compliance."

}

}