const userModel  = require('../model/UsersModel');

// Controller functions for other CRUD operations
const getAllUsers = async (req, res) => {
  await userModel.getPosts(req, res);
};
const getUserinf= async(req,res)=>{
  await userModel.getUserinf(req,res)
}
const addUser = async (req, res) => {
  await userModel.addUser(req, res);
};
const updateUser=async(req,res)=>{
  await userModel.updateUser(req, res);
}
const deleteUser=async(req,res)=>{
  await userModel.deleteUser(req, res);
}
const getGroups=async(req,res)=>{
  await userModel.getGroups(req, res);
}
const addGroup=async(req,res)=>{
  await userModel.addGroup(req, res);
}
const deletegroupe=async(req,res)=>{
  await userModel.deletegroupe(req, res);
}
const updateGroupe=async(req,res)=>{
  await userModel.updateGroupe(req, res);
}

module.exports = {getAllUsers,getUserinf,addUser,updateUser,deleteUser,getGroups,addGroup ,deletegroupe,updateGroupe};




