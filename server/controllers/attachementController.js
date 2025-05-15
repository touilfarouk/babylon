const attachementModel = require("../model/AttachementModel");

// Controller functions for other CRUD operations
const getlistAttachement = async (req, res) => {
  await attachementModel.getPosts(req, res);
};
const getlistTache = async (req, res) => {
  await attachementModel.getTacheList(req, res);
};
const addAttachement = async (req, res) => {
  await attachementModel.addAttachement(req, res);
};
const valideAttachement = async (req, res) => {
  await attachementModel.valideAttachement(req, res);
};
const updateAttachement = async (req, res) => {
  await attachementModel.updateAttachement(req, res);
};
const getAttachementDetails = async (req, res) => {
  await attachementModel.getAttachementDetails(req, res);
};
const getRealisationList = async (req, res) => {
  await attachementModel.getRealisationList(req, res);
}; 
const DeleteAttachement = async (req, res) => {
  await attachementModel.DeleteAttachement(req, res);
};

module.exports = {
  getlistAttachement,
  getlistTache,
  addAttachement,
  valideAttachement,
  updateAttachement,
  getAttachementDetails,
  getRealisationList,
  DeleteAttachement,
};
