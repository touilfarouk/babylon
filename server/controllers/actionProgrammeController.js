const actionProgrammeModel  = require('../model/actionPragrammeModel');

const getDetailAction = async (req, res) => {
  await actionProgrammeModel.getDetailAction(req, res);
};
const getActionImpact = async (req, res) => {
  await actionProgrammeModel.getActionImpact(req, res);
};
const addActionMarche = async (req, res) => {
  await actionProgrammeModel.addActionMarche(req, res);  
};
const deleteActionMarche = async (req, res) => {
  await actionProgrammeModel.deleteActionMarche(req, res);  
};  
const deleteActionImpct = async (req, res) => {
  await actionProgrammeModel.deleteActionImpct(req, res);  
};
const addActionProgramme = async (req, res) => {
  await actionProgrammeModel.addActionProgramme(req, res);
};
const getListWilaya = async (req, res) => {
  await actionProgrammeModel.getListWilaya(req, res);
};
const getListCommune = async (req, res) => {

  await actionProgrammeModel.getListCommune(req, res);
};
const getListEntreReal = async (req, res) => {
  await actionProgrammeModel.getListEntreReal(req, res);
};
const addActionImp = async (req, res) => {
  await actionProgrammeModel.addActionImpact(req, res);
};
const updateActionImpact = async (req, res) => {
  await actionProgrammeModel.updateActionImpact(req, res);
};
const getListAction= async (req, res) => {
  await actionProgrammeModel.getListAction(req, res);
};  
const getListActionMarche = async (req, res) => {
  await actionProgrammeModel.getListActionMarche(req, res);
};
const getListActionProg = async (req, res) => {
  await actionProgrammeModel.getListActionProg(req, res);
};
const getListComposant = async (req, res) => {
  await actionProgrammeModel.getListComposant(req, res);
};
const getDictionnaireComposant = async (req, res) => {
  await actionProgrammeModel.getDictionnaireComposant(req, res);
};
const addComposante = async (req, res) => {
  await actionProgrammeModel.addComposante(req, res);
};
const getListWilayaFillter = async (req, res) => {       
  await actionProgrammeModel.getListWilayaFillter(req, res);            
};
const getListCommuneFillter = async (req, res) => {
  await actionProgrammeModel.getListCommuneFillter(req, res);
};
const getListActionProgFillter = async (req, res) => {
  await actionProgrammeModel.getListActionProgFillter(req, res);
};
const getListLocaliteFillter = async (req, res) => {
  await actionProgrammeModel.getListLocaliteFillter(req, res);
};
const getActionImpactCpt = async (req, res) => {
  await actionProgrammeModel.getActionImpactCpt(req, res);
};   
const getCpt = async (req, res) => {
  await actionProgrammeModel.getCpt(req, res);
};  
const updateCpt = async (req, res) => {
  await actionProgrammeModel.updateCpt(req, res);
}; 
const DeleteCpt = async (req, res) => {
  await actionProgrammeModel.DeleteCpt(req, res);
}; 

module.exports = {DeleteCpt,getCpt,updateCpt,getActionImpactCpt,deleteActionImpct,deleteActionMarche,getListActionMarche,
  addActionMarche,getListWilayaFillter,getListAction,getListCommuneFillter,getListLocaliteFillter,getListActionProgFillter,getListComposant,
  getDetailAction,getActionImpact,addActionProgramme,getListWilaya,getListCommune,getListEntreReal,addActionImp,
  updateActionImpact,getListActionProg,getDictionnaireComposant,addComposante};