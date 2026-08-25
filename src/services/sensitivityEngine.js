export default function runSimulation(demand){

  let fairness = 0.9 - demand * 0.003;

  if(fairness < 0) fairness = 0;

  let risk = "Low";

  if(demand > 60) risk = "High";
  else if(demand > 30) risk = "Medium";

  let recommendation = "Allocation within acceptable governance threshold";

  if(risk === "Medium"){
    recommendation = "Monitor allocation fairness across departments";
  }

  if(risk === "High"){
    recommendation = "Trigger governance escalation for resource redistribution";
  }

  const manualTime = 60;
  const automatedTime = 18;

  const timeReduction =
  ((manualTime - automatedTime)/manualTime * 100).toFixed(1);

  return {

    fairness: fairness.toFixed(2),

    risk,

    recommendation,

    manualTime,

    automatedTime,

    timeReduction

  }

}