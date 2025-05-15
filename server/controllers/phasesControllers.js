const phaseModel = require("../model/PhasesModal");

// Controller functions for other CRUD operations
const getAllPhases = async (req, res) => {
  await phaseModel.getPhases(req, res);
};

const addPhase = async (req, res) => {
  await phaseModel.addPhase(req, res);
};
const getPhaseImpact = async (req, res) => {
  await phaseModel.getPhaseImpact(req, res);
};
const deletePhase = async (req, res) => {
  await phaseModel.deletePhase(req, res);
};
module.exports = {
  getAllPhases,
  addPhase,
  getPhaseImpact,
  deletePhase
};
