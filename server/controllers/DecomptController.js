const DecomptModel  = require('../model/DecomptModel');

const getDetailDecompte = async (req, res) => {
  await DecomptModel.getDetailDecompte(req, res);
};

module.exports = {getDetailDecompte};




