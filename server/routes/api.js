const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");
const messageController = require("../controllers/messageController");
const uploadFileController = require("../controllers/uploadController");
const downloadFileController = require("../controllers/downloadController");
const actionPragrammeController = require("../controllers/actionProgrammeController");
const phasesControllers = require("../controllers/phasesControllers");
const tacheController = require("../controllers/tacheController");
const attachementController = require("../controllers/attachementController");
const asfController = require("../controllers/AsfController");
const realisationController = require("../controllers/realisationController");
const odsController = require("../controllers/odsController");
const etudeController = require("../controllers/etudeController");
const marcheController = require("../controllers/marcheController");
const avenantController = require("../controllers/AvenantController");
const entrepriseController = require("../controllers/entrepriseController");
const dashboardController = require("../controllers/DashbordController");
const programmeController = require("../controllers/programmeController");
const decomptController = require("../controllers/DecomptController");              
const pvReceptionController = require("../controllers/pvReceptionController"); 
router.post("/login", authController.handleLogin);
router.post("/allusers", usersController.getAllUsers);
router.post("/adduser", usersController.addUser);
router.post("/updateuser", usersController.updateUser);
router.post("/getuserinf", usersController.getUserinf);
router.post("/deleteuser", usersController.deleteUser);
router.post("/updatepassword", authController.updatePassWord);
router.post("/getallgroupes", usersController.getGroups);
router.post("/addgroupe", usersController.addGroup);
router.post("/deletegroupe", usersController.deletegroupe);
router.post("/updategroupe", usersController.updateGroupe);
router.post("/getmsg", messageController.getAllMessages);
router.post("/addmsg", messageController.sendMessages);
router.post("/deletemsgs", messageController.DeleteMsg);
router.post("/addfile/:from/:to/:id_groupe", uploadFileController.uploadFile);
router.post("/addfile/:from/:to", uploadFileController.uploadFile);
router.post("/download", downloadFileController.downloadFile);
router.post("/views", messageController.viewMsgs);
router.post("/viewsGroupe", messageController.viewMsgsGroupe);
router.post("/getmsgs", messageController.getMsgs);
/********************************action_programme/Impact*********************************************/
router.post("/getactionimpact", actionPragrammeController.getActionImpact);
router.post(
  "/addactionprogramme",
  actionPragrammeController.addActionProgramme
);
router.post("/addactionmarche", actionPragrammeController.addActionMarche);
router.post("/getdetailaction", actionPragrammeController.getDetailAction);
router.post("/getlistwilaya", actionPragrammeController.getListWilaya);
router.post(
  "/getlistwilayafillter",
  actionPragrammeController.getListWilayaFillter
);
router.post("/getlistcommune", actionPragrammeController.getListCommune);
router.post(
  "/getlistlocalite",
  actionPragrammeController.getListLocaliteFillter
);
router.post(
  "/getlistcommunefillter",
  actionPragrammeController.getListCommuneFillter
);
router.post("/getlistentreprise", actionPragrammeController.getListEntreReal);
router.post("/addactionimpacte", actionPragrammeController.addActionImp);
router.post("/getaction", actionPragrammeController.getListAction);
router.post(
  "/deleteactionmarche",
  actionPragrammeController.deleteActionMarche
);
router.post("/deleteactionimpact", actionPragrammeController.deleteActionImpct);
router.post("/getactionmarche", actionPragrammeController.getListActionMarche);
router.post(
  "/getactionfillter",
  actionPragrammeController.getListActionProgFillter
);
router.post("/getcomposante", actionPragrammeController.getListComposant);
router.post("/addcomposante", actionPragrammeController.addComposante);
router.post(
  "/getcomposantedict",
  actionPragrammeController.getDictionnaireComposant
);
router.post("/getactioncpt", actionPragrammeController.getActionImpactCpt);
router.post("/getcpt", actionPragrammeController.getCpt);
router.post("/updatecpt", actionPragrammeController.updateCpt);
router.post("/deletecpt", actionPragrammeController.DeleteCpt);
router.post(
  "/updateactionimpacte",
  actionPragrammeController.updateActionImpact
);
router.post("/uploadgeojeson/:id", uploadFileController.uploadFileGeson);
router.post("/readgeojson", uploadFileController.ReadGeoJson);
/***********************************************phases***************************************************/
router.post("/allPhases", phasesControllers.getAllPhases);
router.post("/AddPhase", phasesControllers.addPhase);
router.post("/getphase", phasesControllers.getPhaseImpact);
router.post("/deletephase", phasesControllers.deletePhase);
/**********************************************Attachement*********************************************/
router.post("/listAttachement", attachementController.getlistAttachement);
router.post("/listTache", attachementController.getlistTache);
router.post("/addAttachement", attachementController.addAttachement);
router.post("/valideAttachement", attachementController.valideAttachement);
router.post("/updateAttachement", attachementController.updateAttachement);
router.post("/deleteAttachement", attachementController.DeleteAttachement);
router.post(
  "/getAttachementDetails",
  attachementController.getAttachementDetails
);
router.post("/getRealisationList", attachementController.getRealisationList);
router.post("/uploadAttFile/:idatt",uploadFileController.uploadAttFile);   
router.post("/ReadAttFile",uploadFileController.ReadAttFile);
/********************************ASF*****************************/                
router.post("/addasf",asfController.addAsf);           
router.post("/setasf",asfController.setAsf);   
router.post("/getallasfs",asfController.getasf);
router.post("/getDetailasf",asfController.getDetailAsf);
router.post("/setsituation",asfController.setsituation);  
router.post("/getsituation",asfController.getSituation);  
router.post("/setInfSituation",asfController.setInfSituation);  


