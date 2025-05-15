const marcheModel  = require('../model/marcheModel');

const updateMarche = async (req, res) => {
  await marcheModel.updateMarche(req, res);
};
const addMarche = async (req, res) => {
    await marcheModel.addMarche(req, res);
  };
const getMarche = async (req, res) => {
    await marcheModel.getMarche(req, res);
  };
  const getDetailMarche = async (req, res) => {
    await marcheModel.getDetailMarche(req, res);
  };
  
module.exports = {updateMarche,addMarche,getMarche,getDetailMarche};




