const db = require("../config/connection");
const { verifyJWT } = require("../middleware/verifyJWT");


const getPhases = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const results = [];
     const [allPhases] = await db.promise().query(`SELECT DISTINCT id_phase,num_phase FROM bv_phase 
    
      where bv_phase.id_action_impactee =? order by id_phase `,[req.body.id_action_impactee]);
      for (const phase of allPhases)
        {
          const [tache] = await db.promise().query(`
          SELECT
          id_tache,
          intitule_tache,unite_tache,quantite_tache,prix_ht_tache,montant_global,duree_tache,
          date_debut_realisation,
          date_fin_realisation
          FROM bv_tache join bv_phase on bv_tache.id_phase= bv_phase.id_phase
          WHERE bv_tache.id_phase = ${phase.id_phase}
          ;
          `);
          const [nombretache] = await db.promise().query(`
          SELECT count(id_tache) as nombre_tache from bv_tache where id_phase= ${phase.id_phase}
          ;
          `);
          const pashWithTach = {
            volume_pv:phase.volume_pv,
            VOLUME_VALIDE:phase.VOLUME_VALIDE,
            dencite:phase.dencite,
            LOCALITES:phase.LOCALITES,
            action:phase.action,
            id_action_impactee: phase.id_action_impactee,
            id_phase : phase.id_phase ,
            num_phase:phase.num_phase,
            nombre_tache:nombretache[0].nombre_tache,
            tache:tache
        };
        results.push(pashWithTach);  
        }

        res.json(results);

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const addPhase = async (req, res) => {
  await verifyJWT(req, res, async () => {
    try {

  const select = req.body.SelectedImpct;
    const idsInsertedPhase=[]
    const [maxCptNumber]=await db.promise().query(`insert into bv_cpt values()`)
    console.log(maxCptNumber.insertId)
    numCpt=maxCptNumber.insertId
    const executeInsertQuery = async (item, i) => {
        const query = "INSERT INTO `bv_phase` (`id_action_impactee`, `num_phase`) VALUES (?, ?)";
        const values = [item, i];
        const [insert] = await db.promise().query(query, values);
        idsInsertedPhase.push(insert.insertId)
    };
    for (const item of select) {
     const updateNumCpt=await db.promise().query(`update bv_action_impactee set num_cpt = ${numCpt},paiment='${req.body.modePaiment}' where id_action_impactee=${item.id_action_impactee}`)
        for (let i = 1; i <= req.body.nombrePhase; i++) {
            await executeInsertQuery(item.id_action_impactee, i);
        }
    }

const [selectPhaseQuery] =await db
.promise()
.query( `
    SELECT id_phase,num_phase 
    FROM bv_phase
    WHERE id_phase IN (${idsInsertedPhase.join(', ')})
`);
const uniquePhases = [...new Set(selectPhaseQuery.map(phase => phase.num_phase))];
const dataTableRows = uniquePhases.map(phaseNum => {
  const rowsForPhase = selectPhaseQuery.filter(phase => phase.num_phase === phaseNum);
  return {
    phaseNum: phaseNum,
    rows: rowsForPhase
  };
});
//console.log(dataTableRows)
    res.json(dataTableRows)

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
};
const getPhaseImpact = async (req, res) => {
  await verifyJWT(req, res, async () => {
    try {
      const [phases] = await db.promise().query(
        `SELECT * FROM bv_phase WHERE id_action_impactee = ? order by num_phase `,
        [req.body.id_action_impactee]
      );
      const phase_list = [];
      for (const phase of phases)
      {
        const phas = {
          value: phase.id_phase,
          label: phase.num_phase	,
      };
   
      phase_list.push(phas);
      }
      res.json(phase_list);
   
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
};

const deletePhase = async (req, res) => {
  await verifyJWT(req, res, async () => {
    try {
      const query = "DELETE FROM `bv_phase` WHERE id_phase=?";
      const values = [req.body.id_phase];

      const [delet] = await db.promise().query(query, values);

      if (delet.affectedRows === 1) {
        res.json({rep:"true"});
      } else {
        res.json("false");
      }
    } catch (error) {
     // console.error(error);

      // Check if the error is related to a foreign key constraint
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        // Send a custom error message to the front end
        res.json({ rep: "Cannot delete" });
      } else {
        // Handle other types of errors
        res.status(500).json({ error: "An error occurred" });
      }
    }
  });
};

module.exports = {
  getPhases,
  addPhase,
  getPhaseImpact,
  deletePhase
};
