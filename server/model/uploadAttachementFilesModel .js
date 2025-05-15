const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

// Function to validate the file extension
const isAllowedExtension = (fileExtension) => {
  const allowedExtensions = ['pdf']; // Allowed extensions: only PDF
  return allowedExtensions.includes(fileExtension.toLowerCase());
};

// Multer storage configuration for PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'AttachementsFiles/'); // Store files in 'PDFs/' directory
  },
  filename: (req, file, cb) => {
    let fileName = "";
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalFilename = file.originalname;
    const extensionIndex = originalFilename.lastIndexOf('.');

    if (extensionIndex !== -1) {
      fileName = originalFilename.substring(0, extensionIndex);
    }
    
    const fileExtension = originalFilename.substr(originalFilename.lastIndexOf('.') + 1);
    if (!isAllowedExtension(fileExtension)) {
      return cb(new Error('Invalid file extension'), null);
    }
    
    const filenameWithSuffix = fileName + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, filenameWithSuffix);
  }
});

// Set up multer for file upload with file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB file size limit
});

// Upload PDF file handler
const uploadPdf = async (req, res, next) => {
  try {
    verifyJWT(req, res, () => {
      upload.single('file')(req, res, async (error) => {
        if (error) {
          if (error.message === 'Invalid file extension') {
            return res.status(400).json('Invalid file extension');
          } else {
            return res.status(500).json({ error: 'File upload failed' });
          }
        } else { 
          const fileContent = req.file.filename;
          
          const id_att=req.params.idatt;
       
               const updateQuery = 'UPDATE bv_attachement SET file = ? WHERE id_attachement = ?';
               const valuesUpdate = [fileContent, id_att];
               try {  
                 const [uploadPdf] = await db.promise().query(updateQuery, valuesUpdate);
                 if (uploadPdf.affectedRows === 1)
                   res.json("update");
               } catch (error) {
                 res.status(500).json("error");
               }
              
     
        }
      });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid JWT' });
  }
};

// Read PDF file handler
const ReadPdf = async (req, res, next) => {
    const readPdfFile = async (filePath) => {
      try {
        const data = await fs.readFile(filePath); // Read the PDF file as binary
        return data;
      } catch (error) {
        console.error('Error reading PDF file:', error);
        throw error;
      }
    };
  
    try {
      verifyJWT(req, res, async () => {
        const namefile = req.body.fileName; // Ensure this matches how the file name is sent in the request
    
        if (namefile) {
          const filePath = path.join(__dirname, '..', 'AttachementsFiles', namefile); // Ensure the file path is correct
          
          try {
            const pdfData = await readPdfFile(filePath);
            
            // Set the correct content type for PDF
            res.contentType('application/pdf'); 
            res.send(pdfData); // Send the binary PDF data
          } catch (readError) {
            res.status(500).json({ error: 'Error reading PDF file' });
          }
        } else {
          res.status(400).json("File name not provided");
        }
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid JWT' });
    }
  };
  

module.exports = {
  uploadPdf,
  ReadPdf
};
