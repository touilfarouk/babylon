const AvenantModel  = require('../model/avenantModel');

const updateAvenant = async (req, res) => {
  await AvenantModel.updateAvenant(req, res);
};
const addAvenant = async (req, res) => {
    await AvenantModel.addAvenant(req, res);
  };
const getAvenant = async (req, res) => {
    await AvenantModel.getAvenant(req, res);
  };
  const getDetailAvenant = async (req, res) => {
    await AvenantModel.getDetailAvenant(req, res);
  };
  
module.exports = {updateAvenant,addAvenant,getAvenant,getDetailAvenant};




