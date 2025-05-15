const asfModel = require("../model/AsfModel");

const addAsf = async (req, res) => {

  await asfModel.addAsf(req, res);
};
const getasf = async (req, res) => {

  await asfModel.getasf(req, res);
};  
const setAsf = async (req, res) => {

  await asfModel.setAsf(req, res);
};
const getDetailAsf = async (req, res) => {

  await asfModel.getDetailAsf(req, res);
}; 
const setsituation = async (req, res) => {

  await asfModel.setsituation(req, res);
}; 
const getSituation = async (req, res) => {

  await asfModel.getSituation(req, res);
}; 

const setInfSituation = async (req, res) => {

  await asfModel.setInfSituation(req, res);
}; 
module.exports={addAsf,getasf,setAsf,getDetailAsf,setsituation,getSituation,setInfSituation}