const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');

const getActionPv=async(req,res)=>
  {
   
    try {
      await verifyJWT(req, res, async () => {
        const [selectQuery] = await db.promise().query(`
    SELECT 
    bv_action_programme.action,
    bv_wilaya.wilaya_name_ascii,
    bv_commune.commune_name_ascii,
    bv_action_impactee.LOCALITES,
    tache_status.status, -- Add this to see individual status
    CASE
        WHEN MIN(tache_status.status) = 'Completed' THEN 'Completed'
        ELSE 'Not Completed'
    END AS action_status
    FROM
    bv_action_programme
    INNER JOIN bv_action_pro_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
    INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
    LEFT JOIN bv_action_impactee ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
    LEFT JOIN bv_phase ON bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee
    LEFT JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
    LEFT JOIN (
        SELECT 
            bv_tache.id_phase,
            bv_phase.id_action_impactee,
            CASE
                WHEN COUNT(CASE WHEN bv_realisation.volume_realise < bv_tache.quantite_tache THEN 1 END) = 0 THEN 'Completed'
                ELSE 'Not Completed'
            END AS status
        FROM
            bv_realisation
        INNER JOIN bv_tache ON bv_realisation.id_tache = bv_tache.id_tache
        INNER JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase
        GROUP BY
            bv_tache.id_phase, bv_phase.id_action_impactee
    ) AS tache_status ON bv_phase.id_phase = tache_status.id_phase
    LEFT JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
    LEFT JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id 
    LEFT JOIN bv_entreprise_realisation ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise  
WHERE 
    bv_marche.IDMarche = ?
GROUP BY 
    bv_action_programme.action,
    bv_wilaya.wilaya_name_ascii,
    bv_commune.commune_name_ascii,
    bv_action_impactee.LOCALITES,
    bv_action_impactee.id_action_impactee
HAVING
    action_status = 'Completed';
      `, [req.body.IDMarche]);
      
     res.status(200).json(selectQuery)
    
      })
    }
    catch{
      console.error(error);
      res.status(500).json({ error: error });
    }
  }
  const addPvProv=async(req,res)=>
    {
      try {
        await verifyJWT(req, res, async () => {
          if (!req.body.selectedetude || req.body.selectedetude == []) {
            res.json("empty");
          } else {
            var selectedetude = req.body.selectedetude;
            let [insert] = await db
            .promise()
            .query(`INSERT INTO bv_pv_provesoir_etude VALUES ()`);
                 if (insert.affectedRows === 1) {
                 const insertedId = insert.insertId;
                for (let i = 0; i < selectedetude.length; i++) {
                  [update] = await db
                  .promise()
                  .query(
                  `UPDATE bv_etude SET id_pv_pro  = ? where id_etude = ?`,
                  [insertedId, selectedetude[i].id_etude]
                  );
                 }
                 res.json("true");
        }
        }
        })
      }
      catch{
        console.error(error);
        res.status(500).json({ error: error });
      }
    }
 const getPvProvesoire=async(req,res)=>
      {
        try {
          await verifyJWT(req, res, async () => {
         const [selectQuery] = await db.promise().query(`SELECT * FROM bv_etude 
                              join bv_pv_provesoir_etude on bv_pv_provesoir_etude.id_pv_pro = bv_etude.id_pv_pro 
                              join bv_action_impactee on bv_etude.id_action_impactee=bv_action_impactee.id_action_impactee
                              join  bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                              join  bv_commune on bv_commune.id=bv_action_impactee.code_commune 
                              join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
                              join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
                              WHERE bv_action_pro_programme.id_marche=?
                              and  bv_etude.id_pv_pro is not null `,[req.body.IDMarche])



                              const result = selectQuery.reduce((acc, curr) => {
                                const existingItem = acc.find(item => item.id_pv_pro === curr.id_pv_pro);
                                if (existingItem) {
                                    const communeIndex = existingItem.liste.findIndex(entry => entry.commune_name_ascii === curr.commune_name_ascii);
                                    if (communeIndex !== -1) {
                                        existingItem.liste[communeIndex].LOCALITES.push(curr.LOCALITES);
                                    } else {
                                        existingItem.liste.push({ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] });
                                    }
                                } else {
                                    acc.push({
                                        id_pv_pro:curr.id_pv_pro,
                                        INSTITUTION_PILOTE:curr.INSTITUTION_PILOTE,
                                        action: curr.action,
                                        wilaya_name_ascii: curr.wilaya_name_ascii,
                                        liste: [{ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] }]
                                    });
                                }
                                return acc;
                            }, []);


           
         res.json(result)
        
          })
        }
        catch{
          console.error(error);
          res.status(500).json({ error: error });
        }
      }
  
 const getPvProvesoireDetail=async(req,res)=>
        {
          try {
           await verifyJWT(req, res, async () => {
            const [infopv] = await db.promise().query(`
              SELECT 
                  signataire, num_pv,
                  INSTITUTION_PILOTE, 
                  bv_pv_provesoir_etude.date, 
                  wilaya_name_ascii, 
                  intitule_marche, 
                  num_marche, 
                  bv_marche.date_notification_ods, 
                  bv_marche.cocontractant,
                  latest_avenant.* 
              FROM bv_etude 
              JOIN bv_pv_provesoir_etude ON bv_pv_provesoir_etude.id_pv_pro = bv_etude.id_pv_pro 
              JOIN bv_action_impactee ON bv_etude.id_action_impactee = bv_action_impactee.id_action_impactee
              JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              JOIN bv_commune ON bv_commune.id = bv_action_impactee.code_commune 
              JOIN bv_wilaya ON bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
              JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme 
              JOIN bv_marche ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
              JOIN (
                  SELECT * 
                  FROM bv_avenant 
                  WHERE id_Avenant IN (
                      SELECT id_Avenant 
                      FROM bv_avenant 
                      WHERE IDMarche = ?
                  )
              ) AS latest_avenant ON bv_marche.IDMarche = latest_avenant.IDMarche
              WHERE bv_etude.id_pv_pro = ?
          `, [req.body.IDMarche, req.body.id_pv_pro]);
    

           const [detailpv]= await db.promise().query(`
            SELECT * FROM bv_etude 
                   join bv_pv_provesoir_etude on bv_pv_provesoir_etude.id_pv_pro = bv_etude.id_pv_pro 
                   join bv_action_impactee on bv_etude.id_action_impactee=bv_action_impactee.id_action_impactee
                   join bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                   join bv_commune on bv_commune.id=bv_action_impactee.code_commune 
                   join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya 
                   join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
                   WHERE bv_etude.id_pv_pro =?`,[req.body.id_pv_pro])
                   res.json({infopv:infopv[0],detailpv:detailpv})
            })
          }
          catch{
            console.error(error);
            res.status(500).json({ error: error });
          }
        }
   
  const UpdatePvProvesoire=async(req,res)=>
    {
      try {
        await verifyJWT(req, res, async () => {
         if(req.body.date && req.body.signataire)
          {
         const [update] = await db.promise().query(`UPDATE bv_pv_provesoir_etude set signataire=?,date=? ,num_pv = ? WHERE id_pv_pro=?`,
          [req.body.signataire,req.body.date,req.body.num_pv,req.body.id_pv_pro])
         res.json("true")

          }
        })
      }
      catch
      {
        console.error(error);
        res.status(500).json({ error: error });
      }

    }
  module.exports={addPvProv,getPvProvesoire,getPvProvesoireDetail,UpdatePvProvesoire,getActionPv}