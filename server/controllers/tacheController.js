const tacheModel  = require('../model/tacheModel');

const addTask = async (req, res) => {
  await tacheModel.addTache(req, res);
};
const updateTache = async (req,res)=>{
  await tacheModel.updateTache(req,res);
}
const getTache = async (req,res)=>{
  await tacheModel.getTache(req,res);
}

const getTacheList = async (req,res)=>{
  await tacheModel.getTacheList(req,res);
}   
const getDetailTache = async (req,res)=>{
  await tacheModel.getDetailTache(req,res);
} 
module.exports = {addTask,updateTache,getTache,getTacheList,getDetailTache};




