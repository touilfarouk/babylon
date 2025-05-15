const db = require("../config/connection");
const { verifyJWT } = require("../middleware/verifyJWT");

const getPosts = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
  
      let allPosts;
      const structure = req.structure;
      const wilaya=req.wilaya;
      if(req.body.type=="all")
      {
       let query =
          `SELECT DISTINCT bv_action_programme.action,bv_attachement.num_attachement,
           bv_entreprise_realisation.libelle,
           bv_attachement.id_attachement,bv_attachement.valider_attchement,bv_wilaya.wilaya_name_ascii,
           bv_commune.commune_name_ascii,bv_action_impactee.LOCALITES,bv_attachement.valider_attchement FROM
           bv_attachement left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
           left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
           left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
           left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
           INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
           INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
           INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
           left join  bv_wilaya on  bv_action_impactee.code_wilaya  = bv_wilaya.wilaya_code  
           left join bv_commune on bv_action_impactee.code_commune  =bv_commune.id 
           left join bv_entreprise_realisation on bv_action_impactee.id_entreprise_realisation  = bv_entreprise_realisation.ID_entreprise  
           where bv_action_pro_programme.id_pro_action_pro = ?
           and bv_marche.IDMarche=?
           `;
           let queryParams = [req.body.action,req.body.IDMarche];
           if (structure !== 'DGF' && structure !== 'FORETS') {
            query += ' AND bv_action_impactee.INSTITUTION_PILOTE = ? and bv_wilaya.wilaya_code=?';
            queryParams.push(structure,wilaya);
          }
          else{
            query += 'AND bv_wilaya.wilaya_code=?';
            queryParams.push(wilaya);
          }
          const [allPosts] = await db.promise().query(query, queryParams);
        const result = allPosts.reduce((acc, curr) => {
          const existingItem = acc.find(item => item.id_attachement === curr.id_attachement);
          if (existingItem) {
              const communeIndex = existingItem.liste.findIndex(entry => entry.commune_name_ascii === curr.commune_name_ascii);
              if (communeIndex !== -1) {
                  existingItem.liste[communeIndex].LOCALITES.push(curr.LOCALITES);
              } else {
                  existingItem.liste.push({ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] });
              }
          } else {
              acc.push({
                  id_attachement: curr.id_attachement,
                  num_attachement:curr.num_attachement,
                  valider_attchement:curr.valider_attchement,
                  action: curr.action,
                  libelle:curr.libelle,
                  wilaya_name_ascii: curr.wilaya_name_ascii,
                  liste: [{ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] }]
              });
          }
          return acc;
      }, []);
      
      
        res.json(result);
      }
      else{
        if(req.body.type=="asf")
        {let allPosts;
         

      let query = `
      SELECT DISTINCT bv_action_programme.action, bv_attachement.num_attachement, bv_attachement.id_attachement,
      bv_wilaya.wilaya_name_ascii, bv_commune.commune_name_ascii, bv_action_impactee.LOCALITES,
      bv_attachement.valider_attchement
      FROM bv_attachement
      LEFT JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement
      LEFT JOIN bv_tache ON bv_realisation.id_tache = bv_tache.id_tache
      LEFT JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase
      LEFT JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee
      LEFT JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
      LEFT JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
      LEFT JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
      LEFT JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
      LEFT JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
      LEFT JOIN bv_entreprise_realisation ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise
      WHERE 
      bv_attachement.id_asf IS NULL
      AND bv_attachement.valider_attchement = 1
      AND bv_marche.IDMarche = ?
      and bv_marche.contractant=?
    `;
    const params = [req.body.IDMarche,structure];
     [allPosts] = await db.promise().query(query, params);
    




const result = allPosts.reduce((acc, curr) => {
            const existingItem = acc.find(item => item.id_attachement === curr.id_attachement);
            if (existingItem) {
                const communeIndex = existingItem.liste.findIndex(entry => entry.commune_name_ascii === curr.commune_name_ascii);
                if (communeIndex !== -1) {
                    existingItem.liste[communeIndex].LOCALITES.push(curr.LOCALITES);
                } else {
                    existingItem.liste.push({ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] });
                }
            } else {
                acc.push({
                    id_attachement: curr.id_attachement,
                    num_attachement:curr.num_attachement,
                    action: curr.action,
                    wilaya_name_ascii: curr.wilaya_name_ascii,
                    liste: [{ commune_name_ascii: curr.commune_name_ascii, LOCALITES: [curr.LOCALITES] }]
                });
            }
            return acc;
        }, []);
        
        
          res.json(result);
          
        }




        else{[allPosts] = await db
          .promise()
          .query(
            `SELECT DISTINCT bv_action_impactee.INSTITUTION_PILOTE,
            bv_action_programme.action,bv_attachement.num_attachement, bv_attachement.id_attachement,bv_wilaya.wilaya_name_ascii,bv_commune.commune_name_ascii,bv_action_impactee.LOCALITES,bv_attachement.valider_attchement FROM
             bv_attachement left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
             left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
             left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
             left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
             INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
             INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
             left join  bv_wilaya on  bv_action_impactee.code_wilaya  = bv_wilaya.wilaya_code  
             left join bv_commune on bv_action_impactee.code_commune  =bv_commune.id 
             left join bv_entreprise_realisation on bv_action_impactee.id_entreprise_realisation  = bv_entreprise_realisation.ID_entreprise  
             where bv_action_pro_programme.id_pro_action_pro  =?
             and bv_action_impactee.INSTITUTION_PILOTE=?
             and bv_wilaya.wilaya_code = ? and bv_attachement.valider_attchement=1
             and bv_attachement.id_asf is null`,[req.body.action,structure,wilaya]);
             res.json({ allPosts });}
        
      }

     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const getTacheList = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      let allPosts;
      const wilaya=req.wilaya;
      const structure=req.structure;
   if(structure=="DGF")
    {
      [allPosts] = await db
      .promise()
      .query(
        `SELECT bv_action_impactee.LOCALITES ,bv_commune.commune_name_ascii,bv_wilaya.wilaya_name_ascii, bv_phase.num_phase ,bv_tache.intitule_tache,bv_tache.id_tache, bv_tache.unite_tache,  ROUND(SUM(bv_realisation.volume_realise), 2) as volume_realiser  FROM bv_tache 
        inner join bv_realisation on bv_tache.id_tache = bv_realisation.id_tache 
        left join bv_phase on bv_tache.id_phase=bv_phase.id_phase 
        left join bv_action_impactee on  bv_phase.id_action_impactee=bv_action_impactee.id_action_impactee 
        left join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code 
        left join bv_commune on bv_action_impactee.code_commune=bv_commune.id
        where bv_action_impactee.id_pro_action_programme = ? and  bv_realisation.id_attachement IS NULL 
        group by bv_tache.id_tache
        order by bv_action_impactee.LOCALITES ,bv_commune.commune_name_ascii, bv_phase.num_phase
      `,
        [req.body.action,wilaya,structure]
      );
    }
    else{
      [allPosts] = await db
      .promise()
      .query(
        `SELECT bv_action_impactee.LOCALITES ,bv_commune.commune_name_ascii,bv_wilaya.wilaya_name_ascii, bv_phase.num_phase ,bv_tache.intitule_tache,bv_tache.id_tache, bv_tache.unite_tache,  ROUND(SUM(bv_realisation.volume_realise), 2) as volume_realiser  FROM bv_tache 
        inner join bv_realisation on bv_tache.id_tache = bv_realisation.id_tache 
        left join bv_phase on bv_tache.id_phase=bv_phase.id_phase 
        left join bv_action_impactee on  bv_phase.id_action_impactee=bv_action_impactee.id_action_impactee 
        left join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code 
        left join bv_commune on bv_action_impactee.code_commune=bv_commune.id
        where bv_action_impactee.id_pro_action_programme = ? and code_wilaya =? and  bv_realisation.id_attachement IS NULL 
        and bv_action_impactee.INSTITUTION_PILOTE=?
        group by bv_tache.id_tache
        order by commune_name_ascii,num_phase
      `,
        [req.body.action,wilaya,structure]
      );
    }
  
      res.json({ allPosts });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const addAttachement = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      if (!req.body.selectedtache || req.body.selectedtache == []) {
        res.json("empty");
      } else {
        var selectedtache = req.body.selectedtache;
        var exitLoop = false;
        let inferieur=false;
      for (let i = 0; i < selectedtache.length; i++) {
           // if (exitLoop) break; 
            const [isatttached] = await db.promise().query(`
            SELECT id_attachement  
            FROM bv_realisation  
            WHERE bv_realisation.id_tache = ?
        `, [selectedtache[i].id_tache]); 
        if(isatttached[0].id_attachement != null)
        {
      
           const [isvalidetache] = await db.promise().query(`
        SELECT valider_attchement 
        FROM bv_attachement 
        LEFT JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement 
        WHERE bv_realisation.id_tache = ?
    `, [selectedtache[i].id_tache]);
    if (isvalidetache[0].valider_attchement === 0) {
      exitLoop = true; 
      break;
  }}}  
    if (exitLoop) {
          res.json("invalide");
     } else {

      for (i = 0; i < selectedtache.length; i++) {
           if(selectedtache[i].volume_realiser < selectedtache[i].quantite_attachement)
           {
            inferieur=true;
            break;
           }
      }
      if(inferieur)
      {
        res.json("inferieur");
      }

          let [insert] = await db
           .promise()
           .query(`INSERT INTO bv_attachement VALUES ()`);
                if (insert.affectedRows === 1) {
                const insertedId = insert.insertId;
                for (i = 0; i < selectedtache.length; i++) {
                var tacheId = selectedtache[i].id_tache;
                [volume_antr] = await db
                .promise()
                .query(
                `select sum(volume_realise) as volume_realise from bv_realisation where id_attachement <> ? AND id_tache=? and id_attachement IS NOT NULL `,
                [insertedId,tacheId]
                );
               
                const [selectIdRealisation] = await db.promise().query(
                  `SELECT id_realisation ,volume_realise
                   FROM bv_realisation 
                   WHERE id_tache = ? AND id_attachement IS NULL`, 
                   [tacheId]
                );
                
                  if(selectIdRealisation.length>0)
                  {
                    if(selectedtache[i].quantite_attachement==selectedtache[i].volume_realiser)
                    {  
                      for (let j = 0; j < selectIdRealisation.length; j++) 
                      {
                        [update] = await db
                        .promise()
                        .query(
                        `UPDATE bv_realisation SET id_attachement = ? where id_realisation =? and id_attachement IS NULL`,
                        [insertedId, selectIdRealisation[j].id_realisation]
                        );
                        [update_vol] = await db
                        .promise()
                        .query(
                        `UPDATE bv_realisation set volume_realise_antr=? where id_tache=? and id_attachement=? `,
                        [volume_antr[0].volume_realise,tacheId,insertedId]
                        );
                      }
                    }
                      if(selectedtache[i].quantite_attachement < selectedtache[i].volume_realiser)
                      {
                        let remainingVolume = selectedtache[i].volume_realiser - selectedtache[i].quantite_attachement;

                        for (let j = 0; j < selectIdRealisation.length; j++) {
                          if(selectIdRealisation[j].volume_realise > remainingVolume )
                          {
                            [update_partial] = await db.promise().query(
                              `UPDATE bv_realisation SET volume_realise = ?  WHERE id_realisation = ?`,
                              [selectedtache[i].quantite_attachement, selectIdRealisation[j].id_realisation]);

                              [insert_new_realisation] = await db.promise().query(
                                `INSERT INTO bv_realisation (id_tache, volume_realise) VALUES (?,?)`,
                                [selectedtache[i].id_tache, remainingVolume]
                            );
                            break;
                        }
                        }

                        for (let j = 0; j < selectIdRealisation.length; j++) 
                          {
                            [update] = await db
                            .promise()
                            .query(
                            `UPDATE bv_realisation SET id_attachement = ? where id_realisation =? and id_attachement IS NULL`,
                            [insertedId, selectIdRealisation[j].id_realisation]
                            );
                            [update_vol] = await db
                            .promise()
                            .query(
                            `UPDATE bv_realisation set volume_realise_antr=? where id_tache=? and id_attachement=? `,
                            [volume_antr[0].volume_realise,tacheId,insertedId]
                            );
                          }
                      }
                  

                  }

      
                }
                  res.json({rep:"true",idAtt:insertedId});
                  } else {
                  res.json("false");
                  }

        }
     
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const valideAttachement = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      // const userId = req.userId;

      let update;
      [update] = await db
        .promise()
        .query(
          `UPDATE bv_attachement SET  valider_attchement= ? where id_attachement=? `,
          [req.body.val,req.body.id_attachement]
        );
      if (update.affectedRows === 1) {
        if(req.body.val==1)
          res.json("validation");
        else
        res.json("invalidation");

      } else {
        res.json("false");
      }

      // res.json({ allPosts });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const updateAttachement = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      // const userId = req.userId;

      let update;
      [update] = await db
        .promise()
        .query(
          `UPDATE bv_attachement SET num_attachement=?,  date_signature_entr=?,date_signature_bet=?,date_signature_instutition=?,chef_circonscription_forets=?,chef_district_forets=?,chef_triage_forets=?,dir_projet_ergr=?,chef_zone=?,commisaire_reginal=? , date_etabli_attachement =? where id_attachement=? `,
          [ req.body.form.num_attachement,
            req.body.form.date_signature_entr,
            req.body.form.date_signature_bet,
            req.body.form.date_signature_instutition,
            req.body.form.chef_circonscription_forets,
            req.body.form.chef_district_forets,
            req.body.form.chef_triage_forets,
            req.body.form.dir_projet_ergr,
            req.body.form.chef_zone,
            req.body.form.commisaire_reginal,
            req.body.form.date_etabli_attachement,
            req.body.id_attachement,
          ]
        );
      if (update.affectedRows === 1) {
        res.json("true");
      } else {
        res.json("false");
      }

      // res.json({ allPosts });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const getAttachementDetails = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      let avenant;
      const [detail] = await db
        .promise()
        .query(
          `SELECT DISTINCT  
            bv_attachement.chef_zone, 
             bv_attachement.file, 
            bv_attachement.commisaire_reginal,
            bv_attachement.num_attachement, 
            bv_attachement.date_signature_entr,
            bv_attachement.date_signature_bet,
            bv_attachement.date_signature_instutition,
            bv_attachement.date_etabli_attachement,
            bv_attachement.valider_attchement,
            bv_attachement.chef_circonscription_forets,
            bv_attachement.chef_district_forets,
            bv_attachement.chef_triage_forets,
            bv_attachement.dir_projet_ergr,
            bv_attachement.chef_circonscription_forets_ar,
            bv_attachement.chef_district_forets_ar,
            bv_attachement.chef_triage_forets_ar,
            bv_attachement.dir_projet_ergr_ar,
            bv_wilaya.wilaya_name_ascii,
            bv_action_programme.action,
            bv_action_impactee.INSTITUTION_PILOTE,
            bv_entreprise_realisation.libelle,
            bv_marche.num_marche,
            bv_marche.IDMarche,
            bv_marche.date_notification_ods
          FROM
            bv_attachement 
          LEFT JOIN bv_realisation ON bv_attachement.id_attachement = bv_realisation.id_attachement 
          LEFT JOIN bv_tache ON bv_realisation.id_tache = bv_tache.id_tache 
          LEFT JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase 
          LEFT JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee 
          LEFT JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
          LEFT JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
          LEFT JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche 
          LEFT JOIN bv_avenant ON bv_avenant.IDMarche = bv_marche.IDMarche 
          LEFT JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code  
          LEFT JOIN bv_entreprise_realisation ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise  
          WHERE bv_attachement.id_attachement = ?`,
          [req.body.id_attachement]
        );



      if (detail.length > 0) {
        const [avenantResult] = await db.promise().query(
          `SELECT num_avenant, date_notif_ods 
           FROM bv_avenant 
           JOIN bv_marche ON bv_avenant.IDMarche = bv_marche.IDMarche
           WHERE bv_marche.IDMarche = ?
           ORDER BY id_Avenant DESC 
           LIMIT 1`,
          [detail[0].IDMarche]
        );
        avenant = avenantResult;
      }

    

      const [realisation] = await db.promise().query(
        `SELECT 
          ROUND(SUM(bv_realisation.volume_realise), 2) AS volume_realise,
          bv_realisation.volume_realise_antr,
          bv_tache.intitule_tache,
          bv_tache.unite_tache,
          bv_tache.id_tache,
          bv_tache.quantite_tache,
          bv_phase.num_phase,
          bv_commune.commune_name_ascii,
          bv_commune.daira_name_ascii,
          bv_action_impactee.LOCALITES,
          bv_action_impactee.Espèces
        FROM 
          bv_tache 
        INNER JOIN bv_realisation ON bv_tache.id_tache = bv_realisation.id_tache
        JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase
        LEFT JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee 
        INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
        INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
        LEFT JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id 
        WHERE bv_realisation.id_attachement = ?
        GROUP BY 
          bv_tache.id_tache,
          bv_realisation.volume_realise_antr,
          bv_tache.intitule_tache,
          bv_tache.unite_tache,
          bv_tache.quantite_tache,
          bv_phase.num_phase
        ORDER BY 
          bv_commune.commune_name_ascii,
          bv_action_impactee.LOCALITES,
          bv_phase.num_phase,
          bv_tache.id_tache;`,
        [req.body.id_attachement]
      );

      const detailAttachement = {
        detail: detail[0],
        realisation: realisation,
        avenant: avenant ? avenant[0] : null,
      };

      res.json(detailAttachement);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getRealisationList = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      // const userId = req.userId;
      let allPosts;
      [allPosts] = await db
        .promise()
        .query(
          `SELECT * FROM bv_realisation left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
          left JOIN bv_phase ON bv_tache.id_phase =bv_phase.id_phase 
          left join bv_action_impactee on bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee 
          left join bv_commune on bv_action_impactee.code_commune = bv_commune.id  
          where bv_realisation.id_attachement=?`,
          [req.body.id_attachement]
        );
      res.json({ allPosts });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const DeleteAttachement = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
     const [update] = await db
        .promise()
        .query(
          `UPDATE bv_realisation SET id_attachement = null where id_attachement=?`,
          [
            req.body.id_attachement
          ]
        );
      if (update.affectedRows > 0) {
        const [ Delete ] =await db
        .promise()
        .query(
          `DELETE from bv_attachement where id_attachement=?`,
          [
            req.body.id_attachement
          ]
        );
        res.json("true");
      } else {
        res.json("false");
      }

      // res.json({ allPosts });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
module.exports = {
  DeleteAttachement,
  getPosts,
  getTacheList,
  addAttachement,
  valideAttachement,
  updateAttachement,
  getAttachementDetails,
  getRealisationList,
};
