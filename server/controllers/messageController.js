const messageModel  = require('../model/messagesModel');

// Controller functions for other CRUD operations
const getAllMessages = async (req, res) => {
  await messageModel.Messages(req, res);  
};
const sendMessages = async (req, res) => {

    await messageModel.Messages(req, res);
};
const DeleteMsg = async(req,res)=>{
  await messageModel.DeleteMsg(req,res)
};
const viewMsgs=async(req,res)=>{
  await messageModel.Views(req, res);
};
const viewMsgsGroupe=async(req,res)=>{
  await messageModel.ViewsGroupe(req, res);
};
const getMsgs=async(req,res)=>{
  await messageModel.getMsgs(req, res);
};
module.exports = {getAllMessages,sendMessages,viewMsgs,viewMsgsGroupe,DeleteMsg,getMsgs};