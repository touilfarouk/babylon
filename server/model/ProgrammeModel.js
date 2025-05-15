const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const getProgramme = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        const Selectquery = 'select *,DATE_FORMAT(date_debut, "%d/%m/%Y" ) as debut ,DATE_FORMAT(date_fin, "%d/%m/%Y" ) as fin from bv_programme ';
        const valuesS = [req.body.idprog];
        const [select] = await db.promise().query(Selectquery, valuesS);
    
        res.json(select);
      })
    } catch (error) {
      console.log(error)
      if (error.message === 'Token expired') {
        res.status(401).json({ error: 'Token expired. Please log in again.' });
      } else {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    }
  }
const addProgramme = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {

        const lastQurery="SELECT * FROM bv_programme ORDER BY IDProgramme DESC LIMIT 1;"
        const [lastRecord] = await db.promise().query(lastQurery);
    
          const lastValue = lastRecord[0];
          const lastCharacter = lastValue.intitule.slice(-1);
          const numprog=(parseInt(lastCharacter) + 1).toString()
      const insertQuery = "INSERT INTO `bv_programme` (`intitule`,date_debut,date_fin ) VALUES (?,?,?)";
        const values = [
          "PROGRAMME "+numprog , req.body.date_debut,req.body.date_fin];
        const [insert] = await db.promise().query(insertQuery, values);
        if (insert.affectedRows === 1) {
         res.json('true');
       } else {
         res.json('false');
       }
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }



  module.exports={addProgramme,getProgramme}