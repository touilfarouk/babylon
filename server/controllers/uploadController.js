const uploadsModel = require('../model/uploadsModel');
const uploadJeson=require('../model/uploadJesonModel.js')  
const uploadImage=require('../model/uploadRealisation.js')
const uploadMarcheFilesModel=require('../model/uploadMarcheFilesModel.js')
const uploadAttachementFilesModel =require('../model/uploadAttachementFilesModel .js')
const uploadFile = (req, res) => {
  uploadsModel.uploads(req, res); 
};
const uploadFileGeson = (req, res) => {
  uploadJeson.uploadJeson(req, res);
};
const ReadGeoJson = (req, res) => {
  uploadJeson.ReadGeoJson(req, res);
};
const uploadsRealisation = (req, res) => {
  uploadImage.uploadsRealisation(req, res);
};          
const readImage = (req, res) => {
  uploadImage.readImage(req, res);
}; 
const uploadPdf = (req, res) => {
  uploadMarcheFilesModel.uploadPdf(req, res);  
};   
const ReadPdf = (req, res) => {
  uploadMarcheFilesModel.ReadPdf(req, res);  
};
const uploadAttFile = (req, res) => {
  uploadAttachementFilesModel.uploadPdf(req, res);  
};   
const ReadAttFile = (req, res) => {
  uploadAttachementFilesModel.ReadPdf(req, res);  
};
module.exports = {
  uploadAttFile,ReadAttFile,uploadFile,uploadFileGeson,ReadGeoJson ,uploadsRealisation,readImage,uploadPdf,ReadPdf    
};