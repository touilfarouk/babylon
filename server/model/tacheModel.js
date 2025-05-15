const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');
const argon2 = require('argon2');

const getTache = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const phaseQuery="select * from bv_phase join bv_action_impactee on bv_phase.id_action_impactee=bv_action_impactee"
       const query = `select *, DATE_FORMAT(date_debut_realisation, "%d/%m/%Y" ) as datedebut,DATE_FORMAT(date_fin_realisation, "%d/%m/%Y" ) as datefin 
       from bv_tache join bv_phase on bv_tache.id_phase = bv_tache.id_phase
       join bv_action_impactee on bv_phase.id_action_impactee  = 	bv_action_impactee.id_action_impactee  
        where	bv_action_impactee.id_action_impactee=?
      `;
       const values = [req.body.id_action_impactee];
       const [select] = await db.promise().query(query, values);
       res.json(select);
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const getTacheList = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
     
       const query = `select * from bv_tache where id_phase =?
      `;
       const values = [req.body.id_phase];
       const [select] = await db.promise().query(query, values);
       const tache_list = [];
       for (const tache of select)
       {
         const tach = {
           value: tache.id_tache,
           label: tache.intitule_tache	,
       };
    
       tache_list.push(tach);
       }
       res.json(tache_list);


    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const getDetailTache = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
     
       const query = `select bv_tache.unite_tache,bv_tache.quantite_tache from bv_tache 
       where bv_tache.id_tache =?
      `;
       const values = [req.body.id_tache];
       const [select] = await db.promise().query(query, values);
       const sumQuery=' select sum(bv_realisation.volume_realise) as total from bv_realisation where id_tache=?'
       const [sum] = await db.promise().query(sumQuery, values);
       const resultObject = {
        ...select[0],
        total: sum[0] ? sum[0].total : 0,
      };
         res.json(resultObject);


    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const addTache = async (req, res) => {
    try {
      await verifyJWT(req, res, async () => {
        const rows = req.body.idPhases;

        for (const row of rows) {
            let quantite_tache;
            let montant;
            if (req.body.tache.unite_tache === 'U') {
                const result = await db.promise().query(`SELECT bv_action_impactee.nombre FROM bv_action_impactee
                                                          JOIN bv_phase ON bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee
                                                          WHERE bv_phase.id_phase = ${row.id_phase}`);
                if (result[0].length > 0) {
                    quantite_tache = result[0][0].nombre;
                    montant = quantite_tache*req.body.tache.prix_ht_tache;
                }
            } else {
                const result = await db.promise().query(`SELECT bv_action_impactee.VOLUME_VALIDE FROM bv_action_impactee
                                                          JOIN bv_phase ON bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee
                                                          WHERE bv_phase.id_phase = ${row.id_phase}`);
                if (result[0].length > 0) {
                    quantite_tache = result[0][0].VOLUME_VALIDE;
                    montant = quantite_tache * req.body.tache.prix_ht_tache;
                }
            }
        
            if (quantite_tache !== undefined && montant !== undefined) {
                const query = 'INSERT INTO bv_tache(id_phase, intitule_tache, unite_tache, quantite_tache, montant_global, prix_ht_tache) VALUES (?, ?, ?, ?, ?, ?)';
                const values = [
                    row.id_phase,
                    req.body.tache.intitule_tache,
                    req.body.tache.unite_tache,
                    quantite_tache,
                    montant,
                    req.body.tache.prix_ht_tache
                ];
                const [insert] = await db.promise().query(query, values);
            }
        }
        
          res.json(req.body);
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
module.exports = {addTache,updateTache,getTache,getTacheList,getDetailTache};