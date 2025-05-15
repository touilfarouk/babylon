const PvReceptionModel  = require('../model/etudeModel');
const PvReceptionModelRealisation  = require('../model/PvReceptionModel'); 

const addPvProv = async (req, res) => {
  await PvReceptionModel.addPvProv(req, res);
};  
const getPvProvesoire = async (req, res) => {
  await PvReceptionModel.getPvProvesoire(req, res);
}; 

const getPvProvesoireDetail = async (req, res) => {
  await PvReceptionModel.getPvProvesoireDetail(req, res);
}; 
const UpdatePvProvesoire = async (req, res) => {
  await PvReceptionModel.UpdatePvProvesoire(req, res);
}; 

const getActionPv = async (req, res) => {

  await PvReceptionModelRealisation.getActionPv(req, res);
}; 
module.exports = {addPvProv,getPvProvesoire,getPvProvesoireDetail,UpdatePvProvesoire,getActionPv};




