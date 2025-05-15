const odsModel  = require('../model/odsModel');

const listOds = async (req, res) => {
  await odsModel.getOds(req, res);
};


module.exports = {listOds};




