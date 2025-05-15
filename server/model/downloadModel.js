const path = require('path');
const { verifyJWT } = require('../middleware/verifyJWT');

const download = async (req, res, next) => {
  try {
    await verifyJWT(req, res, async () => {
      const fileName = req.body.fileName;
      const filePath = path.join(__dirname, '..', 'uploads', fileName);

      res.download(filePath, (error) => {
        if (error) {
          console.error('Error downloading file:', error);
          res.status(500).json({ error: 'An error occurred while downloading the file' });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  download,
};
