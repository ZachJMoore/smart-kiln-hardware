// bring exposed functions into here before consuming. Makes it easier to track things down.

const { exposedComponentFunctions } = require("passeljs");
const helpers = require("../lib/helpers.js");

module.exports.startFiring = schedule => {
  return exposedComponentFunctions.Kiln.startFiring(schedule);
};
module.exports.startFiringAsync = async schedule => {
  let rt = exposedComponentFunctions.Kiln.startFiring(schedule);
  if (helpers.isError(rt)) return Promise.reject(rt);
  else return rt;
};
module.exports.cancelFiring = () => {
  return exposedComponentFunctions.Kiln.cancelFiring();
};
module.exports.cancelFiringAsync = async () => {
  let rt = exposedComponentFunctions.Kiln.cancelFiring();
  if (helpers.isError(rt)) return Promise.reject(rt);
  else return rt;
};

module.exports.getScheduleById = id => {
  return exposedComponentFunctions.Schedules.getScheduleById(id);
};
