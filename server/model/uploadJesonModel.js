const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');
const isAllowedExtension = (fileExtension) => {
  const allowedExtensions = ['geojson']; // Add the allowed extensions here
  return allowedExtensions.includes(fileExtension.toLowerCase());
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Geojeson/');
  },
  filename: (req, file, cb) => {
    let fileName="";
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalFilename = file.originalname;
    const extensionIndex = originalFilename.lastIndexOf('.');
   
    // Check if the file extension is allowed
  

    if (extensionIndex !== -1) {
      fileName= originalFilename.substring(0, extensionIndex);
    }
    const fileExtension = originalFilename.substr(originalFilename.lastIndexOf('.') + 1);
    if (!isAllowedExtension(fileExtension)) {
      return cb(new Error('Invalid file extension'), null);
    }
    const filenameWithSuffix = fileName + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, filenameWithSuffix);
  }
});
const upload = multer({
   storage: storage,
   limits: { fileSize: 20 * 1024 * 1024 } // 10MB file size limit
   });
const uploadJeson = async (req, res, next) => {
  try {
    verifyJWT(req, res, () => {
      upload.single('file')(req, res, async (error) => {
        if (error) {
          // Check if the error is due to an invalid file extension
          if (error.message === 'Invalid file extension') {
            res.json('Invalid file extension');
          } else {
            return res.status(500).json({ error: 'File upload failed' });
          }}
        else { 
          const fileContent=req.file.filename
          const id_action_impactee = req.params.id;
          const selctquery ='select * from bv_geoloclisation where id_action_impacte =?';
        
          const valuesselect = [id_action_impactee];
          const [select] = await db.promise().query(selctquery, valuesselect);
         
          if(select.length==0)
          {
            const query ='INSERT INTO bv_geoloclisation (id_action_impacte, chemin) VALUES (?,?)';
            const values = [id_action_impactee, fileContent];
            try {  
              const [uploadJeson] = await db.promise().query(query, values);
              if(uploadJeson.affectedRows === 1)
              res.json("insert");
             } 
               catch (error) {
                 res.json("error");
               } 
          }
          else{
            const query ='UPDATE `bv_geoloclisation` SET `chemin`=? WHERE id_action_impacte=?';
            const values = [ fileContent,id_action_impactee];
            try {  
              const [uploadJeson] = await db.promise().query(query, values);
              if(uploadJeson.affectedRows === 1)
              res.json("update");
             } 
               catch (error) {
                 res.json("error");
               }
          }
         
         
        }
      });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid JWT' });
  }
};
const ReadGeoJson = async (req, res, next) => {
  const readGeoJSONFile = async (filePath) => {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading GeoJSON file:', error);
      throw error;
    }
  };

  try {
    verifyJWT(req, res, async () => {
      // Assuming you have some logic to obtain the filePath
     
      const namefile = req.body.namefile;
  
      if(namefile)
      {
        const filePath = path.join(__dirname, '..', 'Geojeson', namefile);
        if (filePath) {
          try {
            const geojsonData = await readGeoJSONFile(filePath);
            res.json(geojsonData);
          } catch (readError) {
            res.status(500).json({ error: 'Error reading GeoJSON file' });
          }
        } else {
          res.json("error");
        }
      }
  
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid JWT' });
  }
};
module.exports = {
  uploadJeson,ReadGeoJson
};