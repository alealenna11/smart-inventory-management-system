export function checkSLABreach(requestTime, slaHours) {
  const now = new Date();
  const created = new Date(requestTime);
  const hoursElapsed = (now - created) / (1000 * 60 * 60);
  return hoursElapsed > slaHours;
}

export function getSLAHoursRemaining(requestTime, slaHours) {
  const now = new Date();
  const created = new Date(requestTime);
  const deadline = new Date(created.getTime() + slaHours * 60 * 60 * 1000);
  const remainingMs = deadline - now;
  const remainingHours = remainingMs / (1000 * 60 * 60);

  return Number(Math.max(0, remainingHours).toFixed(1));
}