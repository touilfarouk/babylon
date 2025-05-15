const etudeModel  = require('../model/etudeModel');

const updateEtude = async (req, res) => {
  await etudeModel.updateEtude(req, res);
};
const getEtude = async (req, res) => {
  await etudeModel.getEtude(req, res);
};          
const addPvProv = async (req, res) => {
  await etudeModel.addPvProv(req, res);
};  

const getPvProvesoire = async (req, res) => {
  await etudeModel.getPvProvesoire(req, res);
}; 

const getPvProvesoireDetail = async (req, res) => {
  await etudeModel.getPvProvesoireDetail(req, res);
}; 

const UpdatePvProvesoire = async (req, res) => {
  await etudeModel.UpdatePvProvesoire(req, res);
};

const getEtudePaiment = async (req, res) => {
  await etudeModel.getEtudePaiment(req, res);              
};

const addSituation = async (req, res) => {
  await etudeModel.addSituation(req, res);              
};

const getDetailDecompte = async (req, res) => {
  await etudeModel.getDetailDecompte(req, res);              
};

const getSituation = async (req, res) => {
  await etudeModel.getSituation(req, res);              
};
const setsituationEtude = async (req, res) => {
  await etudeModel.setsituationEtude(req, res);              
};

const setInfSituation = async (req, res) => {
  await etudeModel.setInfSituation(req, res);              
};

const getSituationDetail = async (req, res) => {
  await etudeModel.getSituationDetail(req, res);              
};
module.exports = {getSituationDetail,setInfSituation,setsituationEtude,getSituation,updateEtude,getEtude,addPvProv,getPvProvesoire,getPvProvesoireDetail,UpdatePvProvesoire,addSituation,getDetailDecompte,getEtudePaiment};




