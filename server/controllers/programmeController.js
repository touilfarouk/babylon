const programmeModel = require("../model/ProgrammeModel");

const getProgramme = async (req, res) => {
  await programmeModel.getProgramme(req, res);
};
const addProgramme = async (req, res) => {
    await programmeModel.addProgramme(req, res);
  };
module.exports = {
    getProgramme,
    addProgramme
  };
  