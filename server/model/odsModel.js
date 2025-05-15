const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const getOds = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {

       const query = 'select *, DATE_FORMAT(date_debut_ods, "%d/%m/%Y" ) as datedebutods,DATE_FORMAT(date_fin_ods, "%d/%m/%Y" ) as datefinods from bv_ods where id_tache= ?';
       const values = [req.body.id_tache];
       const [select] = await db.promise().query(query, values);
       console.log("select");
       res.json(select);
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const addTache = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
        console.log(req.body);
        if (
          !req.body.id_phase  ||
          !req.body.intitule_tache ||
          !req.body.unite_tache ||
          !req.body.quantite_tache ||
          !req.body.prix_ht_tache 
        ) { res.json('empty');}
        else
        {
         const query = 'INSERT INTO bv_tache(id_phase, intitule_tache, unite_tache, quantite_tache, date_debut_realisation, date_fin_realisation,prix_ht_tache) VALUES (?,?,?,?,?,?,?)';
         const values = [req.body.id_phase ,req.body.intitule_tache,req.body.unite_tache,req.body.quantite_tache,req.body.date_debut_realisation,req.body.date_fin_realisation,req.body.prix_ht_tache];
         const [insert] = await db.promise().query(query, values);
         if (insert.affectedRows === 1) {
          res.json('true');
        } else {
          res.json('false');
        }
      
      }
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
};
const updateTache = async(req, res)=>{
  try {
    await verifyJWT(req, res, async () => {

       const updateQuery="UPDATE `bv_tache` SET `intitule_tache`=?,`unite_tache`=?,`quantite_tache`=?,`prix_ht_tache`=?,`montant_global`=?,`date_debut_realisation`=?,`date_fin_realisation`=? WHERE id_tache=?";
       const values = [req.body.intitule_tache,req.body.unite_tache,req.body.quantite_tache,req.body.prix_ht_tache,req.body.quantite_tache*req.body.prix_ht_tache,req.body.date_debut_realisation,req.body.date_fin_realisation,req.body.id_tache];
       const [insert] = await db.promise().query(updateQuery, values);
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
module.exports = {addTache,updateTache,getOds};