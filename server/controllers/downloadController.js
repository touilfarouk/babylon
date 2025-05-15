const downloadModel = require('../model/downloadModel');
const downloadFile = (req, res) => {
 downloadModel.download(req, res);
};

module.exports = {
    downloadFile
};