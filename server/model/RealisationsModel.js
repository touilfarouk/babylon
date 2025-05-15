const db = require("../config/connection");
const { verifyJWT } = require("../middleware/verifyJWT");
const argon2 = require("argon2");

const getRealisations = async (req, res) => {
  const {id_action_impactee } = req.params;
  try {
    await verifyJWT(req, res, async () => {
      const [allRealisations] = await db.promise().query(`
        SELECT *,
               DATE_FORMAT(bv_realisation.date_visite, "%d/%m/%Y") as datevisite
        FROM bv_realisation
        JOIN bv_tache ON bv_realisation.id_tache = bv_tache.id_tache
        JOIN bv_phase ON bv_phase.id_phase = bv_tache.id_phase
        JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee
        JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
        JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
        WHERE bv_action_impactee.id_action_impactee = ?
        ORDER BY bv_realisation.date_visite
    `, [id_action_impactee]);
    
     res.json(allRealisations);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const getRealisationsDet = async (req, res) => {

  try {
    await verifyJWT(req, res, async () => {
  
      let VolumeTotalRealisation = 0;
      let i = 0;
      const query1 = `SELECT  bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase,SUM(bv_realisation.volume_realise) as totalrealise,bv_tache.quantite_tache as total_prevu FROM 
      bv_action_impactee 
      INNER JOIN bv_phase ON  bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
      INNER JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
      LEFT JOIN bv_realisation on bv_tache.id_tache=bv_realisation.id_tache 
      INNER JOIN  bv_commune ON bv_action_impactee.code_commune = bv_commune.id
      WHERE bv_action_impactee.id_action_impactee=? 
        GROUP BY bv_tache.id_tache`;
      const values = [req.body.id_action_impactee];
      const [selectedTache] = await db.promise().query(query1, values);
      console.log(selectedTache)
      for (const tache of selectedTache) {
        if (tache.total_prevu !== 0) {
          VolumeTotalRealisation += parseFloat(
            ((tache.totalrealise * 100) / tache.total_prevu).toFixed(2)
          );
          i++;
        }
      }

      const etatAvanc=VolumeTotalRealisation/i
      console.log(VolumeTotalRealisation)
      res.json(etatAvanc)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const getRealisationJournal = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const query1 = `  SELECT 
      DATE_FORMAT(bv_realisation.date_visite, "%d/%m/%Y") AS date_visite,
      bv_tache.id_tache,
      bv_tache.intitule_tache,
      bv_tache.unite_tache,
      bv_phase.num_phase,
      bv_realisation.volume_realise,
      bv_tache.quantite_tache AS total_prevu,
      (
        SELECT SUM(br.volume_realise)
        FROM bv_realisation br
        WHERE br.id_tache = bv_tache.id_tache AND br.date_visite <= bv_realisation.date_visite
      ) AS totalrealise
    FROM 
      bv_action_impactee
      INNER JOIN bv_phase ON bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee
      INNER JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
      INNER JOIN bv_realisation ON bv_tache.id_tache = bv_realisation.id_tache
    WHERE 
      bv_action_impactee.id_action_impactee = ?`;
      const values = [req.body.id_action_impactee];
      const [selectedTache] = await db.promise().query(query1, values);
  

      const groupedData = selectedTache.reduce((acc, item) => {
        const date = item.date_visite || 'Aucune date';
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});

      // Sort the grouped data by date (most recent first)
      const sortedGroupedData = Object.keys(groupedData)
        .sort((a, b) => {
          const dateA = a === 'Aucune date' ? new Date(0) : new Date(a.split('/').reverse().join('-'));
          const dateB = b === 'Aucune date' ? new Date(0) : new Date(b.split('/').reverse().join('-'));
          return dateB - dateA; // Change this line to sort in descending order
        })
        .reduce((acc, key) => {
          acc[key] = groupedData[key];
          return acc;
        }, {});
        console.log(sortedGroupedData)
      res.json(sortedGroupedData);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const addRealisation = async (req, res) => {
  const { id_tache } = req.params;
  await verifyJWT(req, res, async () => {
    try {
      const [exist]= await db.promise().query(`select * from bv_realisation where id_tache =? and date_visite=? and volume_realise=? and recommandation=?`
      ,[ id_tache,req.body.date_visite,req.body.volume_realise,req.body.recommandation])
      
      if(exist.length >  0){
         return res.status(400).json({ message: "exist" });
      }
      const [selecQuery] = await db.promise().query(`
        SELECT bv_tache.quantite_tache, IFNULL(SUM(bv_realisation.volume_realise), 0) AS totalRealise
        FROM bv_tache 
        LEFT JOIN bv_realisation ON bv_tache.id_tache = bv_realisation.id_tache
        WHERE bv_tache.id_tache = ?
        GROUP BY bv_tache.id_tache
      `, [id_tache]);
      if (selecQuery.length === 0) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }
  
      const task = selecQuery[0];
      const newTotalRealise =  (parseFloat(task.totalRealise) + parseFloat(req.body.volume_realise)).toFixed(2);
 
      if (newTotalRealise > task.quantite_tache) {
        return res.status(400).json({ message: "Volume réalisé dépasse la quantité de tâche" });
      }

      const query = `
        INSERT INTO bv_realisation (date_visite, volume_realise, recommandation, id_tache) 
        VALUES (?, ?, ?, ?)
      `;
      const values = [
        req.body.date_visite,
        req.body.volume_realise,
        req.body.recommandation,
        id_tache
      ];
      const [insert] = await db.promise().query(query, values);

      if (insert.affectedRows === 1) {  
       
        if (task.totalRealise === 0 && newTotalRealise === task.quantite_tache) {
          res.json({ message: "first last", id_realisation: insert.insertId });
        } else if (newTotalRealise === task.quantite_tache) {
          res.json({ message: "last", id_realisation: insert.insertId });
        } else if(task.totalRealise === 0 ) {
          res.json({ message: "first", id_realisation: insert.insertId });
          }else
           {res.json({ message: "true", id_realisation: insert.insertId });}
      } else {
        res.status(500).json({ message: "Échec de l'insertion" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
};




const updateRealisation = async (req, res) => {
  await verifyJWT(req, res, async () => {
    try {
      const {
        date_visite,
        volume_realise,
        etat_realisation,
        recommandation,
        volume_totale_realise,
        id_realisation,
      } = req.body;

      const query =
        "UPDATE `bv_realisation` SET `date_visite`=?, `volume_realise`=?, `etat_realisation`=?, `recommandation`=?, `volume_totale_realise`=? WHERE `id_realisation`=?";
      const values = [
        date_visite,
        volume_realise,
        etat_realisation,
        recommandation,
        volume_totale_realise,
        id_realisation,
      ];

      const [update] = await db.promise().query(query, values);

      if (update.affectedRows === 1) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
};


module.exports = {
  getRealisationsDet,
  getRealisations,
  addRealisation,
  updateRealisation,
  getRealisationJournal
};
