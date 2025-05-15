const EntrepriseModel  = require('../model/entrepriseModel');

const getEntreprise = async (req, res) => {
    await EntrepriseModel.getEntreprise(req, res);
  };
  const addEntreprise = async (req, res) => {
    await EntrepriseModel.addEntreprise(req, res);
  };
  const detailEntreprise = async (req, res) => {
    await EntrepriseModel.detailEntreprise(req, res);
  };
  const insertSousTraitance = async (req, res) => {
    await EntrepriseModel.insertSousTraitance(req, res);
  };
module.exports = {getEntreprise,detailEntreprise,insertSousTraitance,addEntreprise};




