export const host = "http://localhost:5000";
//export const host = "http://213.179.181.50:5000";
/*************************chat************************************************/
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const viewMsg = `${host}/api/views`;
export const viewMsgGroupe = `${host}/api/viewsGroupe`;
export const updatePassWord = `${host}/api/changePass/updatepassword`;
export const getGroups = `${host}/api/getallgroupes`;
export const addGroup = `${host}/api/addgroupe`;
export const deleteGroup = `${host}/api/deletegroupe`;
export const updateGroup = `${host}/api/updategroupe`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const DeleteMsg = `${host}/api/deletemsgs`;
export const getAllMessageRoute = `${host}/api/messages/getmsg`;
export const getAllMessages = `${host}/api/getmsgs`;
export const uploadFile = `${host}/api/uploadfile/addfile`;
export const download = `${host}/api/messages/download`;
/*************************************************user******************************************/
export const getusers = `${host}/api/getusers`;
export const allUsersRoutes = `${host}/api/allusers`;
export const AddNewUser = `${host}/api/adduser`;
export const getUserInf = `${host}/api/getuserinf`;
export const updateUser = `${host}/api/updateuser`;
export const deleteUser = `${host}/api/deleteuser`;
/************************************************phase******************************************/
export const allPhases = `${host}/api/allPhases`;
export const AddPhase = `${host}/api/AddPhase`;
export const getPhases = `${host}/api/getphase`;
export const DeletePhases = `${host}/api/deletephase`;
/****************************action_programme/action_impactée************************************/
export const getAllActionImpact = `${host}/api/getactionimpact`;
export const getDetailActionImpact = `${host}/api/getdetailaction`;
export const getActionProgramme = `${host}/api/getaction`;
export const getActionCpt = `${host}/api/getactioncpt`;
export const getCpt = `${host}/api/getcpt`;
export const updateCpt = `${host}/api/updatecpt`;
export const DeleteCpt = `${host}/api/deletecpt`;
export const getActionMarche = `${host}/api/getactionmarche`;
export const addActionProgramme = `${host}/api/addactionprogramme`;
export const addActionMarche = `${host}/api/addactionmarche`;
export const DeleteActionMarche = `${host}/api/deleteactionmarche`;
export const DeleteActionImpct = `${host}/api/deleteactionimpact`;
export const getWilaya = `${host}/api/getlistwilaya`;
export const getWilayaFiltter = `${host}/api/getlistwilayafillter`;
export const getCommune = `${host}/api/getlistcommune`;
export const getCommuneFiltter = `${host}/api/getlistcommunefillter`;
export const getLocaliteFiltter = `${host}/api/getlistlocalite`;
export const getAction = `${host}/api/getaction`;
export const getActionFillter = `${host}/api/getactionfillter`;
export const getEntreprise = `${host}/api/getlistentreprise`;
export const getComposante = `${host}/api/getcomposante`;
export const getComposanteDict = `${host}/api/getcomposantedict`;
export const addComposante = `${host}/api/addcomposante`;
export const addActImpct = `${host}/api/addactionimpacte`;
export const updateActImpct = `${host}/api/updateactionimpacte`;
export const uploadGeoJson = `${host}/api/uploadgeojeson`;
export const readGeoJson = `${host}/api/readgeojson`;
/****************************************TACHE************************************/
export const GetTache = `${host}/api/gettache`;
export const AddTask = `${host}/api/add_tache`;
export const editTask = `${host}/api/update_tache`;
export const getListTach = `${host}/api/getlisttache`;
export const getDetailTach = `${host}/api/getdetailtache`;
/************************ attachement *************************************** */
export const listAttachement = `${host}/api/listAttachement`;
export const listTache = `${host}/api/listTache`;
export const addAttachement = `${host}/api/addAttachement`;
export const ValideAttachement = `${host}/api/valideAttachement`;
export const updateAttachement = `${host}/api/updateAttachement`;
export const getAttachementDetails = `${host}/api/getAttachementDetails`;
export const getRealisationList = `${host}/api/getRealisationList`;
export const DeleteAttachement = `${host}/api/deleteAttachement`;
export const uploadAttFile = `${host}/api/uploadAttFile`;
export const ReadAttFile = `${host}/api/ReadAttFile`;
/************************asf********************************* */
export const AddASF= `${host}/api/addasf`;          
export const GetASF= `${host}/api/getallasfs`;     
export const SetASF= `${host}/api/setasf`;       
export const GetDetailASF = `${host}/api/getDetailasf`;
export const SetDetailSituation = `${host}/api/setsituation`;  
export const getSituation = `${host}/api/getsituation`;      
export const setInfSituation = `${host}/api/setInfSituation`; 
/***********************decompt***************************** */
export const GetDetailDecompt = `${host}/api/getdetaildecompt`;
/*****************************************realisation*****************************************/
export const allRealisations = `${host}/api/allRealisations`;
export const addRealisation = `${host}/api/addRealisation`;
export const getRealisationsDet = `${host}/api/getrealisationsdet`;
export const updateRealisation = `${host}/api/updaterealisation`;
export const getRealisationinf = `${host}/api/getrealisationinf`;
export const getRealisationsJournal = `${host}/api/getrealisationsjournal`;
export const deleteRealisation = `${host}/api/deleterealisation`;
export const uploadImageRealisation = `${host}/api/uploadimage`;   
export const readImage = `${host}/api/readImage`;  
/*************************************************ods*****************************************/
export const getListOds = `${host}/api/getlistods`;
/***************************************etude + pv etude ************************************ */      
export const updateEtude = `${host}/api/setetude`;   
export const getEtude = `${host}/api/getEtude`; 
export const addPvProvetude = `${host}/api/addPvProvetude`;  
export const getPvProvesoire = `${host}/api/getPvProvesoire`; 
export const getPvProvesoireDetail = `${host}/api/getPvProvesoireDetail`;        
export const UpdatePvProvesoire = `${host}/api/UpdatePvProvesoire`;    
export const getEtudePaiment = `${host}/api/getEtudePaiment`;   
export const addSituation = `${host}/api/addSituation`;   
export const getDetailDecompte = `${host}/api/getDetailDecompte`;   
export const getSituationEtude = `${host}/api/getSituationE`;         
export const setsituationEtude = `${host}/api/setsituationEtude`;  
export const setInfSituationE = `${host}/api/setInfSituationE`;         
export const getSituationDetail = `${host}/api/getSituationDetail`;     
/*********************************marche*****************************************/
export const updateMarche = `${host}/api/setmarche`;
export const addMarche = `${host}/api/addmarche`;
export const getMarche = `${host}/api/getmarche`;
export const getDetMarche = `${host}/api/getdetailmarche`;     
export const uploadPdf = `${host}/api/uploadPdf`;  
export const ReadPdf = `${host}/api/ReadPdf`; 
/*********************************avenant*****************************************/
export const updateAvenant = `${host}/api/setavenant`;
export const addAvenant = `${host}/api/addavenant`;
export const GetAvenant = `${host}/api/getavenant`;
export const getDetAvenant = `${host}/api/getdetailavenant`;
/*********************************entreprise*************************************/
export const getEntrepriseRealisation = `${host}/api/getentreprise`;
export const getEntrepriseDetail = `${host}/api/getentreprisedetail`;
export const AddEntreprise = `${host}/api/addentreprise`;
export const AddSoutraitant = `${host}/api/addsoustraitant`;
/*****************************dashbord*************************************/
export const Barcharts = `${host}/api/barcharts`;
export const BarchartAct = `${host}/api/doughnuts`;
export const Sou_traitance = `${host}/api/cardData`;
export const cardPrecCons = `${host}/api/cardPrecCons`;
export const GetMarches = `${host}/api/getMarches`;
export const GetCommune = `${host}/api/getCommune`;
export const getLieuDit = `${host}/api/getLieuDit`;
export const PieCharte = `${host}/api/detailImpact`;   
export const DoughnutChartData = `${host}/api/DoughnutChartData`;  
export const realiationBarChartwilaya = `${host}/api/realiationBarChartwilaya`;     
export const getPathGeo = `${host}/api/getPathGeo`;   
export const DoughnutChartDataProg = `${host}/api/DoughnutChartDataProg`;    
export const PlanAction = `${host}/api/PlanAction`;   
/************************programme*************************** */
export const getAllProgramme = `${host}/api/allprogrammes`;
export const addProgramme = `${host}/api/addprogramme`;
/************************pv reception pour les realisation**********************/
export const getActionPv = `${host}/api/getActionPv`;
