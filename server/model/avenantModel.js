const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const getAvenant = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        const Selectquery = `select *,  DATE_FORMAT(bv_programme.date_debut, "%Y" ) as debut,DATE_FORMAT(bv_programme.date_fin, "%Y" ) as fin from bv_avenant 
                             join bv_marche on bv_avenant.IDMarche = bv_marche.IDMarche
                             join bv_programme on bv_marche.IDProgramme= bv_programme.IDProgramme
                             where bv_programme.IDProgramme = ? and bv_marche.IDMarche =?`;
        const valuesS = [req.body.idprog,req.body.idMarche];
        const [select] = await db.promise().query(Selectquery, valuesS);
        res.json(select);
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }
  const getDetailAvenant = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        const Selectquery = 'select * from bv_avenant where id_Avenant =? ';
        const valuesS = [req.body.id_Avenant];
        const [select] = await db.promise().query(Selectquery, valuesS);
        res.json(select);
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }
const addAvenant = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
     
        const Selectquery='select * from bv_avenant where IDMarche=? and num_avenant=?'
        const val=[req.body.IDMarche, req.body.Avenant.num_avenant]
        const [select] = await db.promise().query(Selectquery, val);
        if (select.length === 0) {
          const insertQuery = `INSERT INTO bv_avenant(
            IDMarche, num_avenant, contractant, cocontractant, delais_execution, 
            montant_ht, montant_ttc, retenu_garantie, modalite_restitution_avance_forf, 
            modalite_restitution_avance_appro, soutretence, 
            date_notif_ods
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;
  
const values = [
    req.body.IDMarche,
    req.body.Avenant.num_avenant,
    req.body.Avenant.contractant,
    req.body.Avenant.cocontractant,
    req.body.Avenant.delais_execution,
    req.body.Avenant.montant_ht,
    req.body.Avenant.montant_ht + (req.body.Avenant.montant_ht * 19 / 100),  
    req.body.Avenant.retenu_garantie,
    req.body.Avenant.modalite_restitution_avance_forf,
  
    req.body.Avenant.modalite_restitution_avance_appro,
    req.body.Avenant.soutretence,
    req.body.Avenant.date_notif_ods
];
        
const [insert] = await db.promise().query(insertQuery, values);

        
          if (insert.affectedRows === 1) {
           res.json('true');
         } else {
           res.json('false');
         }
        } else {
    
          res.json('exist');
        }

      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  
  }
const updateAvenant = async(req, res)=>{
    try {
      await verifyJWT(req, res, async () => {
        
        const updateQuery = `
        UPDATE bv_avenant 
        SET 
          num_avenant=?,
          cocontractant=?,
          contractant=?,
          delais_execution=?,
          montant_ht=?,
          montant_ttc=?,
          retenu_garantie=?,
          modalite_restitution_avance_forf=?,
          modalite_restitution_avance_appro=?,
          soutretence=?,
          date_notif_ods=?
      
          WHERE id_Avenant =?
      `;
      const values = [
        req.body.num_avenant,
        req.body.cocontractant,
        req.body.contractant,
        req.body.delais_execution,
        req.body.montant_ht,
        req.body.montant_ht + (req.body.montant_ht * 19 / 100), 
        req.body.retenu_garantie,
        req.body.modalite_restitution_avance_forf,
        req.body.modalite_restitution_avance_appro,
        req.body.soutretence,
        req.body.date_notif_ods,
        req.body.id_Avenant
      ];
        const [update] = await db.promise().query(updateQuery, values);
        console.log(update)
        if (update.affectedRows === 1) {
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

  module.exports={updateAvenant,addAvenant,getAvenant,getDetailAvenant}