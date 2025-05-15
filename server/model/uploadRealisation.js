const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const isAllowedExtension = (fileExtension) => {
  const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg', 'ico'];
  return allowedImageExtensions.includes(fileExtension.toLowerCase());
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'ImageRealisation/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalFilename = file.originalname;
    const extensionIndex = originalFilename.lastIndexOf('.');
    if (extensionIndex !== -1) {
      const fileName = originalFilename.substring(0, extensionIndex);
      const fileExtension = originalFilename.substr(extensionIndex + 1);
      if (!isAllowedExtension(fileExtension)) {
        return cb(new Error('Invalid file extension'));
      }
      const filenameWithSuffix = fileName + '-' + uniqueSuffix + '.' + fileExtension;
      cb(null, filenameWithSuffix);
    } else {
      cb(new Error('File extension missing'));
    }
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB file size limit
});

const uploadsRealisation = async (req, res) => {
  try {
    verifyJWT(req, res, () => {
      upload.single('file')(req, res, async (error) => {
        if (error) {
          if (error.message === 'Invalid file extension') {
            return res.status(400).json({ error: 'Invalid file extension' });
          } else {
            return res.status(500).json({ error: 'File upload failed', details: error.message });
          }
        }
        
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileContent = req.file.filename;
        const id_realisation = req.params.id_realisation;
        const query = 'UPDATE `bv_realisation` SET `image`=? WHERE id_realisation= ?';
        const values = [fileContent, id_realisation];

        try {
          const [uploadImage] = await db.promise().query(query, values);
          if (uploadImage.affectedRows === 1) {
            res.json("true");
          } else {
            res.status(500).json("error");
          }
        } catch (dbError) {
          res.status(500).json({ error: 'Database query failed', details: dbError.message });
        }
      });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid JWT', details: error.message });
  }
};

const readImage = async (req, res) => {
  const readImageFile = async (filePath) => {
    try {
      const data = await fs.readFile(filePath);
      return data;
    } catch (error) {
      console.error('Error reading image file:', error);
      throw error;
    }
  };

  try {
    verifyJWT(req, res, async () => {
      const namefile = req.body.namefile;
      if (namefile) {
        const filePath = path.join(__dirname, '..', 'ImageRealisation', namefile);

        try {
          // Check if the file exists
          const imageData = await readImageFile(filePath);

          // Determine the file extension and set the content type
          const ext = path.extname(namefile).toLowerCase();
          let contentType = 'image/jpeg'; // Default to JPEG

          if (ext === '.png') {
            contentType = 'image/png';
          } else if (ext === '.jpg' || ext === '.jpeg') {
            contentType = 'image/jpeg';
          } else if (ext === '.gif') {
            contentType = 'image/gif';
          }

          // Set the correct content type for the image
          res.setHeader('Content-Type', contentType);

          // Send the image data as the response
          res.send(imageData);
        } catch (readError) {
          res.status(500).json({ error: 'Error reading image file', details: readError.message });
        }
      } else {
        res.status(400).json({ error: 'File name not provided' });
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid JWT', details: error.message });
  }
};

module.exports = {
  uploadsRealisation,
  readImage
};
