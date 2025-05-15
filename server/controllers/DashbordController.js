const DashboardModel = require("../model/DashbordModel");

const GetMarcher = async (req, res) => {
  await DashboardModel.getMarcher(req, res);
};
const realisationBarCharts = async (req, res) => {
  await DashboardModel.realisationBarCharts(req, res);
};
const realiationBarChartAct = async (req, res) => {
  await DashboardModel.realiationBarChartAct(req, res);
};
const detailImpact = async (req, res) => {
  await DashboardModel.detailImpact(req, res);
};
const cardData = async (req, res) => {
  await DashboardModel.cardData(req, res);
};
const cardPrecCons = async (req, res) => {
  await DashboardModel.cardPrecCons(req, res);
};
const getCommune = async (req, res) => {
  await DashboardModel.getCommune(req, res);
};
const getLieuDit = async (req, res) => {
  await DashboardModel.getLieuDit(req, res);
};   

const DoughnutChartData = async (req, res) => {
  await DashboardModel.DoughnutChartData(req, res);
}; 
const realiationBarChartwilaya = async (req, res) => {
  await DashboardModel.realiationBarChartwilaya(req, res);
};    

const getPathGeo = async (req, res) => {
  await DashboardModel.getPathGeo(req, res);
}; 

const DoughnutChartDataProg = async (req, res) => {
  await DashboardModel.DoughnutChartDataProg(req, res);
}; 

const PlanAction = async (req, res) => {
  await DashboardModel.PlanAction(req, res);
}; 
module.exports = {
  GetMarcher,getPathGeo,PlanAction,
  getCommune,
  getLieuDit,
  realisationBarCharts,
  realiationBarChartAct,
  detailImpact,
  cardData,cardPrecCons,
  DoughnutChartData,
  realiationBarChartwilaya,
  DoughnutChartDataProg,
};
