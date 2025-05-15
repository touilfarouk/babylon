const realisationModel = require("../model/RealisationsModel");

// Controller functions for other CRUD operations
const getAllRealisations = async (req, res) => {
  await realisationModel.getRealisations(req, res);
};

const getRealisationsDet = async (req, res) => {
  await realisationModel.getRealisationsDet(req, res);
};
const getRealisationJournal = async (req, res) => {
  await realisationModel.getRealisationJournal(req, res);
};
const addRealisation = async (req, res) => {
  await realisationModel.addRealisation(req, res);
};


const updateRealisation = async (req, res) => {
  await realisationModel.updateRealisation(req, res);
};


module.exports = {
  getAllRealisations,
  addRealisation,
  updateRealisation,
  getRealisationsDet,
  getRealisationJournal
};
