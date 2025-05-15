const multer = require('multer');
const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    let fileName="";
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalFilename = file.originalname;
    const extensionIndex = originalFilename.lastIndexOf('.');
    if (extensionIndex !== -1) {
      fileName= originalFilename.substring(0, extensionIndex);
    }
    const fileExtension = originalFilename.substr(originalFilename.lastIndexOf('.') + 1);
    const filenameWithSuffix = fileName + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, filenameWithSuffix);
  }
});
const upload = multer({
   storage: storage,
   limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
   });
const uploads = async (req, res, next) => {
  try {
    verifyJWT(req, res, () => {
      upload.single('file')(req, res, async (error) => {
       
        if (error) {
          return res.status(500).json({ error: 'File upload failed' });
        }
        else { 
          const fileContent=req.file.filename
          const sender = req.params.from;
          const users = req.params.to;
        if(users != 'groupe')
         { const query ='INSERT INTO messages (message, users, sender, type_message, createdAt,vue_groupe,id_groupe) VALUES (?,?,?,?,?,?,?)';
          const values = [fileContent, users, sender, 'file',new Date(),"",0];
          try {  
            const [sendMessages] = await db.promise().query(query, values);
            res.json({fileContent,sendMessages});
           } 
             catch (error) {
               res.json("error");
             } 
            }else{
              const id_groupe = req.params.id_groupe
              const query ='INSERT INTO messages (message, users, sender, type_message,id_groupe,createdAt,vue_groupe) VALUES (?,?,?,?,?,?,?)';
              const values = [fileContent, users, sender, 'file',id_groupe,new Date(),""];
          try {  
            const [sendMessages] = await db.promise().query(query, values);
            res.json({fileContent,sendMessages});
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
module.exports = {
  uploads
};


