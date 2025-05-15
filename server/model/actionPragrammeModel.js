const db = require('../config/connection');
const { verifyJWT } = require('../middleware/verifyJWT');


const getDetailAction=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
        const query = `SELECT * FROM bv_action_pro_programme JOIN bv_action_impactee ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
        JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
        left JOIN bv_geoloclisation ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
        JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
        JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
        JOIN bv_entreprise_realisation ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise 
        WHERE bv_action_impactee.id_action_impactee=?
      `;
  
        const values = [req.body.id_action_impactee];
        const [actionArray1] = await db.promise().query(query, values);
        const actionArray = actionArray1.map((item, index) => {
       const COUT_UNITAIRE =item.COUT_UNITAIRE_VALIDE;
          return {
            ...item,
            COUT_UNITAIRE,
          };
        });
        const action = actionArray.length > 0 ? actionArray[0] :[];
        const [etude] = await db.promise().query(`SELECT *
        FROM bv_etude 
         where id_action_impactee =${req.body.id_action_impactee}
        `);
    
        res.json({action:action,etude:etude});
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getActionImpact= async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
        const structure = req.structure;
        const wilaya = req.wilaya;
        if(req.body.stat)
        {
       
          const [id_impact] = await db.promise().query(`SELECT bv_action_impactee.id_action_impactee 
          FROM bv_action_pro_programme
          INNER JOIN bv_action_impactee ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
          INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
          LEFT JOIN bv_geoloclisation ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
          INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
          INNER JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
          LEFT JOIN bv_entreprise_realisation ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise 
          WHERE  bv_action_pro_programme.id_programme =${req.body.id} 
          AND bv_action_impactee.AXE='${req.body.search_obj.Axe}'
          AND bv_action_impactee.id_pro_action_programme  =${req.body.search_obj.action.id_pro_action_pro}
          AND bv_action_impactee.code_wilaya ='${req.body.search_obj.wilaya}'
          AND bv_action_impactee.code_commune =${req.body.search_obj.commune}
          AND bv_action_impactee.LOCALITES ='${req.body.search_obj.LOCALITES}'
          `);

          res.json(id_impact);
        }
        else
        {
          if(req.body.search_obj)
          {   
          console.log('replay to the front ;')
          const [actionPragrammeImp] = await db.promise().query(`SELECT * 
          FROM bv_action_pro_programme
          INNER JOIN bv_action_impactee ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
          INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
          LEFT JOIN bv_geoloclisation ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
          INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
          INNER JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
          LEFT JOIN bv_entreprise_realisation ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise 
          WHERE  bv_action_pro_programme.id_marche =${req.body.search_obj.IDMarche} 
          AND bv_action_impactee.AXE='${req.body.search_obj.Axe}'
          AND bv_action_impactee.id_pro_action_programme  =${req.body.search_obj.action.id_pro_action_pro}
          AND bv_action_impactee.code_wilaya ='${req.body.search_obj.wilaya}'
          AND bv_action_impactee.code_commune =${req.body.search_obj.commune}
          `);
          const updatedActionPragrammeImp = actionPragrammeImp.map((item, index) => {
            const COUT_UNITAIRE = item.COUT_UNITAIRE_VALIDE
            return {
              ...item,
              COUT_UNITAIRE,
            };
          });

          res.json(updatedActionPragrammeImp);
           }
          else{
            if(structure==='DGF')
          {
            const [AllactionImp] = await db.promise().query(`SELECT * 
          FROM bv_action_pro_programme
          INNER JOIN bv_action_impactee ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
          INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
          INNER join bv_composante on bv_action_programme.id_composante= bv_composante.id_composante
          LEFT JOIN bv_geoloclisation ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
          INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
          INNER JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
          LEFT JOIN bv_entreprise_realisation ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise 
          where bv_action_pro_programme.id_marche =? order by bv_wilaya.wilaya_code
          `,[req.body.id]);
          res.json(AllactionImp)
          }
          else 
          {  
          const [AllactionImp] = await db.promise().query(`SELECT * 
          FROM bv_action_pro_programme
          INNER JOIN bv_action_impactee ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
          INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme  = bv_action_pro_programme.id_action_programme  
          LEFT JOIN bv_geoloclisation ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
          INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
          INNER JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
          LEFT JOIN bv_entreprise_realisation ON bv_action_impactee.id_entreprise_realisation = bv_entreprise_realisation.ID_entreprise 
          where bv_action_pro_programme.id_marche =?
          and bv_action_impactee.code_wilaya =? order by bv_wilaya.wilaya_code
          `,[req.body.id,wilaya]);
          res.json(AllactionImp)}
        
        }

        }
   
    
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const getActionImpactCpt=async(req,res)=>{
  await verifyJWT(req, res, async () => {
    try {
  const wilaya = req.wilaya;
const structure = req.structure;
const ids = req.body.selectedAction.map(item => item.value);
let select;
if(structure=="DGF")
  {
    [select] = await db.promise().query(`
      SELECT bv_action_impactee.id_action_impactee ,bv_action_programme.action,bv_action_impactee.localites,bv_commune.commune_name_ascii
      FROM bv_action_programme
      join bv_composante on bv_action_programme.id_composante=bv_composante.id_composante
      join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme
      join bv_action_impactee on bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro 
      join bv_commune on bv_action_impactee.code_commune =bv_commune.id
      WHERE id_pro_action_programme IN (${ids.join(', ')})
        AND num_cpt is null
        order by code_wilaya,INSTITUTION_PILOTE
  `);
  }
 else{
  [select] = await db.promise().query(`
    SELECT bv_action_impactee.id_action_impactee ,bv_action_programme.action,bv_action_impactee.localites,bv_commune.commune_name_ascii
    FROM bv_action_programme
    join bv_composante on bv_action_programme.id_composante=bv_composante.id_composante
    join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme
    join bv_action_impactee on bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro 
    join bv_commune on bv_action_impactee.code_commune =bv_commune.id
    WHERE id_pro_action_programme IN (${ids.join(', ')})
      AND code_wilaya = ?
      AND INSTITUTION_PILOTE = ?
      AND num_cpt is null
      
`, [wilaya, structure]);
 }
   
    res.json(select)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
}
const getCpt=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () =>{
      const wilaya=req.wilaya;
      const structure=req.structure
      let cpt
      
      if(structure=="DGF")
        {
          if(req.body.search.action!="" || req.body.search.wilaya!=""  )
          {
            if(req.body.search.wilaya!="" && req.body.search.action=="")
            {
              [cpt] = await db.promise().query(`
                SELECT 
                    GROUP_CONCAT(DISTINCT a.id_action_impactee ORDER BY a.id_action_impactee ASC SEPARATOR ', ') AS id_action_impactee,
                    a.num_cpt,
                    c.pdf,
                    bv_wilaya.wilaya_name_ascii AS Wilaya,  -- Unique selection of wilaya
                    GROUP_CONCAT(DISTINCT CONCAT(bv_commune.commune_name_ascii, ': ', a.LOCALITES) ORDER BY bv_commune.commune_name_ascii ASC SEPARATOR ', ') AS LocalitesGroup
                FROM 
                    bv_action_impactee a
                JOIN 
                    bv_action_pro_programme app ON app.id_pro_action_pro = a.id_pro_action_programme
                JOIN 
                    bv_wilaya ON a.code_wilaya = bv_wilaya.wilaya_code 
                JOIN 
                    bv_commune ON a.code_commune = bv_commune.id 
                JOIN 
                    bv_cpt c ON c.id_cpt = a.num_cpt
                WHERE 
                    a.num_cpt IS NOT NULL 
                    AND app.id_marche = ? 
                    AND bv_wilaya.wilaya_code = ?
                GROUP BY 
                    a.num_cpt, bv_wilaya.wilaya_name_ascii
            `, [req.body.idmarche, req.body.search.wilaya]);
            
            }

            if(req.body.search.wilaya=="" && req.body.search.action!="")
              {
                [cpt] = await db.promise().query(`
                  SELECT 
                      GROUP_CONCAT(DISTINCT a.id_action_impactee ORDER BY a.id_action_impactee ASC SEPARATOR ', ') AS id_action_impactee,
                      a.num_cpt,
                      c.pdf,
                      bv_wilaya.wilaya_name_ascii AS Wilaya,  -- Unique selection of the wilaya
                      GROUP_CONCAT(DISTINCT CONCAT(bv_commune.commune_name_ascii, ': ', a.LOCALITES) ORDER BY bv_commune.commune_name_ascii ASC SEPARATOR ', ') AS LocalitesGroup
                  FROM 
                      bv_action_impactee a
                  JOIN 
                      bv_action_pro_programme app ON app.id_pro_action_pro = a.id_pro_action_programme
                  JOIN 
                      bv_wilaya ON a.code_wilaya = bv_wilaya.wilaya_code 
                  JOIN 
                      bv_commune ON a.code_commune = bv_commune.id 
                  JOIN 
                      bv_cpt c ON c.id_cpt = a.num_cpt
                  WHERE 
                      a.num_cpt IS NOT NULL 
                      AND app.id_marche = ? 
                      AND app.id_action_programme = ?
                  GROUP BY 
                      a.num_cpt, bv_wilaya.wilaya_name_ascii
              `, [req.body.idmarche, req.body.search.action.IDaction_programme]);
              }

              if(req.body.search.wilaya!="" && req.body.search.action!="")
                {
                  [cpt] = await db.promise().query(`
                    SELECT 
                        GROUP_CONCAT(DISTINCT a.id_action_impactee ORDER BY a.id_action_impactee ASC SEPARATOR ', ') AS id_action_impactee,
                        a.num_cpt,
                        c.pdf,
                        bv_wilaya.wilaya_name_ascii AS Wilaya,  -- Unique selection of wilaya
                        GROUP_CONCAT(DISTINCT CONCAT(bv_commune.commune_name_ascii, ': ', a.LOCALITES) ORDER BY bv_commune.commune_name_ascii ASC SEPARATOR ', ') AS LocalitesGroup
                    FROM 
                        bv_action_impactee a
                    JOIN 
                        bv_action_pro_programme app ON app.id_pro_action_pro = a.id_pro_action_programme
                    JOIN 
                        bv_wilaya ON a.code_wilaya = bv_wilaya.wilaya_code 
                    JOIN 
                        bv_commune ON a.code_commune = bv_commune.id 
                    JOIN 
                        bv_cpt c ON c.id_cpt = a.num_cpt
                    WHERE 
                        a.num_cpt IS NOT NULL 
                        AND app.id_marche = ? 
                        AND app.id_action_programme = ? 
                        AND bv_wilaya.wilaya_code = ?
                    GROUP BY 
                        a.num_cpt, bv_wilaya.wilaya_name_ascii
                `, [req.body.idmarche, req.body.search.action.IDaction_programme, req.body.search.wilaya]);
                
                }
       
          }
          else
          {
            [cpt] = await db.promise().query(`
              SELECT 
                  GROUP_CONCAT(DISTINCT a.id_action_impactee ORDER BY a.id_action_impactee ASC SEPARATOR ', ') AS id_action_impactee,
                  a.num_cpt,
                  c.pdf,
                  bv_wilaya.wilaya_name_ascii AS Wilaya,  -- Sélection unique de la wilaya
                  GROUP_CONCAT(DISTINCT CONCAT(bv_commune.commune_name_ascii, ': ', a.LOCALITES) ORDER BY bv_commune.commune_name_ascii ASC SEPARATOR ', ') AS LocalitesGroup
              FROM 
                  bv_action_impactee a
              JOIN 
                  bv_action_pro_programme app ON app.id_pro_action_pro = a.id_pro_action_programme
              JOIN 
                  bv_wilaya ON a.code_wilaya = bv_wilaya.wilaya_code 
              JOIN 
                  bv_commune ON a.code_commune = bv_commune.id 
              JOIN 
                  bv_cpt c ON c.id_cpt = a.num_cpt
              WHERE 
                  a.num_cpt IS NOT NULL AND app.id_marche = ?
              GROUP BY 
                  a.num_cpt, bv_wilaya.wilaya_name_ascii
          `, [req.body.idmarche]);
          }
        
        
      
      
        }
      else{
        if(structure=="FORETS")
        {
          [cpt] = await db.promise().query(`SELECT 
            GROUP_CONCAT(DISTINCT a.id_action_impactee ORDER BY a.id_action_impactee ASC SEPARATOR ', ') as id_action_impactee,
            a.num_cpt,c.pdf,
            GROUP_CONCAT(DISTINCT a.LOCALITES ORDER BY a.LOCALITES ASC SEPARATOR ', ') AS LocalitesGroup
            FROM bv_action_impactee a
            JOIN bv_action_pro_programme app ON app.id_pro_action_pro = a.id_pro_action_programme
            join bv_cpt c on c.id_cpt=a.num_cpt
            WHERE a.code_wilaya = ? AND a.num_cpt is not null  AND app.id_marche = ?
            GROUP BY a.num_cpt`,[wilaya,req.body.idmarche]);
        }
        else{
          [cpt] = await db.promise().query(`SELECT 
            GROUP_CONCAT(DISTINCT a.id_action_impactee ORDER BY a.id_action_impactee ASC SEPARATOR ', ') as id_action_impactee,
            a.num_cpt,c.pdf,
            GROUP_CONCAT(DISTINCT a.LOCALITES ORDER BY a.LOCALITES ASC SEPARATOR ', ') AS LocalitesGroup
            FROM bv_action_impactee a
            JOIN bv_action_pro_programme app ON app.id_pro_action_pro = a.id_pro_action_programme
            join bv_cpt c on c.id_cpt=a.num_cpt
            WHERE a.code_wilaya = ? AND a.num_cpt is not null AND a.INSTITUTION_PILOTE = ?  AND app.id_marche = ?
            GROUP BY a.num_cpt`,[wilaya,structure,req.body.idmarche]);
        }
       
      }

      for (let objet of cpt) {
        const idActionImpacteeArray = objet.id_action_impactee.split(', ');
        const idActionImpactee = idActionImpacteeArray[0];
        let [taches] = await db.promise().query(`SELECT bv_tache.id_tache,bv_tache.intitule_tache, bv_tache.unite_tache, bv_tache.prix_ht_tache, bv_phase.num_phase
        FROM bv_tache
        JOIN bv_phase ON bv_phase.id_phase = bv_tache.id_phase
        WHERE bv_phase.id_action_impactee =?`,[idActionImpactee]);
        for (let tache of taches) {
          const { intitule_tache } = tache;
          const [idtache] = await db.promise().query(`
              SELECT t.id_tache,t.quantite_tache
              FROM bv_tache t
              JOIN bv_phase p ON t.id_phase = p.id_phase
              JOIN bv_action_impactee ai ON p.id_action_impactee = ai.id_action_impactee
              WHERE t.intitule_tache = ? AND ai.id_action_impactee IN (${idActionImpacteeArray.join(',')});
          `, [intitule_tache]);
       
          tache.id_taches = idtache ? idtache : null;
      }

        objet.taches = taches; 
        let [action]=await db.promise().query(` SELECT DISTINCT bv_action_programme.action from bv_action_programme
                                           join bv_action_pro_programme on bv_action_pro_programme.id_action_programme=bv_action_programme.IDaction_programme  
                                           join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme 
                                            WHERE bv_action_impactee.id_action_impactee IN (${idActionImpacteeArray.join(',')})`)
         objet.action=action
        }
   
      res.json(cpt);

    })

}
catch (error) {
  console.error(error);
  res.status(500).json({ error: 'An error occurred' });
}}
const updateCpt = async (req, res) => {
  try {
      await verifyJWT(req, res, async () => {
          const wilaya = req.wilaya;
          const structure = req.structure;
          const taches = req.body.id_taches;

          for (let tache of taches) {
              const { intitule_tache, unite_tache, prix_ht_tache } = req.body;
              const montant_global = req.body.prix_ht_tache * tache.quantite_tache;
              const id_tache = tache.id_tache;

              const [result] = await db.promise().query(`
                  UPDATE bv_tache 
                  SET intitule_tache = ?, unite_tache = ?, prix_ht_tache = ?, montant_global = ?
                  WHERE id_tache = ?
              `, [intitule_tache, unite_tache, prix_ht_tache, montant_global, id_tache]);
          }

          res.json({rep:'true',cpt:req.body});
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
  }
};
const DeleteCpt = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const ids_action_impactee = req.body.id_action_impactee.split(',').map(id => parseInt(id.trim()));
      for (const id of ids_action_impactee) {
        const [selectRealisation] = await db.promise().query(`
          SELECT * FROM bv_realisation
          JOIN bv_tache ON bv_tache.id_tache = bv_realisation.id_tache
          JOIN bv_phase ON bv_tache.id_phase = bv_phase.id_phase 
          JOIN bv_action_impactee ON bv_phase.id_action_impactee = bv_action_impactee.id_action_impactee
          WHERE bv_action_impactee.id_action_impactee = ?
        `, [id]);

        if (selectRealisation.length > 0) {
          return res.status(400).json({ message: 'exist real' });
        } else {
          const [deleteTaches] = await db.promise().query(`
          DELETE FROM bv_tache
          WHERE id_phase IN (SELECT id_phase FROM bv_phase WHERE id_action_impactee = ?)
        `, [id]);
        const [deletePhase] = await db.promise().query('DELETE FROM bv_phase WHERE id_action_impactee = ?', [id]);
         const [updateimpact]=await db.promise().query(`update bv_action_impactee set num_cpt=null where id_action_impactee=? `,[id])
        }
      }
      res.json({ message: `true` });
    });
  } catch (error) {
    console.error('Error deleting action impactee:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression' });
  }
};
const addActionMarche=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
        for (const action of req.body.selected)
        {
          const query2 = 'INSERT INTO bv_action_pro_programme(id_marche ,id_action_programme) VALUES (?,?)';
          const values2 = [req.body.id_marche,action.IDaction_programme];
          const [insert2] = await db.promise().query(query2, values2);
          if (insert2.affectedRows === 0) {
            res.json('erreur');
          }
     
        }
        res.json('true');
    
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const deleteActionMarche=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
          const query2 = 'delete from bv_action_pro_programme where id_pro_action_pro=?';
          const values2 = [req.body.id_pro_action_pro];
          const [Delete] = await db.promise().query(query2, values2);
          if (Delete.affectedRows == 1) {
            res.json('true');
          }
          else {
            res.json('false');
          }
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const deleteActionImpct=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
          const query2 = 'delete from bv_action_impactee where id_action_impactee=?';
          const values2 = [req.body.id_action_impactee];
          const [Delete] = await db.promise().query(query2, values2);
          if (Delete.affectedRows == 1) {
            res.json('true');
          }
          else {
            res.json('false');
          }
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const addActionProgramme=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
        const values = [req.body.action_p.action,req.body.action_p.composante_madr];
        const selectquery="select * from bv_action_programme where action=? and id_composante =? "
        const [select] = await db.promise().query(selectquery,values)
        if(select.length>0)
        {
          res.json('exist');
        }
        else{
          const query = 'INSERT INTO bv_action_programme(action,id_composante ) VALUES (?,?)';
      
          const [insert] = await db.promise().query(query, values);
          if (insert.affectedRows === 1) {
           res.json('true');
         } else {
           res.json('false');
         }
        }

      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getListWilayaFillter=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya=req.wilaya;
      let query
      let values
      try {
       if(structure=="DGF" || structure=="BNEDER")
       {
         query = (`SELECT DISTINCT bv_wilaya.wilaya_code,bv_wilaya.wilaya_name_ascii FROM bv_wilaya 
         join bv_action_impactee on bv_action_impactee.code_wilaya =bv_wilaya.wilaya_code 
         join bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
         join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme
         join bv_composante on bv_composante.id_composante=bv_action_programme.id_composante
         where bv_composante.composante_mdr=? and bv_action_impactee.AXE=?
         and bv_action_programme.action=?
         and bv_action_pro_programme.id_marche=?
         GROUP by bv_wilaya.wilaya_code`);
        values = [req.body.Composante,req.body.Axe,req.body.action.action,req.body.IDMarche];
       }
       else
       {
        query = (`SELECT DISTINCT bv_wilaya.wilaya_code,bv_wilaya.wilaya_name_ascii 
                 FROM bv_wilaya where bv_wilaya.wilaya_code=?`);
          values = [req.wilaya];
       }

         const [wilaya]=  await db.promise().query(query,values)
     
        const wilaya_list = [];
        for (const wilayaa of wilaya)
        {
          const wil = {
            value: wilayaa.wilaya_code,
            label: wilayaa.wilaya_name_ascii	,
        };
     
        wilaya_list.push(wil);
        }
        res.json(wilaya_list);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getListCommuneFillter = async (req, res) => {
  try {
    const structure = req.structure;
    const wilaya = req.wilaya;
    let query;
    let values;

    await verifyJWT(req, res, async () => {
      try {

        if (structure === "DGF" || structure === "BNEDER") {
          query = `
            SELECT DISTINCT bv_commune.id, bv_commune.commune_name_ascii 
            FROM bv_commune
            JOIN bv_action_impactee ON bv_action_impactee.code_commune = bv_commune.id 
            JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
            JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
            JOIN bv_composante ON bv_action_programme.id_composante = bv_composante.id_composante
            WHERE bv_composante.composante_mdr = ?
              AND bv_action_impactee.AXE = ?
              AND bv_action_programme.action = ?
              AND bv_commune.wilaya_code = ?
              AND bv_action_pro_programme.id_marche = ?;
          `;
          values = [
            req.body.Composante,
            req.body.Axe,
            req.body.action.action,
            req.body.wilaya,
            req.body.IDMarche
          ];
        } else if (structure === "FORETS") {
  
          query = `
            SELECT DISTINCT bv_commune.id, bv_commune.commune_name_ascii 
            FROM bv_commune
            JOIN bv_action_impactee ON bv_action_impactee.code_commune = bv_commune.id 
            JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
            JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
            JOIN bv_composante ON bv_action_programme.id_composante = bv_composante.id_composante
            WHERE bv_composante.composante_mdr = ?
              AND bv_action_impactee.AXE = ?
              AND bv_action_impactee.id_pro_action_programme = ?
              AND bv_commune.wilaya_code = ?;
          `;
          values = [
            req.body.Composante,
            req.body.Axe,
            req.body.action.id_pro_action_pro,
            req.body.wilaya
          ];
        } else {
          query = `
            SELECT DISTINCT bv_commune.id, bv_commune.commune_name_ascii 
            FROM bv_commune
            JOIN bv_action_impactee ON bv_action_impactee.code_commune = bv_commune.id 
            JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
            JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
            JOIN bv_composante ON bv_action_programme.id_composante = bv_composante.id_composante
            WHERE bv_composante.composante_mdr = ?
              AND bv_action_impactee.AXE = ?
              AND bv_action_programme.action = ?
              AND bv_commune.wilaya_code = ?
              AND bv_action_impactee.INSTITUTION_PILOTE = ?
              AND bv_action_pro_programme.id_marche = ?;
          `;
          values = [
            req.body.Composante,
            req.body.Axe,
            req.body.action.action,
            req.body.wilaya,
            structure,
            req.body.IDMarche
          ];
        }

        const [commune] = await db.promise().query(query, values);
        console.log(commune);
        const commune_list = commune.map(com => ({
          value: com.id,
          label: com.commune_name_ascii
        }));
        res.json(commune_list);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getListLocaliteFillter=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
        let query
        let values
        const structure = req.structure;
        if(structure=="DGF"|| structure=="bneder" || structure== "CF")
        {
       
           query =`SELECT DISTINCT  bv_action_impactee.LOCALITES  from bv_action_impactee
           join bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
           join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme
           where bv_action_impactee.code_commune =? and bv_action_impactee.AXE=? and bv_action_programme.action=?`;
            values = [req.body.commune,req.body.Axe,req.body.action.action];

        }
        else
        {
     
            query =`SELECT DISTINCT  bv_action_impactee.LOCALITES  from bv_action_impactee
            join bv_action_pro_programme on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
            join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme
            where code_commune =? and bv_action_impactee.INSTITUTION_PILOTE=? and AXE=? and bv_action_programme.action=?`;
             values = [req.body.commune,structure,req.body.Axe,req.body.action.action];
         
      
        }
    
        const [localites] = await db.promise().query(query, values);
        const localites_list = [];
        for (const com of localites)
        {
            const loc = {
            value: com.LOCALITES,
            label: com.LOCALITES
            };
            localites_list.push(loc);
        }
        res.json(localites_list);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getListWilaya=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
        const [wilaya] = await db.promise().query(`SELECT * FROM bv_wilaya `);
        const wilaya_list = [];
        for (const wilayaa of wilaya)
        {
          const wil = {
            value: wilayaa.wilaya_code,
            label: wilayaa.wilaya_name_ascii	,
        };
     
        wilaya_list.push(wil);
        }
        res.json(wilaya_list);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getListCommune=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
        let query;
        let values ;
        const structure = req.structure;
        const wilaya = req.wilaya;
 
        if (structure=="DGF" || structure=="BNEDER" || structure== "MINISTRE" || structure== "SG" ||structure== "DGPA")
          { 
         
         query = 'SELECT * FROM bv_commune where wilaya_code=? ';
         values = [req.body.wilaya_code];
       
      }else if(structure=="FORETS")
      {
        query = 'SELECT * FROM bv_commune where wilaya_code=? ';
        values = [wilaya];
      }
      else{
        query = 'SELECT * FROM bv_commune join bv_action_impactee on bv_commune.code_commune=bv_action_impactee.code_commune where wilaya_code=? and INSTITUTION_PILOTE=?';
        values = [wilaya,structure];
      }
      const [commune] = await db.promise().query(query, values);
      const commune_list = [];
      for (const com of commune)
      {
          const comWil = {
            code:com.commune_code,
          value: com.id,
          label: com.commune_name_ascii
          };
      commune_list.push(comWil);

      }
      res.json(commune_list);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getListActionMarche=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {
        const query = `SELECT *  FROM bv_action_programme 
        join bv_composante on bv_composante.id_composante = bv_action_programme.id_composante
        join bv_action_pro_programme on bv_action_programme.IDaction_programme=bv_action_pro_programme.id_action_programme 
        where bv_action_pro_programme.id_marche=? `;
        const values = [req.body.idmarche];
        const [action] = await db.promise().query(query, values);
        //const result = action.map(result => result.action);
        res.json(action);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getListAction=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya = req.wilaya;
      try {
  
        if(req.body.idmarche)
        {    
           if(req.body.marche)
           {
           
            const query = `
            SELECT DISTINCT action, composante_mdr ,IDaction_programme
            FROM bv_action_programme
            JOIN bv_composante ON bv_composante.id_composante = bv_action_programme.id_composante 
            JOIN bv_action_pro_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
            WHERE id_action_programme NOT IN (
                SELECT DISTINCT id_action_programme 
                FROM bv_action_programme
                JOIN bv_composante ON bv_composante.id_composante = bv_action_programme.id_composante 
                JOIN bv_action_pro_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
                WHERE id_marche = ?
            )
          `;
          
          const values = [req.body.idmarche];
          
            const [action] = await db.promise().query(query, values);
            res.json(action);
           }
           else{
            const query = `SELECT DISTINCT * FROM bv_action_programme
            join bv_composante on bv_composante.id_composante = bv_action_programme.id_composante`;
            const values = [req.body.idmarche];
            const [action] = await db.promise().query(query, values);
            res.json(action);
           }
    
        }
        else 
        {
          if(req.body.cpt)
          {
            if(structure==="DGF")
              {
                const query = ` SELECT DISTINCT bv_action_programme.action,bv_composante.composante_mdr, bv_action_pro_programme.id_pro_action_pro  
                FROM bv_action_programme
                join bv_composante on bv_action_programme.id_composante=bv_composante.id_composante
                join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme
                join bv_action_impactee on bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro 
                and bv_action_pro_programme.id_marche=? 
               `
                const [action] = await db.promise().query(query,[req.body.id_marche]);
                res.json(action);
              }
            else
            if(structure==="FORETS")
              {

                const query = ` SELECT DISTINCT bv_action_programme.action,bv_composante.composante_mdr, bv_action_pro_programme.id_pro_action_pro  
                FROM bv_action_programme
                join bv_composante on bv_action_programme.id_composante=bv_composante.id_composante
                join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme
                join bv_action_impactee on bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro 
                where bv_action_impactee.code_wilaya =?
                and bv_action_pro_programme.id_marche=? 
               `
                const [action] = await db.promise().query(query,[wilaya,req.body.id_marche]);
                res.json(action);
              }else{
                const query = ` SELECT DISTINCT bv_action_programme.action,bv_composante.composante_mdr, bv_action_pro_programme.id_pro_action_pro  
                FROM bv_action_programme
                join bv_composante on bv_action_programme.id_composante=bv_composante.id_composante
                join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme
                join bv_action_impactee on bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro 
                where bv_action_impactee.code_wilaya =?
                and bv_action_impactee.INSTITUTION_PILOTE=?
                and bv_action_pro_programme.id_marche=? 
               `
                const [action] = await db.promise().query(query,[wilaya,structure,req.body.id_marche]);
                res.json(action);
              }
           
          }
          else 
          {
            const query = `SELECT DISTINCT bv_action_programme.action,bv_composante.composante_mdr, bv_action_programme.IDaction_programme 
            FROM bv_action_programme join bv_composante where bv_action_programme.id_composante=bv_composante.id_composante`
            const [action] = await db.promise().query(query);
            res.json(action);
          }      
      }
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getListActionProgFillter=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya=req.wilaya;
      try {
        let query
        let values
        if(req.body.attachement)
        {
          if(structure == "DGF" || structure == "BNEDER")
            {
              query=`SELECT  bv_action_programme.action,bv_action_pro_programme.id_pro_action_pro ,bv_action_programme.IDaction_programme FROM bv_action_programme 
              join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme 
              join bv_action_impactee on bv_action_impactee.id_pro_action_programme =bv_action_pro_programme.id_pro_action_pro 
              where bv_action_pro_programme.id_marche =?
              group by bv_action_programme.action
             `;
              values=[req.body.id];
            }
            else{
              query=`SELECT  bv_action_programme.action,bv_action_pro_programme.id_pro_action_pro ,bv_action_programme.IDaction_programme FROM bv_action_programme 
              join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme 
              join bv_action_impactee on bv_action_impactee.id_pro_action_programme =bv_action_pro_programme.id_pro_action_pro 
              where bv_action_pro_programme.id_marche =?
              and bv_action_impactee.INSTITUTION_PILOTE=?
              group by bv_action_programme.action
             `;
              values=[req.body.id,structure];
            }

        }
        else{
        if(structure == "DGF" || structure == "BNEDER")
        {
          query = `SELECT  bv_action_programme.action,bv_action_pro_programme.id_pro_action_pro ,bv_action_programme.IDaction_programme FROM bv_action_programme 
          join bv_composante on bv_action_programme.id_composante=bv_composante.id_composante
          join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme 
          join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme 
          where bv_composante.composante_mdr=? and bv_action_pro_programme.id_marche =?
          group by bv_action_programme.action
         `;
          values = [req.body.composante,req.body.id];
        }
        else{
          if(structure=="FORETS")
          {
            query = `SELECT distinct bv_action_programme.action, bv_action_pro_programme.id_pro_action_pro, bv_action_programme.IDaction_programme 
            FROM bv_action_programme
            JOIN bv_composante ON bv_action_programme.id_composante = bv_composante.id_composante 
            JOIN bv_action_pro_programme ON bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme 
            JOIN bv_action_impactee ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme 
            WHERE bv_composante.composante_mdr = ?
            AND bv_action_pro_programme.id_marche = ?
            AND bv_action_impactee.code_wilaya = ?
            ;
            
           `;
            values = [req.body.composante,req.body.id,wilaya];
          }
          else
          {
            query = `SELECT  bv_action_programme.action,bv_action_pro_programme.id_pro_action_pro ,bv_action_programme.IDaction_programme FROM bv_action_programme 
            join bv_action_pro_programme on bv_action_pro_programme.id_action_programme = bv_action_programme.IDaction_programme 
            JOIN bv_composante ON bv_action_programme.id_composante = bv_composante.id_composante
            join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme 
            where  bv_composante.composante_mdr=? and bv_action_pro_programme.id_marche =?
            and bv_action_impactee.INSTITUTION_PILOTE=?
            and bv_action_impactee.code_wilaya =?
            group by bv_action_programme.action
            `;
            
           values = [req.body.composante,req.body.id,structure,wilaya];
          }
        }
        }

        const [action] = await db.promise().query(query, values);
        res.json(action);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getDictionnaireComposant=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
     
      try {
       const [select]= await db.promise().query(`select * from bv_composante`)
       const composante_list = [];
       for (const com of select) 
       {
         const comp = {
           value: com.id_composante,
           label: com.composante_mdr,
       };
       composante_list.push(comp);
       }
        res.json(composante_list);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const addComposante=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
     
  
      try {
       const [insert]= await db.promise().query(`insert into bv_composante (composante_mdr) values(?)`,[req.body.composante_madr])
        if(insert.affectedRows==1)
          {
            res.json("true");
          }
        else
        {
          res.json("false");
        }
       
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

const getListComposant=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya=req.wilaya;
      
      let query;
      let values;
      try {
        if(structure=="DGF"|| structure=="BNEDER")
        {
          query = `SELECT DISTINCT bv_composante.composante_mdr FROM bv_action_impactee 
                       join bv_action_pro_programme on bv_action_impactee.id_pro_action_programme  = bv_action_pro_programme.id_pro_action_pro 
                       join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
                       join bv_composante on bv_action_programme.id_composante=bv_composante.id_composante
                       where bv_action_impactee.AXE=? and
                       bv_action_pro_programme.id_marche=?`;
                  values = [req.body.Axe,req.body.id];
        }else{
          if(structure==="FORETS")
          {
            query = `SELECT DISTINCT bv_composante.composante_mdr 
            FROM bv_action_impactee 
            JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro 
            JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme 
            JOIN bv_composante ON bv_action_programme.id_composante = bv_composante.id_composante
            WHERE bv_action_impactee.AXE = ? 
              AND bv_action_pro_programme.id_marche = ? 
              AND bv_action_impactee.code_wilaya = ?`;
          values = [req.body.Axe,req.body.id,wilaya];
          }
          else{
            query = `SELECT DISTINCT bv_composante.composante_mdr FROM bv_action_impactee 
            join bv_action_pro_programme on bv_action_impactee.id_pro_action_programme  = bv_action_pro_programme.id_pro_action_pro 
            join bv_action_programme on bv_action_programme.IDaction_programme =bv_action_pro_programme.id_action_programme 
            join bv_composante on bv_action_programme.id_composante=bv_composante.id_composante
            where bv_action_impactee.AXE=? and bv_action_impactee.code_wilaya =? and bv_action_impactee.INSTITUTION_PILOTE=? and 
            bv_action_pro_programme.id_marche=?`;
             values = [req.body.Axe,wilaya,structure,req.body.id];
          }
        }
     
        const [composante] = await db.promise().query(query, values);
       //const result = action.map(result => result.action);
       const valuesOnly = composante.map(item => item.composante_mdr);
        res.json(valuesOnly);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const getListEntreReal=async(req,res)=>{
  try {
    await verifyJWT(req, res, async () => {
      try {

        const [entreprise] = await db.promise().query(`SELECT * FROM bv_entreprise_realisation where id_marche=?`,[req.body.idmarche]);

        const entreprise_list = [];
        for (const entr of entreprise)
        {
          const entre = {
            label: entr.libelle,
            value: entr.ID_entreprise	,
        };
        entreprise_list.push(entre);
        }
        res.json(entreprise_list);
      } catch (error) {
        console.error(`Error fetching action programme:`, error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
const addActionImpact = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const structure=req.structure
      const wilaya=req.wilaya
      const selectquery='select id_pro_action_pro from bv_action_pro_programme where id_action_programme=? and id_marche=? '
      const valuess = [req.body.action_imp.id_action_programme,req.body.action_imp.idmarche];
      const [selectid]= await db.promise().query(selectquery,valuess);
      
      if(selectid.length>0)
      { 
        let concatenatedCodes = "";
        if (req.body.selected && req.body.selected.length > 0) {
            concatenatedCodes = req.body.selected.map(obj => obj.code).join('_');
        }
        var VOLUME_VALIDE = parseFloat(req.body.action_imp.VOLUME_VALIDE) ;
        var MONTANT_PREVU_RETENU=VOLUME_VALIDE*parseFloat(req.body.action_imp.COUT_UNITAIRE_VALIDE)||0
        let query;
        let values;
        if(structure=="DGF")
          {
            query = 'INSERT INTO bv_action_impactee(id_pro_action_programme ,id_entreprise_realisation , code_wilaya ,code_commune, LOCALITES,AXE,UNITE,VOLUME_VALIDE,COUT_UNITAIRE_VALIDE,INSTITUTION_PILOTE,	Espèces,Type_étude,dancite,MONTANT_PREVU_RETENU,duree_action) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            values = [selectid[0].id_pro_action_pro,req.body.action_imp.id_entreprise_realisation ,req.body.action_imp.code_wilaya ,req.body.action_imp.code_commune,req.body.action_imp.LOCALITES,req.body.action_imp.AXE,req.body.action_imp.UNITE,req.body.action_imp.VOLUME_VALIDE,req.body.action_imp.COUT_UNITAIRE_VALIDE,req.body.action_imp.INSTITUTION_PILOTE,req.body.action_imp.Espèces,concatenatedCodes,req.body.action_imp.nombre,MONTANT_PREVU_RETENU,req.body.action_imp.duree_action];
          }
        else{
          query = 'INSERT INTO bv_action_impactee(id_pro_action_programme ,id_entreprise_realisation , code_wilaya ,code_commune, LOCALITES,AXE,UNITE,VOLUME_VALIDE,COUT_UNITAIRE_VALIDE,INSTITUTION_PILOTE,Espèces,Type_étude,dancite,MONTANT_PREVU_RETENU,duree_action) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
          values = [selectid[0].id_pro_action_pro,req.body.action_imp.id_entreprise_realisation ,wilaya ,req.body.action_imp.code_commune,req.body.action_imp.LOCALITES,req.body.action_imp.AXE,req.body.action_imp.UNITE,req.body.action_imp.VOLUME_VALIDE,req.body.action_imp.COUT_UNITAIRE_VALIDE,structure,req.body.action_imp.Espèces,concatenatedCodes,req.body.action_imp.nombre,MONTANT_PREVU_RETENU,req.body.action_imp.duree_action];
          } 
        let [insert] = await db.promise().query(query, values);
        if (req.body.selected && req.body.selected.length > 0) {
          for (const obj of req.body.selected) {
          const insertQuery = "INSERT INTO `bv_etude`(`id_action_impactee`, `type_etude`, `cout`) VALUES (?,?,?)";
          const values = [
            insert.insertId,
            obj.code,
            obj.cout*req.body.action_imp.VOLUME_VALIDE
          ];
          const [insertt] = await db.promise().query(insertQuery, values);
        }
        }
      

          res.json('true');
        
      }
    })
  }
   catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
const updateActionImpact = async (req,res)=>{

  try {
    await verifyJWT(req, res, async () => {
      // if(req.body.dencite)
      // {
      //   const updateQuery="UPDATE bv_action_impactee SET dencite=?,VOLUME_VALIDE=?,volume_pv=? WHERE `id_action_impactee`=?";
      //   const values = [req.body.dencite,req.body.VOLUME_VALIDE,req.body.volume_pv,req.body.id_action_impactee];
      //   const [update] = await db.promise().query(updateQuery, values);
     
      //   if (update.affectedRows === 1) {
      //     res.json('true');
      //   } else {
      //     res.json('false');
      //   }
      // }
      // else{
        var VOLUME_VALIDE = parseFloat(req.body.VOLUME_VALIDE);
        var MONTANT_PREVU_RETENU = VOLUME_VALIDE * req.body.COUT_UNITAIRE;
        const updateQuery="UPDATE bv_action_impactee SET dancite=?, id_entreprise_realisation=?,code_wilaya=?,code_commune=?,LOCALITES=?,AXE=?,UNITE=?,COUT_UNITAIRE_VALIDE=?,VOLUME_VALIDE=?,MONTANT_PREVU_RETENU=?,INSTITUTION_PILOTE=?,Espèces=? WHERE `id_action_impactee`=?";
        const values = [req.body.dancite,req.body.id_entreprise_realisation,req.body.wilaya_code,req.body.code_commune,req.body.LOCALITES,req.body.AXE,req.body.UNITE,req.body.COUT_UNITAIRE+",00",req.body.VOLUME_VALIDE,MONTANT_PREVU_RETENU+",00",req.body.INSTITUTION_PILOTE,req.body.Espèces,req.body.id_action_impactee];
        const [update] = await db.promise().query(updateQuery, values);
        if (update.affectedRows === 1) {
          res.json('true');
        } else {
          res.json('false');
        }
     //}
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {DeleteCpt,getActionImpactCpt,getCpt,updateCpt,deleteActionImpct,deleteActionMarche,getListActionMarche,
  addActionMarche,getListComposant,getDetailAction,getActionImpact,addActionProgramme,getListWilaya,getListCommune,getListLocaliteFillter,
  getListEntreReal,getListAction,addActionImpact,updateActionImpact,getListWilayaFillter,getListCommuneFillter,
  getListActionProgFillter,getDictionnaireComposant,addComposante};