/****************************************Decompt************************* */

router.post("/getdetaildecompt", decomptController.getDetailDecompte);
/*****************************************Taches**************************/
router.post("/add_tache", tacheController.addTask);
router.post("/update_tache", tacheController.updateTache);
router.post("/gettache", tacheController.getTache);
router.post("/getlisttache", tacheController.getTacheList);
router.post("/getdetailtache", tacheController.getDetailTache);
/**************************************realisation**************************/
router.post(
  "/allRealisations/:id_action_impactee",
  realisationController.getAllRealisations
);
router.post("/addRealisation/:id_tache", realisationController.addRealisation);
router.post(
  "/updaterealisation/:id_realisation",
  realisationController.updateRealisation
);
router.post("/getrealisationsdet", realisationController.getRealisationsDet);
router.post(
  "/getrealisationsjournal",
  realisationController.getRealisationJournal
);
router.post(
  "/uploadimage/:id_realisation",
  uploadFileController.uploadsRealisation
);
router.post(
  "/readImage",
  uploadFileController.readImage
);
router.post(
  "/uploadimage/:id_realisation",
  uploadFileController.uploadsRealisation
);
/**************************************ods************************************* */
router.post("/getlistods", odsController.listOds);

/************************etude*******************************************/
router.post("/setetude", etudeController.updateEtude);
router.post("/getEtude", etudeController.getEtude);  
router.post("/addPvProvetude", etudeController.addPvProv);
router.post("/getPvProvesoire", etudeController.getPvProvesoire);      
router.post("/getPvProvesoireDetail", etudeController.getPvProvesoireDetail);   
router.post("/UpdatePvProvesoire", etudeController.UpdatePvProvesoire);   
router.post("/getEtudePaiment", etudeController.getEtudePaiment); 
router.post("/addSituation", etudeController.addSituation); 
router.post("/getDetailDecompte", etudeController.getDetailDecompte); 
router.post("/getSituationE", etudeController.getSituation);          
router.post("/setsituationEtude", etudeController.setsituationEtude);  
router.post("/setInfSituationE", etudeController.setInfSituation);       
router.post("/getSituationDetail", etudeController.getSituationDetail);     
/****************************marche*****************************/

router.post("/setmarche", marcheController.updateMarche);
router.post("/addmarche", marcheController.addMarche);
router.post("/getmarche", marcheController.getMarche);
router.post("/getdetailmarche", marcheController.getDetailMarche);
router.post("/uploadPdf/:id/:idmarche",uploadFileController.uploadPdf);   
router.post("/ReadPdf",uploadFileController.ReadPdf);

//********************************avenant********************************** */

router.post("/setavenant", avenantController.updateAvenant);
router.post("/addavenant", avenantController.addAvenant);
router.post("/getavenant", avenantController.getAvenant);
router.post("/getdetailavenant", avenantController.getDetailAvenant);

/**********************************entreprise***************************** */
router.post("/getentreprise", entrepriseController.getEntreprise);
router.post("/addentreprise", entrepriseController.addEntreprise);
router.post("/getentreprisedetail", entrepriseController.detailEntreprise);
router.post("/addsoustraitant", entrepriseController.insertSousTraitance);
/* **************************Dashbord************************************ */
router.post("/barcharts", dashboardController.realisationBarCharts);
router.post("/doughnuts", dashboardController.realiationBarChartAct);
router.post("/detailImpact", dashboardController.detailImpact);
router.post("/cardData", dashboardController.cardData);
router.post("/getMarches", dashboardController.GetMarcher);
router.post("/getCommune", dashboardController.getCommune);
router.post("/getLieuDit", dashboardController.getLieuDit);  
router.post("/DoughnutChartData", dashboardController.DoughnutChartData);   
router.post("/realiationBarChartwilaya", dashboardController.realiationBarChartwilaya); 
router.post("/cardPrecCons", dashboardController.cardPrecCons);         
router.post("/getPathGeo", dashboardController.getPathGeo);     
router.post("/DoughnutChartDataProg", dashboardController.DoughnutChartDataProg);  
router.post("/PlanAction", dashboardController.PlanAction); 
/****************************programme********************************* */
router.post("/allprogrammes", programmeController.getProgramme);
router.post("/addprogramme", programmeController.addProgramme);
/*******************************pv reception************************************** */    
router.post("/addprogramme", pvReceptionController.addPvProv);
router.post("/getActionPv", pvReceptionController.getActionPv);
module.exports = router;