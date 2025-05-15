const db = require("../config/connection");
const { verifyJWT } = require("../middleware/verifyJWT");
//..
function formatNumberWithoutRounding(number, decimals) {
  // Shift the decimal point to the right by the desired number of decimal places
  let multiplier = Math.pow(10, decimals);
  let formattedNumber = number * multiplier;

  // Truncate the extra decimal places without rounding
  formattedNumber = Math.floor(formattedNumber) / multiplier;

  return formattedNumber;
}
//..
const realisationBarCharts = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya = req.wilaya;
      const IdMarcher = req.body.selectedMarche.id;
      const selectedButton = req.body.buttonType;
      
    if(req.body.selectedMarche.type_marche=="Réalisation")
    {
        if (structure == "BNEDER" || structure == "DGF" || structure == "SG" || structure == "MINISTRE") {
          if(selectedButton)
            {
              const [actionImpcat] = await db.promise().query(`
               Select * from bv_action_impactee 
               Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
               join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya
               where id_marche=?
              `, [IdMarcher]);
              let montantByWilaya = {};
              let montantByWilayaRealisationNonCom = {};
              for (const action of actionImpcat) {
               const [tacheR] = await db.promise().query(`
                select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
                
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                where id_marche=? and bv_phase.id_action_impactee=?`,[IdMarcher,action.id_action_impactee])
             
                let montantTotalAction = 0
                let montantTotalActionNonRealise=0
                for(const tache of tacheR )
                {
                  const [realisation]=await db.promise().query(`
                    select sum(volume_realise) as totalrealise from bv_realisation
                    where id_tache =? and id_attachement is not null`,[tache.id_tache])
                    const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                     montantTotalAction = totalRealise * tache.prix_ht_tache; // Calculate montant
                
                     if (action.wilaya_name_ascii in montantByWilaya) {
                      montantByWilaya[action.wilaya_name_ascii] += montantTotalAction;
                  } else {
                      montantByWilaya[action.wilaya_name_ascii] = montantTotalAction;
                  } 

                     const [realisationNonCom]=await db.promise().query(`
                      select sum(volume_realise) as totalrealise from bv_realisation
                      where id_tache =?`,[tache.id_tache])
                      const totalNonRealise = realisationNonCom[0]?.totalrealise || 0;
                if(totalNonRealise==0)    
                {
                  montantTotalActionNonRealise += Number(tache.montant_global) || 0;

                  if (action.wilaya_name_ascii in montantByWilayaRealisationNonCom) {
                    montantByWilayaRealisationNonCom[action.wilaya_name_ascii] += montantTotalActionNonRealise;
                } else {
                  montantByWilayaRealisationNonCom[action.wilaya_name_ascii] = montantTotalActionNonRealise;
                } 
                } 

                
                }
             
              //  montantAction.push({montantTotalAction:montantTotalAction,wilaya_name_ascii:action.wilaya_name_ascii});
         


            
              }


              let resultList = [];
              for (const wilaya in montantByWilaya) {
                const[ montantReserveWilaya]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                  join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                  join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                  join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                  where IDMarche=? and bv_wilaya.wilaya_name_ascii=?
                  `, [IdMarcher,wilaya])
                  const totalWilayaAmount = montantReserveWilaya[0]?.mantant_ht ?? 0;

                  const montantWilaya = montantByWilaya[wilaya];
                 
                  const tauxDebut = totalWilayaAmount ? (montantWilaya / totalWilayaAmount)  : 0;

                  resultList.push({
                      tauxTermine: formatNumberWithoutRounding(tauxDebut, 2),
                      wilaya: wilaya
                  });

                }
                  let resultListNonCom = [];
                  for (const wilaya in montantByWilayaRealisationNonCom) {
                    const[ montantReserveWilaya]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                      join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                      join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                      join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                      where IDMarche=? and bv_wilaya.wilaya_name_ascii=?
                      `, [IdMarcher,wilaya])
                      const totalWilayaAmount = montantReserveWilaya[0]?.mantant_ht ?? 0;
    
                      const montantWilaya = montantByWilayaRealisationNonCom[wilaya];
                      const tauxDebut = totalWilayaAmount ? (montantWilaya / totalWilayaAmount)  : 0;
    
                      resultListNonCom.push({
                          tauxNonCom: formatNumberWithoutRounding(tauxDebut, 2),
                          wilaya: wilaya
                      });
                  }                

                  let finalResult = resultList.map(item => {
                    const matchingItem = resultListNonCom.find(nonComItem => nonComItem.wilaya === item.wilaya);
                    const tauxNonCom = matchingItem ? parseFloat(matchingItem.tauxNonCom) : 0;
                    const tauxTermine = parseFloat(item.tauxTermine);
                
                    return {
                        wilaya: item.wilaya,
                        tauxTermine: tauxTermine*100,
                        tauxNonCom: tauxNonCom*100,
                        tauxEnCour: formatNumberWithoutRounding((1-(tauxTermine + tauxNonCom))*100, 2)
                    };
                });
              
              return res.json(finalResult);
              
            }
            else {
              {
                const [actionImpcat] = await db.promise().query(`
                 Select * from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                 join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya
                 where id_marche=?
                `, [IdMarcher]);
                let montantByWilaya = {};
                for (const action of actionImpcat) {
                 const [tacheR] = await db.promise().query(`
                  select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                  join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                  join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
                  
                   Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                  where id_marche=? and bv_phase.id_action_impactee=?`,[IdMarcher,action.id_action_impactee])
                 
                  let montantTotalAction = 0
                  
                  for(const tache of tacheR )
                  {
                    const [realisation]=await db.promise().query(`
                      select 
                        -- Volume réalisé uniquement si id_asf n'est pas null
                      CASE 
                          WHEN bv_attachement.id_asf IS NOT NULL THEN sum(volume_realise)  
                          ELSE 0 
                      END AS totalrealise from bv_realisation
                       LEFT JOIN bv_attachement 
                      ON bv_realisation.id_attachement = bv_attachement.id_attachement
                     where id_tache =?`,[tache.id_tache])
                      const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                       montantTotalAction = totalRealise * tache.prix_ht_tache; // Calculate montant
                       if (action.wilaya_name_ascii in montantByWilaya) {
                        montantByWilaya[action.wilaya_name_ascii] += montantTotalAction;
                    } else {
                        montantByWilaya[action.wilaya_name_ascii] = montantTotalAction;
                    } 
                  }
               
                //  montantAction.push({montantTotalAction:montantTotalAction,wilaya_name_ascii:action.wilaya_name_ascii});
           
                }
  
  
              const[ montantMarche]= await db.promise().query(`select mantant_ht from bv_marche where IDMarche=?
                `, [IdMarcher])
                const totalMarketAmount = montantMarche[0]?.mantant_ht ?? 0;
  
                // Compute percentage for each wilaya
                let resultList = [];
                for (const wilaya in montantByWilaya) {
                    const montantWilaya = montantByWilaya[wilaya];
                    const tauxDebut = totalMarketAmount ? (montantWilaya / totalMarketAmount) * 100 : 0;
                    const tauxFin = 100 - tauxDebut; // Remaining percentage
  
                    resultList.push({
                        tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                        tauxFin: formatNumberWithoutRounding(tauxFin, 2),
                        wilaya: wilaya
                    });
                }
  
                
                return res.json(resultList);
                
              }
          }

          /************************************* */
       
        } else  if (structure === "FORETS" || structure=="WALI") {
 
            if(selectedButton)
              {
                const [actionImpcat] = await db.promise().query(`
                 Select * from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                 join bv_commune on bv_commune.id = bv_action_impactee.code_commune
                 where id_marche=? and bv_action_impactee.code_wilaya=?
                `, [IdMarcher,wilaya]);
                let montantTravauxByCommuneFini = {};
                let montantByCommuneRealisationNonCom = {};
                for (const action of actionImpcat) {
                 const [tacheR] = await db.promise().query(`
                  select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                  join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                  join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
                  
                   Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                  where id_marche=? and bv_phase.id_action_impactee=?`,[IdMarcher,action.id_action_impactee])
               
                  let montantTotalAction = 0
                  let montantTotalActionNonRealise=0
                  for(const tache of tacheR )
                  {
                    const [realisation]=await db.promise().query(`
                      select sum(volume_realise) as totalrealise from bv_realisation
                      where id_tache =? and id_attachement is not null`,[tache.id_tache])
                      const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                       montantTotalAction = totalRealise * tache.prix_ht_tache; // Calculate montant
                  
                       if (action.commune_name_ascii in montantTravauxByCommuneFini) {
                        montantTravauxByCommuneFini[action.commune_name_ascii] += montantTotalAction;
                    } else {
                      montantTravauxByCommuneFini[action.commune_name_ascii] = montantTotalAction;
                    } 
  
                       const [realisationNonCom]=await db.promise().query(`
                        select sum(volume_realise) as totalrealise from bv_realisation
                        where id_tache =?`,[tache.id_tache])
                        const totalNonRealise = realisationNonCom[0]?.totalrealise || 0;
                  if(totalNonRealise==0)    
                  {
                    montantTotalActionNonRealise += Number(tache.montant_global) || 0;
  
                    if (action.commune_name_ascii in montantByCommuneRealisationNonCom) {
                      montantByCommuneRealisationNonCom[action.commune_name_ascii] += montantTotalActionNonRealise;
                  } else {
                    montantByCommuneRealisationNonCom[action.commune_name_ascii] = montantTotalActionNonRealise;
                  } 
                  } 
  
                  
                  }
               
                //  montantAction.push({montantTotalAction:montantTotalAction,wilaya_name_ascii:action.wilaya_name_ascii});
           
  
  
              
                }
  
  
                let resultList = [];
                for (const commune in montantTravauxByCommuneFini) {
                  const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                    join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                    join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                    join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                    where IDMarche=? and bv_commune.commune_name_ascii=?
                    `, [IdMarcher,commune])
                    const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
  
                    const montantCommune = montantTravauxByCommuneFini[commune];
                    const tauxDebut = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;
  
                    resultList.push({
                        tauxTermine: formatNumberWithoutRounding(tauxDebut, 2),
                        commune: commune
                    });
  
                  }
                    let resultListNonCom = [];
                    for (const commune in montantByCommuneRealisationNonCom) {
                      const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                        join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                        join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                          join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                    where IDMarche=? and bv_commune.commune_name_ascii=?
                    `, [IdMarcher,commune])
                        const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
      
                        const montantCommune = montantByCommuneRealisationNonCom[commune];
                        const taux = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;
      
                        resultListNonCom.push({
                            tauxNonCom: formatNumberWithoutRounding(taux, 2),
                            commune: commune
                        });
                    }                
  
                    let finalResult = resultList.map(item => {
                      const matchingItem = resultListNonCom.find(nonComItem => nonComItem.commune === item.commune);
                      const tauxNonCom = matchingItem ? parseFloat(matchingItem.tauxNonCom) : 0;
                      const tauxTermine = parseFloat(item.tauxTermine);
                  
                      return {
                          wilaya: item.commune,
                          tauxTermine: tauxTermine*100,
                          tauxNonCom: tauxNonCom*100,
                          tauxEnCour: formatNumberWithoutRounding((1-(tauxTermine + tauxNonCom))*100, 2)
                      };
                  });
                
                return res.json(finalResult);
                
              }
             else {
               
                  const [actionImpcat] = await db.promise().query(`
                  Select * from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                 join bv_commune on bv_commune.id = bv_action_impactee.code_commune
                 where id_marche=? and bv_action_impactee.code_wilaya=?
                `, [IdMarcher,wilaya]);
                  let montantByCommune = {};
                  for (const action of actionImpcat) {
                   const [tacheR] = await db.promise().query(`
                    select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                    join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                    join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee     
                     Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                    where id_marche=? and bv_phase.id_action_impactee=?`,[IdMarcher,action.id_action_impactee])
                    let montantTotalAction = 0    
                    for(const tache of tacheR )
                    {
                      const [realisation]=await db.promise().query(`
                        select 
                          -- Volume réalisé uniquement si id_asf n'est pas null
                        CASE 
                            WHEN bv_attachement.id_asf IS NOT NULL THEN sum(volume_realise)  
                            ELSE 0 
                        END AS totalrealise from bv_realisation
                         LEFT JOIN bv_attachement 
                        ON bv_realisation.id_attachement = bv_attachement.id_attachement
                       where id_tache =?`,[tache.id_tache])
                        const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                         montantTotalAction= totalRealise * tache.prix_ht_tache; // Calculate montant
                         if (action.commune_name_ascii in montantByCommune) {
                          montantByCommune[action.commune_name_ascii] += montantTotalAction;
                      } else {
                        montantByCommune[action.commune_name_ascii] = montantTotalAction;
                      } 
                    }
                 
                  //  montantAction.push({montantTotalAction:montantTotalAction,wilaya_name_ascii:action.wilaya_name_ascii});
              
                  }
    
                  let resultList = [];
                  for (const commune in montantByCommune) {
                    const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                      join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                      join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                      join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                      where IDMarche=? and bv_commune.commune_name_ascii=?
                      `, [IdMarcher,commune])
                      const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
    
                      const montantCommune = montantByCommune[commune];
                    
                      const tauxpaye = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;

                      resultList.push({
                        tauxDebut: formatNumberWithoutRounding(tauxpaye, 2)*100,
                        tauxFin:formatNumberWithoutRounding(1-tauxpaye, 2)*100,
                          wilaya: commune
                      });
    
                    }
                    return res.json(resultList);    
          }
          /******************************************** */
          } else if(structure=="DSA" || structure=="HCDS") {
          
            if(selectedButton)
              {
                const [actionImpcat] = await db.promise().query(`
                 Select * from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                 join bv_commune on bv_commune.id = bv_action_impactee.code_commune
                 where id_marche=? and bv_action_impactee.code_wilaya=? AND bv_action_impactee.INSTITUTION_PILOTE=?
                `, [IdMarcher,wilaya,structure]);
           
                let montantTravauxByCommuneFini = {};
                let montantByCommuneRealisationNonCom = {};
                for (const action of actionImpcat) {
                 const [tacheR] = await db.promise().query(`
                  select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                  join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                  join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
                  
                   Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                  where id_marche=? and bv_phase.id_action_impactee=?`,[IdMarcher,action.id_action_impactee])
                  
                  let montantTotalAction = 0
                  let montantTotalActionNonRealise=0
                  for(const tache of tacheR )
                  {
                    const [realisation]=await db.promise().query(`
                      select sum(volume_realise) as totalrealise from bv_realisation
                      where id_tache =? and id_attachement is not null`,[tache.id_tache])
                      const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                       montantTotalAction = totalRealise * tache.prix_ht_tache; // Calculate montant
                  
                   if (action.commune_name_ascii in montantTravauxByCommuneFini) {
                        montantTravauxByCommuneFini[action.commune_name_ascii] += montantTotalAction;
                    } else {
                      montantTravauxByCommuneFini[action.commune_name_ascii] = montantTotalAction;
                     } 
  
                       const [realisationNonCom]=await db.promise().query(`
                        select sum(volume_realise) as totalrealise from bv_realisation
                        where id_tache =?`,[tache.id_tache])
                        const totalNonRealise = realisationNonCom[0]?.totalrealise || 0;
                  if(totalNonRealise==0)    
                  {
                    montantTotalActionNonRealise += Number(tache.montant_global) || 0;
  
                    if (action.commune_name_ascii in montantByCommuneRealisationNonCom) {
                      montantByCommuneRealisationNonCom[action.commune_name_ascii] += montantTotalActionNonRealise;
                  } else {
                    montantByCommuneRealisationNonCom[action.commune_name_ascii] = montantTotalActionNonRealise;
                  } 
                  } 
  
                  
                  }
               
                //  montantAction.push({montantTotalAction:montantTotalAction,wilaya_name_ascii:action.wilaya_name_ascii});    
                }
              
                let resultList = [];
                for (const commune in montantTravauxByCommuneFini) {
                  const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                    join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                    join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                    join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                    where IDMarche=? and bv_commune.commune_name_ascii=? AND bv_action_impactee.INSTITUTION_PILOTE=?
                    `, [IdMarcher,commune,structure])
                    const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
  
                    const montantCommune = montantTravauxByCommuneFini[commune];
                    const tauxDebut = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;
  
                    resultList.push({
                        tauxTermine: formatNumberWithoutRounding(tauxDebut, 2),
                        commune: commune
                    });
  
                  }
                    let resultListNonCom = [];
                    for (const commune in montantByCommuneRealisationNonCom) {
                      const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                        join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                        join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                          join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                    where IDMarche=? and bv_commune.commune_name_ascii=?
                    `, [IdMarcher,commune])
                        const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
      
                        const montantCommune = montantByCommuneRealisationNonCom[commune];
                        const taux = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;
      
                        resultListNonCom.push({
                            tauxNonCom: formatNumberWithoutRounding(taux, 2),
                            commune: commune
                        });
                    }                
  
                    let finalResult = resultList.map(item => {
                      const matchingItem = resultListNonCom.find(nonComItem => nonComItem.commune === item.commune);
                      const tauxNonCom = matchingItem ? parseFloat(matchingItem.tauxNonCom) : 0;
                      const tauxTermine = parseFloat(item.tauxTermine);
                  
                      return {
                          wilaya: item.commune,
                          tauxTermine: tauxTermine*100,
                          tauxNonCom: tauxNonCom*100,
                          tauxEnCour: formatNumberWithoutRounding((1-(tauxTermine + tauxNonCom))*100, 2)
                      };
                  });
                
                return res.json(finalResult);
                
              }
             else {
               
                  const [actionImpcat] = await db.promise().query(`
                  Select * from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                 join bv_commune on bv_commune.id = bv_action_impactee.code_commune
                 where id_marche=? and bv_action_impactee.code_wilaya=? and AND bv_action_impactee.INSTITUTION_PILOTE=?
                `, [IdMarcher,wilaya,structure]);
                  let montantByCommune = {};
                  for (const action of actionImpcat) {
                   const [tacheR] = await db.promise().query(`
                    select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                    join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                    join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee     
                     Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                    where id_marche=? and bv_phase.id_action_impactee=?`,[IdMarcher,action.id_action_impactee])
                    let montantTotalAction = 0    
                    for(const tache of tacheR )
                    {
                      const [realisation]=await db.promise().query(`
                        select 
                          -- Volume réalisé uniquement si id_asf n'est pas null
                        CASE 
                            WHEN bv_attachement.id_asf IS NOT NULL THEN sum(volume_realise)  
                            ELSE 0 
                        END AS totalrealise from bv_realisation
                         LEFT JOIN bv_attachement 
                        ON bv_realisation.id_attachement = bv_attachement.id_attachement
                       where id_tache =?`,[tache.id_tache])
                        const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                         montantTotalAction= totalRealise * tache.prix_ht_tache; // Calculate montant
                         if (action.commune_name_ascii in montantByCommune) {
                          montantByCommune[action.commune_name_ascii] += montantTotalAction;
                      } else {
                        montantByCommune[action.commune_name_ascii] = montantTotalAction;
                      } 
                    }
                 
                  //  montantAction.push({montantTotalAction:montantTotalAction,wilaya_name_ascii:action.wilaya_name_ascii});
              
                  }
    
                  let resultList = [];
                  for (const commune in montantByCommune) {
                    const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                      join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                      join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                      join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                      where IDMarche=? and bv_commune.commune_name_ascii=? AND bv_action_impactee.INSTITUTION_PILOTE=?
                      `, [IdMarcher,commune,structure])
                      const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
    
                      const montantCommune = montantByCommune[commune];
                    
                      const tauxpaye = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;

                      resultList.push({
                        tauxDebut: formatNumberWithoutRounding(tauxpaye, 2)*100,
                        tauxFin:formatNumberWithoutRounding(1-tauxpaye, 2)*100,
                          wilaya: commune
                      });
    
                    }
                    return res.json(resultList);    
          }
          /*********************************************** */
          
          }else if(structure=="DGPA")
          {
            if(selectedButton)
              {
                const [actionImpcat] = await db.promise().query(`
                 Select * from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                 join bv_commune on bv_commune.id = bv_action_impactee.code_commune
                 where id_marche=? and bv_action_impactee.code_wilaya=? and (INSTITUTION_PILOTE='DSA' OR INSTITUTION_PILOTE='HCDS')
                `, [IdMarcher,wilaya]);
                let montantTravauxByCommuneFini = {};
                let montantByCommuneRealisationNonCom = {};
                for (const action of actionImpcat) {
                 const [tacheR] = await db.promise().query(`
                  select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                  join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                  join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
                  
                   Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                  where id_marche=? and bv_phase.id_action_impactee=?`,[IdMarcher,action.id_action_impactee])
               
                  let montantTotalAction = 0
                  let montantTotalActionNonRealise=0
                  for(const tache of tacheR )
                  {
                    const [realisation]=await db.promise().query(`
                      select sum(volume_realise) as totalrealise from bv_realisation
                      where id_tache =? and id_attachement is not null`,[tache.id_tache])
                      const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                       montantTotalAction = totalRealise * tache.prix_ht_tache; // Calculate montant
                  
                       if (action.commune_name_ascii in montantTravauxByCommuneFini) {
                        montantTravauxByCommuneFini[action.commune_name_ascii] += montantTotalAction;
                    } else {
                      montantTravauxByCommuneFini[action.commune_name_ascii] = montantTotalAction;
                    } 
  
                       const [realisationNonCom]=await db.promise().query(`
                        select sum(volume_realise) as totalrealise from bv_realisation
                        where id_tache =?`,[tache.id_tache])
                        const totalNonRealise = realisationNonCom[0]?.totalrealise || 0;
                  if(totalNonRealise==0)    
                  {
                    montantTotalActionNonRealise += Number(tache.montant_global) || 0;
  
                    if (action.commune_name_ascii in montantByCommuneRealisationNonCom) {
                      montantByCommuneRealisationNonCom[action.commune_name_ascii] += montantTotalActionNonRealise;
                  } else {
                    montantByCommuneRealisationNonCom[action.commune_name_ascii] = montantTotalActionNonRealise;
                  } 
                  } 
  
                  
                  }
               
                //  montantAction.push({montantTotalAction:montantTotalAction,wilaya_name_ascii:action.wilaya_name_ascii});
           
  
  
              
                }
  
  
                let resultList = [];
                for (const commune in montantTravauxByCommuneFini) {
                  const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                    join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                    join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                    join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                    where IDMarche=? and bv_commune.commune_name_ascii=?
                    `, [IdMarcher,commune])
                    const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
  
                    const montantCommune = montantTravauxByCommuneFini[commune];
                    const tauxDebut = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;
  
                    resultList.push({
                        tauxTermine: formatNumberWithoutRounding(tauxDebut, 2),
                        commune: commune
                    });
  
                  }
                    let resultListNonCom = [];
                    for (const commune in montantByCommuneRealisationNonCom) {
                      const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                        join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                        join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                          join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                    where IDMarche=? and bv_commune.commune_name_ascii=? and (INSTITUTION_PILOTE='DSA' OR INSTITUTION_PILOTE='HCDS')
                    `, [IdMarcher,commune])
                        const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
      
                        const montantCommune = montantByCommuneRealisationNonCom[commune];
                        const taux = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;
      
                        resultListNonCom.push({
                            tauxNonCom: formatNumberWithoutRounding(taux, 2),
                            commune: commune
                        });
                    }                
  
                    let finalResult = resultList.map(item => {
                      const matchingItem = resultListNonCom.find(nonComItem => nonComItem.commune === item.commune);
                      const tauxNonCom = matchingItem ? parseFloat(matchingItem.tauxNonCom) : 0;
                      const tauxTermine = parseFloat(item.tauxTermine);
                  
                      return {
                          wilaya: item.commune,
                          tauxTermine: tauxTermine*100,
                          tauxNonCom: tauxNonCom*100,
                          tauxEnCour: formatNumberWithoutRounding((1-(tauxTermine + tauxNonCom))*100, 2)
                      };
                  });
                
                return res.json(finalResult);
                
              }
             else {
               
                  const [actionImpcat] = await db.promise().query(`
                  Select * from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                 join bv_commune on bv_commune.id = bv_action_impactee.code_commune
                 where id_marche=? and bv_action_impactee.code_wilaya=? and (INSTITUTION_PILOTE='DSA' OR INSTITUTION_PILOTE='HCDS')
                `, [IdMarcher,wilaya]);
                  let montantByCommune = {};
                  for (const action of actionImpcat) {
                   const [tacheR] = await db.promise().query(`
                    select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                    join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                    join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee     
                     Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                    where id_marche=? and bv_phase.id_action_impactee=?`,[IdMarcher,action.id_action_impactee])
                    let montantTotalAction = 0    
                    for(const tache of tacheR )
                    {
                      const [realisation]=await db.promise().query(`
                        select 
                          -- Volume réalisé uniquement si id_asf n'est pas null
                        CASE 
                            WHEN bv_attachement.id_asf IS NOT NULL THEN sum(volume_realise)  
                            ELSE 0 
                        END AS totalrealise from bv_realisation
                         LEFT JOIN bv_attachement 
                        ON bv_realisation.id_attachement = bv_attachement.id_attachement
                       where id_tache =?`,[tache.id_tache])
                        const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                         montantTotalAction= totalRealise * tache.prix_ht_tache; // Calculate montant
                         if (action.commune_name_ascii in montantByCommune) {
                          montantByCommune[action.commune_name_ascii] += montantTotalAction;
                      } else {
                        montantByCommune[action.commune_name_ascii] = montantTotalAction;
                      } 
                    }
                 
                  //  montantAction.push({montantTotalAction:montantTotalAction,wilaya_name_ascii:action.wilaya_name_ascii});
              
                  }
    
                  let resultList = [];
                  for (const commune in montantByCommune) {
                    const[ montantReserveCommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                      join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                      join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                      join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                      where IDMarche=? and bv_commune.commune_name_ascii=? and (INSTITUTION_PILOTE='DSA' OR INSTITUTION_PILOTE='HCDS')
                      `, [IdMarcher,commune])
                      const totalCommuneAmount = montantReserveCommune[0]?.mantant_ht ?? 0;
    
                      const montantCommune = montantByCommune[commune];
                    
                      const tauxpaye = totalCommuneAmount ? (montantCommune / totalCommuneAmount)  : 0;

                      resultList.push({
                        tauxDebut: formatNumberWithoutRounding(tauxpaye, 2)*100,
                        tauxFin:formatNumberWithoutRounding(1-tauxpaye, 2)*100,
                          wilaya: commune
                      });
    
                    }
                    return res.json(resultList);    
          }
          
          }
          
    }
    else{
      let statList = [];
        if (structure == "BNEDER" || structure == "DGF" || structure == "SG" || structure == "MINISTRE")
        {
          if(selectedButton){
              const [actionImpcat] = await db.promise().query(`
              Select * from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya
              where id_marche=?
             `, [IdMarcher]);
            
            let montantByWilayaEtudeCom = {};
            let montantByWilayaEtudeFini = {};
             for (const action of actionImpcat) {
              const [etudeCom] = await db.promise().query(`
               select sum(cout) as montantEtude  FROM bv_etude
                JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
               where bv_action_impactee.id_action_impactee=? and date_lancement is not null`,[action.id_action_impactee])
      
               let montantTotalAction = etudeCom[0].montantEtude
        
             if (action.wilaya_name_ascii in montantByWilayaEtudeCom) {
              montantByWilayaEtudeCom[action.wilaya_name_ascii].montant += montantTotalAction;
          } else {
            montantByWilayaEtudeCom[action.wilaya_name_ascii] = {
                  code_wilaya: action.wilaya_code,
                  montant: montantTotalAction
              };
          }

          const [etudeFini] = await db.promise().query(`
            select sum(cout) as montantEtude  FROM bv_etude
             JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
            where bv_etude.id_action_impactee=? and date_remise_final is not null`,[action.id_action_impactee])
   
            let montantTotalEtudeFini = etudeFini[0].montantEtude
     
          if (action.wilaya_name_ascii in montantByWilayaEtudeFini) {
            montantByWilayaEtudeFini[action.wilaya_name_ascii].montant += montantTotalEtudeFini;
       } else {
        montantByWilayaEtudeFini[action.wilaya_name_ascii] = {
               code_wilaya: action.wilaya_code,
               montant: montantTotalEtudeFini
           };
       }
             }

              // Compute percentage for each wilaya
              let resultListCom = [];
              for (const wilaya in montantByWilayaEtudeCom) {
                const[ montantglobalwilaya]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                  join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                  join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                  join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                  where IDMarche=? and bv_wilaya.wilaya_name_ascii=?
                  `, [IdMarcher,wilaya])
          
              const totalMarketAmount = montantglobalwilaya[0]?.mantant_ht ?? 0;
                  const montantWilayaRealise = montantByWilayaEtudeCom[wilaya];
                  const tauxDebut = totalMarketAmount ? (montantWilayaRealise / totalMarketAmount) * 100 : 0;
                

                  resultListCom.push({
                      tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                      wilaya: wilaya
                  });
              }

              let resultListFini = [];
              for (const wilaya in montantByWilayaEtudeFini) {
                const[ montantglobalwilaya]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                  join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                  join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                  join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                  where IDMarche=? and bv_wilaya.wilaya_name_ascii=?
                  `, [IdMarcher,wilaya])
          
                  const totalMarketAmount = montantglobalwilaya[0]?.mantant_ht ?? 0;
                  const montantWilayaRealise = montantByWilayaEtudeFini[wilaya];
                  const tauxDebut = totalMarketAmount ? (montantWilayaRealise / totalMarketAmount) * 100 : 0;
                

                  resultListFini.push({
                      tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                      wilaya: wilaya
                  });
              }

           
              let finalResult = resultListCom.map(item => {
                const matchingItem = resultListFini.find(nonComItem => nonComItem.wilaya === item.wilaya);
                const tauxNonCom = matchingItem ? parseFloat(matchingItem.tauxNonCom) : 0;
                const tauxTermine = parseFloat(item.tauxTermine);
            
                return {
                    wilaya: item.wilaya,
                    tauxTermine: tauxTermine*100,
                    tauxNonCom: tauxNonCom*100,
                    tauxEnCour: formatNumberWithoutRounding((1-(tauxTermine + tauxNonCom))*100, 2)
                };
            });
          
          return res.json(finalResult);
          }
    
          else {
            const [actionImpcat] = await db.promise().query(`
              Select * from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya
              where id_marche=?
             `, [IdMarcher]);
              const montantAction=[];
              let montantByWilaya = {};
             for (const action of actionImpcat) {
              const [etude] = await db.promise().query(`
               select  CASE 
                    WHEN bv_etude.id_sit IS NOT NULL THEN sum(cout)
                    ELSE 0 
                END AS montantEtude  FROM bv_etude
                JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
               where bv_action_impactee.id_action_impactee=?`,[action.id_action_impactee])
              
               let montantTotalAction = etude[0].montantEtude
             //  montantAction.push(montantTotalAction);
               

               if (action.wilaya_name_ascii in montantByWilaya) {
                montantByWilaya[action.wilaya_name_ascii] += montantTotalAction;
            } else {
                montantByWilaya[action.wilaya_name_ascii] = montantTotalAction;
            } 
             }
             const[ montantMarche]= await db.promise().query(`select mantant_ht from bv_marche where IDMarche=?
              `, [IdMarcher])
              const totalMarketAmount = montantMarche[0]?.mantant_ht ?? 0;

              // Compute percentage for each wilaya
              let resultList = [];
              for (const wilaya in montantByWilaya) {
                  const montantWilaya = montantByWilaya[wilaya];
                  const tauxDebut = totalMarketAmount ? (montantWilaya / totalMarketAmount) * 100 : 0;
                  const tauxFin = 100 - tauxDebut; // Remaining percentage

                  resultList.push({
                      tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                      tauxFin: formatNumberWithoutRounding(tauxFin, 2),
                      wilaya: wilaya
                  });
              }

              
              return res.json(resultList);  
   
        }
        }
        if(structure=="DGPA")
            {
           
              const [statEtude]=await db.promise().query(`select count(*) as total,count(date_lancement) as debut,count(date_remise_final) as fin,
                                                        bv_wilaya.wilaya_name_ascii from bv_etude
                                                        join  bv_action_impactee on bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
                                                        JOIN  bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro=bv_action_impactee.id_pro_action_programme
                                                        JOIN bv_marche ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
                                                        JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                                                        where bv_marche.IDMarche=? 
                                                        and (INSTITUTION_PILOTE='DSA' OR INSTITUTION_PILOTE='HCDS')
                                                        group by bv_wilaya.wilaya_code
                                                        order by bv_wilaya.wilaya_name_ascii`,[IdMarcher])
           statEtude.forEach((item) => {
             const obj = {
             tauxDebut: parseFloat((item.debut * 100) / item.total),
              tauxFin: parseFloat((item.fin * 100) / item.total),
               wilaya: item.wilaya_name_ascii,
           };
          statList.push(obj);
            });
      
            }
        if (structure === "FORETS" || structure=="WALI") {
        if(selectedButton){
            const [actionImpcat] = await db.promise().query(`
            Select * from bv_action_impactee 
            Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
            join bv_commune on bv_commune.id = bv_action_impactee.code_commune
            where id_marche=?  and  bv_action_impactee.code_wilaya=?
           `, [IdMarcher,wilaya]);
          
          let montantByCommuneEtudeCom = {};
          let montantByCommuneEtudeFini = {};
           for (const action of actionImpcat) {
            const [etudeCom] = await db.promise().query(`
             select sum(cout) as montantEtude  FROM bv_etude
              JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
             where bv_action_impactee.id_action_impactee=? and date_lancement is not null`,[action.id_action_impactee])
    
             let montantTotalAction = etudeCom[0].montantEtude
      
           if (action.commune_name_ascii in montantByCommuneEtudeCom) {
            montantByCommuneEtudeCom[action.commune_name_ascii].montant += montantTotalAction;
        } else {
          montantByCommuneEtudeCom[action.commune_name_ascii] = {
                code_commune: action.id,
                montant: montantTotalAction
            };
        }

        const [etudeFini] = await db.promise().query(`
          select sum(cout) as montantEtude  FROM bv_etude
           JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
          where bv_etude.id_action_impactee=? and date_remise_final is not null`,[action.id_action_impactee])
 
          let montantTotalEtudeFini = etudeFini[0].montantEtude
   
        if (action.commune_name_ascii in montantByCommuneEtudeFini) {
          montantByCommuneEtudeFini[action.commune_name_ascii].montant += montantTotalEtudeFini;
     } else {
      montantByCommuneEtudeFini[action.id] = {
             code_commune: action.wilaya_code,
             montant: montantTotalEtudeFini
         };
     }
           }

            // Compute percentage for each wilaya
            let resultListCom = [];
            for (const commune in montantByCommuneEtudeCom) {
              const[ montantglobalwilaya]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                where IDMarche=? and bv_wilaya.wilaya_name_ascii=? and 
                `, [IdMarcher,commune])
        
            const totalMarketAmount = montantglobalwilaya[0]?.mantant_ht ?? 0;
                const montantWilayaRealise = montantByCommuneEtudeCom[commune];
                const tauxDebut = totalMarketAmount ? (montantWilayaRealise / totalMarketAmount) * 100 : 0;
              
                resultListCom.push({
                    tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                    wilaya: commune
                });
            }

            let resultListFini = [];
            for (const wilaya in montantByWilayaEtudeFini) {
              const[ montantglobalwilaya]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                where IDMarche=? and bv_wilaya.wilaya_name_ascii=?
                `, [IdMarcher,wilaya])
        
                const totalMarketAmount = montantglobalwilaya[0]?.mantant_ht ?? 0;
                const montantWilayaRealise = montantByWilayaEtudeFini[wilaya];
                const tauxDebut = totalMarketAmount ? (montantWilayaRealise / totalMarketAmount) * 100 : 0;
              

                resultListFini.push({
                    tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                    wilaya: wilaya
                });
            }

         
            let finalResult = resultListCom.map(item => {
              const matchingItem = resultListFini.find(nonComItem => nonComItem.wilaya === item.wilaya);
              const tauxNonCom = matchingItem ? parseFloat(matchingItem.tauxNonCom) : 0;
              const tauxTermine = parseFloat(item.tauxTermine);
          
              return {
                  wilaya: item.wilaya,
                  tauxTermine: tauxTermine*100,
                  tauxNonCom: tauxNonCom*100,
                  tauxEnCour: formatNumberWithoutRounding((1-(tauxTermine + tauxNonCom))*100, 2)
              };
          });
        
        return res.json(finalResult);
        }
        else {
          const [actionImpcat] = await db.promise().query(`
            Select * from bv_action_impactee 
            Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya
            where id_marche=?and  bv_action_impactee.code_wilaya=?
             `, [IdMarcher,wilaya]);
          
            let montantByWilaya = {};
           for (const action of actionImpcat) {
            const [etude] = await db.promise().query(`
             select  CASE 
                  WHEN bv_etude.id_sit IS NOT NULL THEN sum(cout)
                  ELSE 0 
              END AS montantEtude  FROM bv_etude
              JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
             where bv_action_impactee.id_action_impactee=?`,[action.id_action_impactee])
            
             let montantTotalAction = etude[0].montantEtude
           //  montantAction.push(montantTotalAction);
             

             if (action.wilaya_name_ascii in montantByWilaya) {
              montantByWilaya[action.wilaya_name_ascii] += montantTotalAction;
          } else {
              montantByWilaya[action.wilaya_name_ascii] = montantTotalAction;
          } 
           }
           const[ montantMarche]= await db.promise().query(`select mantant_ht from bv_marche where IDMarche=?
            `, [IdMarcher])
            const totalMarketAmount = montantMarche[0]?.mantant_ht ?? 0;

            // Compute percentage for each wilaya
            let resultList = [];
            for (const wilaya in montantByWilaya) {
                const montantWilaya = montantByWilaya[wilaya];
                const tauxDebut = totalMarketAmount ? (montantWilaya / totalMarketAmount) * 100 : 0;
                const tauxFin = 100 - tauxDebut; // Remaining percentage

                resultList.push({
                    tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                    tauxFin: formatNumberWithoutRounding(tauxFin, 2),
                    wilaya: wilaya
                });
            }

            
            return res.json(resultList);  
 
        }      
    
        }
          if(structure==="DSA"|| structure=="HCDS"){

            if(selectedButton){
              const [actionImpcat] = await db.promise().query(`
              Select * from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              join bv_commune on bv_commune.id = bv_action_impactee.code_commune
              where id_marche=? and bv_action_impactee.code_wilaya=? and INSTITUTION_PILOTE=?
             `, [IdMarcher,wilaya,structure]);
            
            let montantByCommuneEtudeCom = {};
            let montantByCommuneEtudeFini = {};
             for (const action of actionImpcat) {
              const [etudeCom] = await db.promise().query(`
               select sum(cout) as montantEtude  FROM bv_etude
                JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
               where bv_action_impactee.id_action_impactee=? and date_lancement is not null`,[action.id_action_impactee])
               let montantTotalAction = etudeCom[0].montantEtude
        
             if (action.commune_name_ascii in montantByCommuneEtudeCom) {
              montantByCommuneEtudeCom[action.commune_name_ascii].montant += montantTotalAction;
          } else {
            montantByCommuneEtudeCom[action.commune_name_ascii] = {
                  code_commune: action.id,
                  montant: montantTotalAction
              };
          }
  
          const [etudeFini] = await db.promise().query(`
            select sum(cout) as montantEtude  FROM bv_etude
             JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
            where bv_etude.id_action_impactee=? and date_remise_final is not null`,[action.id_action_impactee])
            let montantTotalEtudeFini = etudeFini[0].montantEtude
     
          if (action.commune_name_ascii in montantByCommuneEtudeFini) {
            montantByCommuneEtudeFini[action.commune_name_ascii].montant += montantTotalEtudeFini;
       } else {
        montantByCommuneEtudeFini[action.id] = {
               code_commune: action.wilaya_code,
               montant: montantTotalEtudeFini
           };
       }
             }

              let resultListCom = [];
              for (const commune in montantByCommuneEtudeCom) {
                const[ montantglobalwilaya]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                  join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                  join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                  join bv_commune on bv_action_impactee.code_commune = bv_commune.id
                  where IDMarche=? and bv_commune.commune_name_ascii=? 
                  `, [IdMarcher,commune])
          
              const totalMarketAmount = montantglobalwilaya[0]?.mantant_ht ?? 0;
                  const montantWilayaRealise = montantByCommuneEtudeCom[commune];
                  const tauxDebut = totalMarketAmount ? (montantWilayaRealise / totalMarketAmount) * 100 : 0;
                
                  resultListCom.push({
                      tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                      wilaya: commune
                  });
              }
  
              let resultListFini = [];
              for (const commune in montantByCommuneEtudeFini) {
                const[ montantglobalcommune]= await db.promise().query(`select sum(bv_action_impactee.MONTANT_PREVU_RETENU) as mantant_ht from bv_marche
                  join bv_action_pro_programme on bv_marche.IDMarche= bv_action_pro_programme.id_marche
                  join bv_action_impactee on bv_action_pro_programme.id_pro_action_pro =bv_action_impactee.id_pro_action_programme
                  join bv_wilaya on bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                  where IDMarche=? and bv_wilaya.wilaya_name_ascii=? and INSTITUTION_PILOTE=?
                  `, [IdMarcher,commune,structure])
          
                  const totalMarketAmount = montantglobalcommune[0]?.mantant_ht ?? 0;
                  const montantWilayaRealise = montantByCommuneEtudeFini[wilaya];
                  const tauxDebut = totalMarketAmount ? (montantWilayaRealise / totalMarketAmount) * 100 : 0;
                
  
                  resultListFini.push({
                      tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                      wilaya: wilaya
                  });
              }
  
           
              let finalResult = resultListCom.map(item => {
                const matchingItem = resultListFini.find(nonComItem => nonComItem.wilaya === item.wilaya);
                const tauxNonCom = matchingItem ? parseFloat(matchingItem.tauxNonCom) : 0;
                const tauxTermine = parseFloat(item.tauxTermine);
            
                return {
                    wilaya: item.wilaya,
                    tauxTermine: tauxTermine*100,
                    tauxNonCom: tauxNonCom*100,
                    tauxEnCour: formatNumberWithoutRounding((1-(tauxTermine + tauxNonCom))*100, 2)
                };
            });
          
          return res.json(finalResult);
          }
    
          else {
            const [actionImpcat] = await db.promise().query(`
              Select * from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                join bv_wilaya on bv_wilaya.wilaya_code = bv_action_impactee.code_wilaya
              where id_marche=? and  bv_action_impactee.code_wilaya=? and INSTITUTION_PILOTE=?
             `, [IdMarcher,wilaya,structure]);
            
              let montantByWilaya = {};
             for (const action of actionImpcat) {
              const [etude] = await db.promise().query(`
               select  CASE 
                    WHEN bv_etude.id_sit IS NOT NULL THEN sum(cout)
                    ELSE 0 
                END AS montantEtude  FROM bv_etude
                JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
               where bv_action_impactee.id_action_impactee=?`,[action.id_action_impactee])
              
               let montantTotalAction = etude[0].montantEtude
             // montantAction.push(montantTotalAction);
               
  
               if (action.wilaya_name_ascii in montantByWilaya) {
                montantByWilaya[action.wilaya_name_ascii] += montantTotalAction;
            } else {
                montantByWilaya[action.wilaya_name_ascii] = montantTotalAction;
            } 
             }
             const[ montantMarche]= await db.promise().query(`select mantant_ht from bv_marche where IDMarche=?
              `, [IdMarcher])
              const totalMarketAmount = montantMarche[0]?.mantant_ht ?? 0;
  
              // Compute percentage for each wilaya
              let resultList = [];
              for (const wilaya in montantByWilaya) {
                  const montantWilaya = montantByWilaya[wilaya];
                  const tauxDebut = totalMarketAmount ? (montantWilaya / totalMarketAmount) * 100 : 0;
                  const tauxFin = 100 - tauxDebut; // Remaining percentage
  
                  resultList.push({
                      tauxDebut: formatNumberWithoutRounding(tauxDebut, 2),
                      tauxFin: formatNumberWithoutRounding(tauxFin, 2),
                      wilaya: wilaya
                  });
              }
  
              
              return res.json(resultList);  
   
        }      
      
          }
        
    }

   
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
//..
const realiationBarChartAct = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya = req.wilaya;
      const IdMarcher = req.body.selectedMarche.id;
      const typemarche=req.body.selectedMarche.type_marche
      const IdAction = req.body.selectedAction;
      const selectedButton = req.body.buttonType;
      const statList = [];
      if (selectedButton == true) {
        if(typemarche=="Réalisation")
        {  if (structure == "BNEDER" || structure == "DGF" || structure == "SG" || structure == "MINISTRE") {
          const queryWilaya = `
          SELECT DISTINCT wilaya_code,wilaya_name_ascii
          FROM bv_wilaya 
          LEFT JOIN bv_action_impactee  ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
          LEFT JOIN bv_action_pro_programme 
            ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro  
          WHERE  
            bv_action_pro_programme.id_marche = ? 
            AND bv_action_pro_programme.id_action_programme = ?`;
        
          const [selectWilaya] = await db.promise().query(queryWilaya,[IdMarcher, IdAction]);
  
          for (const wilaya of selectWilaya) {
            let VolumeTotalRealisation = 0;
            let ratio = 0;
            let i = 0;
            const query1 = `SELECT  bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase,SUM(bv_realisation.volume_realise) as totalrealise,SUM(bv_tache.quantite_tache) as total_prevu FROM bv_marche
            INNER JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
            INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
            INNER JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
            LEFT JOIN bv_phase ON  bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
            LEFT JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
            LEFT JOIN  bv_realisation on bv_tache.id_tache=bv_realisation.id_tache 
            INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
            WHERE  
              bv_action_pro_programme.id_marche=? AND bv_action_pro_programme.id_action_programme  =? AND bv_wilaya.wilaya_code=?
              GROUP BY bv_phase.num_phase,bv_tache.intitule_tache ORDER BY bv_wilaya.wilaya_name_ascii ASC;`;
            const values = [IdMarcher, IdAction, wilaya["wilaya_code"]];
            const [selectedTache] = await db.promise().query(query1, values);
            for (const tache of selectedTache) {
              if (tache.total_prevu !== 0) {
                ratio = parseFloat(
                  (tache.totalrealise * 100) / tache.total_prevu
                );
                let formattedRatio = formatNumberWithoutRounding(ratio, 3);
                VolumeTotalRealisation += formattedRatio;
                i++;
              }
            }
            const obj = {
              volumeTotal:
                i !== 0
                  ? formatNumberWithoutRounding(VolumeTotalRealisation / i, 3)
                  : 0,
              wilaya: wilaya.wilaya_name_ascii,
            };
            statList.push(obj);
          }
        } else 
          if (structure == "FORETS" || structure=="WALI") {
            const queryCommune = `SELECT * FROM bv_commune 
            INNER JOIN bv_action_impactee ON bv_commune.id=bv_action_impactee.code_commune 
             LEFT JOIN bv_action_pro_programme 
            ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro  
             WHERE  
            bv_action_pro_programme.id_marche = ? 
            AND bv_action_pro_programme.id_action_programme = ?
            and bv_commune.wilaya_code=? GROUP BY bv_action_impactee.code_commune`;
            const valuesW = [IdMarcher, IdAction,wilaya];
            const [selectCommune] = await db
              .promise()
              .query(queryCommune, valuesW);
            for (const item of selectCommune) {
              let VolumeTotalRealisation = 0;
              let i = 0;
              let ratio = 0;
              const query1 = `SELECT  bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase,SUM(bv_realisation.volume_realise) as totalrealise,SUM(bv_tache.quantite_tache) as total_prevu FROM bv_marche
              INNER JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
              INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
              INNER JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              LEFT JOIN bv_phase ON  bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
              LEFT JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
              LEFT JOIN bv_realisation on bv_tache.id_tache=bv_realisation.id_tache 
              INNER JOIN  bv_commune ON bv_action_impactee.code_commune = bv_commune.id
              WHERE  
              bv_action_pro_programme.id_marche=? AND bv_action_pro_programme.id_action_programme  =? AND bv_action_impactee.code_commune=?
                GROUP BY bv_phase.num_phase,bv_tache.intitule_tache`;
              const values = [IdMarcher, IdAction, item.id];
              const [selectedTache] = await db.promise().query(query1, values);
              for (const tache of selectedTache) {
                if (tache.total_prevu !== 0) {
                  ratio = parseFloat(
                    (tache.totalrealise * 100) / tache.total_prevu
                  );
                  let formattedRatio = formatNumberWithoutRounding(ratio, 3);
                  VolumeTotalRealisation += formattedRatio;
                  i++;
                }
              }
              const obj = {
                volumeTotal:
                  i !== 0
                    ? formatNumberWithoutRounding(VolumeTotalRealisation / i, 3)
                    : 0,
                wilaya: item.commune_name_ascii,
              };
              statList.push(obj);
            }
          } else if(structure=="DSA" || structure=="HCDS") {
            const queryCommune = `SELECT * FROM bv_commune 
            INNER JOIN bv_action_impactee ON bv_commune.id=bv_action_impactee.code_commune 
             LEFT JOIN bv_action_pro_programme 
            ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro  
            WHERE  
            bv_action_pro_programme.id_marche = ? 
            AND bv_action_pro_programme.id_action_programme = ?
          and  bv_action_impactee.INSTITUTION_PILOTE=?
            and bv_commune.wilaya_code=? GROUP BY bv_action_impactee.code_commune;`;
            const valuesW = [IdMarcher, IdAction,structure,wilaya];
            const [selectCommune] = await db
              .promise()
              .query(queryCommune, valuesW);
            for (const item of selectCommune) {
              let VolumeTotalRealisation = 0;
              let i = 0;
               let query1
          query1 = `SELECT 
  bv_tache.intitule_tache, 
  bv_tache.unite_tache, 
  bv_phase.num_phase, 
  SUM(bv_realisation.volume_realise) AS totalrealise, 
  SUM(bv_tache.quantite_tache) AS total_prevu 
FROM bv_marche
INNER JOIN bv_action_pro_programme 
  ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
INNER JOIN bv_action_programme 
  ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
INNER JOIN bv_action_impactee 
  ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
LEFT JOIN bv_phase 
  ON bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
LEFT JOIN bv_tache 
  ON bv_phase.id_phase = bv_tache.id_phase
LEFT JOIN bv_realisation 
  ON bv_tache.id_tache = bv_realisation.id_tache 
INNER JOIN bv_commune 
  ON bv_action_impactee.code_commune = bv_commune.id
WHERE  
  bv_action_pro_programme.id_marche = ? 
  AND bv_action_pro_programme.id_action_programme = ? 
  AND bv_action_impactee.code_commune = ? 
  AND bv_action_impactee.INSTITUTION_PILOTE = ?
GROUP BY 
  bv_phase.num_phase, 
  bv_tache.intitule_tache, 
  bv_tache.unite_tache;
`;
              const values = [IdMarcher, IdAction, item.id, structure];
              const [selectedTache] = await db.promise().query(query1, values);
              for (const tache of selectedTache) {
                if (tache.total_prevu !== 0) {
                  ratio = parseFloat(
                    (tache.totalrealise * 100) / tache.total_prevu
                  );
                  let formattedRatio = formatNumberWithoutRounding(ratio, 3);
                  VolumeTotalRealisation += formattedRatio;
                  i++;
                }
              }
              const obj = {
                volumeTotal:
                  i !== 0
                    ? formatNumberWithoutRounding(VolumeTotalRealisation / i, 3)
                    : 0,
                wilaya: item.commune_name_ascii,
              };
              statList.push(obj);
            }
          }else if(structure=="DGPA")
            {
              const queryWilaya = `
              SELECT DISTINCT wilaya_code,wilaya_name_ascii
              FROM bv_wilaya 
              LEFT JOIN bv_action_impactee  ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
              LEFT JOIN bv_action_pro_programme 
                ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro  
              WHERE  
                bv_action_pro_programme.id_marche = ? 
                AND bv_action_pro_programme.id_action_programme = ?
                and (bv_action_impactee.INSTITUTION_PILOTE ='DSA' OR bv_action_impactee.INSTITUTION_PILOTE ='HCDS')`;
            
              const [selectWilaya] = await db.promise().query(queryWilaya,[IdMarcher, IdAction]);
      
              for (const wilaya of selectWilaya) {
                let VolumeTotalRealisation = 0;
                let ratio = 0;
                let i = 0;
                const query1 = `SELECT  bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase,SUM(bv_realisation.volume_realise) as totalrealise,SUM(bv_tache.quantite_tache) as total_prevu FROM bv_marche
                INNER JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
                INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
                INNER JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                LEFT JOIN bv_phase ON  bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
                LEFT JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
                LEFT JOIN  bv_realisation on bv_tache.id_tache=bv_realisation.id_tache 
                INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                WHERE  
                  bv_action_pro_programme.id_marche=? AND bv_action_pro_programme.id_action_programme  =? 
                  AND bv_wilaya.wilaya_code=?
                  and (bv_action_impactee.INSTITUTION_PILOTE ='DSA' OR bv_action_impactee.INSTITUTION_PILOTE ='HCDS')
                  GROUP BY bv_phase.num_phase,bv_tache.intitule_tache ORDER BY bv_wilaya.wilaya_name_ascii ASC;`;
                const values = [IdMarcher, IdAction, wilaya["wilaya_code"]];
                const [selectedTache] = await db.promise().query(query1, values);
                for (const tache of selectedTache) {
                  if (tache.total_prevu !== 0) {
                    ratio = parseFloat(
                      (tache.totalrealise * 100) / tache.total_prevu
                    );
                    let formattedRatio = formatNumberWithoutRounding(ratio, 3);
                    VolumeTotalRealisation += formattedRatio;
                    i++;
                  }
                }
                const obj = {
                  volumeTotal:
                    i !== 0
                      ? formatNumberWithoutRounding(VolumeTotalRealisation / i, 3)
                      : 0,
                  wilaya: wilaya.wilaya_name_ascii,
                };
                statList.push(obj);
              }
            }
          }
          else{
            if (structure == "BNEDER" || structure == "DGF" || structure == "SG" || structure == "MINISTRE")
            { 
              const [statEtude]=await db.promise().query(`select count(*) as total,count(date_remise_final) as fin,
                                                        bv_wilaya.wilaya_name_ascii from bv_etude
                                                        join  bv_action_impactee on bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
                                                        JOIN  bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro=bv_action_impactee.id_pro_action_programme
                                                        JOIN bv_marche ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
                                                        JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                                                        where bv_marche.IDMarche=? and bv_action_impactee.id_pro_action_programme=?
                                                        group by bv_wilaya.wilaya_code
                                                        order by bv_wilaya.wilaya_name_ascii`,[IdMarcher,IdAction])
           statEtude.forEach((item) => {
             const obj = {
             volumeTotal: parseFloat((item.fin * 100) / item.total),
               wilaya: item.wilaya_name_ascii,
           }; 
          statList.push(obj);
            });
          
            }
            if(structure=="DGPA")
                {
               
                  const [statEtude]=await db.promise().query(`select count(*) as total,count(date_remise_final) as fin,
                                                            bv_wilaya.wilaya_name_ascii from bv_etude
                                                            join  bv_action_impactee on bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
                                                            JOIN  bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro=bv_action_impactee.id_pro_action_programme
                                                            JOIN bv_marche ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
                                                            JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                                                            where bv_marche.IDMarche=? 
                                                            and (INSTITUTION_PILOTE='DSA' OR INSTITUTION_PILOTE='HCDS')
                                                            and bv_action_impactee.id_pro_action_programme=?
                                                            group by bv_wilaya.wilaya_code
                                                            order by bv_wilaya.wilaya_name_ascii`,[IdMarcher,IdAction])
               statEtude.forEach((item) => {
                 const obj = {
               
                  volumeTotal: parseFloat((item.fin * 100) / item.total),
                   wilaya: item.wilaya_name_ascii,
               };
              statList.push(obj);
                });
          
                }
            if (structure == "FORETS" || structure=="WALI") {
              
              try {
              
                  const query = `
                SELECT count(id_etude) as total,
                COUNT(bv_etude.date_remise_final) AS fin,bv_commune.commune_name_ascii FROM bv_marche
                 JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
                 JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                left JOIN  bv_etude on bv_action_impactee.id_action_impactee=bv_etude.id_action_impactee
                 JOIN bv_commune ON  bv_action_impactee.code_commune=bv_commune.id
                WHERE  
                      bv_marche.IDMarche=? and bv_action_impactee.code_wilaya=?
                      and bv_action_impactee.id_pro_action_programme=?
                      group by bv_action_impactee.code_commune `;
                  const values = [IdMarcher,wilaya,IdAction];
                  const [selectTraveaux] = await db
                    .promise()
                    .query(query, values);
           
                  for (const items of selectTraveaux) {
                
                    const obj = {
                 
                      volumeTotal: parseFloat(
                        (items.fin * 100) / items.total
                      ),
                      wilaya: items.commune_name_ascii,
                    };
                    statList.push(obj);
                  }
                
              } catch (error) {
                console.error("Error occurred:", error);
              }
            }
              if(structure==="DSA"|| structure=="HCDS"){
                try {
              
                  const query = `
                SELECT   count(id_etude) as total,
                COUNT(bv_etude.date_remise_final) AS fin,bv_commune.commune_name_ascii FROM bv_marche
                INNER JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
                INNER JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                JOIN  bv_etude on bv_action_impactee.id_action_impactee=bv_etude.id_action_impactee
                INNER JOIN bv_commune ON  bv_action_impactee.code_commune=bv_commune.id
                WHERE  
                      bv_marche.IDMarche=?  and bv_action_impactee.code_wilaya=?
                      and bv_action_impactee.id_pro_action_programme=?
                      and INSTITUTION_PILOTE=?
                      group by bv_commune.id `;
                  const values = [IdMarcher,wilaya,IdAction,structure];
                  const [selectTraveaux] = await db
                    .promise()
                    .query(query, values);
           
                  for (const items of selectTraveaux) {
                
                    const obj = {
                 
                      volumeTotal: parseFloat(
                        (items.fin * 100) / items.total
                      ),
                      wilaya: items.commune_name_ascii,
                    };
                    statList.push(obj);
                  }
                
              } catch (error) {
                console.error("Error occurred:", error);
              }
              }
         
          }
      
      }
      res.json(statList);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
//..
const realiationBarChartwilaya = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya = req.wilaya;
      const IdMarcher = req.body.selectedMarche.id;
      const typemarche=req.body.selectedMarche.type_marche
      const codewilaya = req.body.selectedwilaya;
      const selectedButton = req.body.buttonType;
      const statList = [];
      if (selectedButton == true) {
        if(typemarche=="Réalisation")
        {  
          if (structure == "BNEDER" || structure == "DGF" || structure == "SG" || structure == "MINISTRE") 
            {
          const queryaction = `
          SELECT DISTINCT action,bv_action_pro_programme.id_pro_action_pro
          FROM bv_action_programme 
          LEFT JOIN bv_action_pro_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
          LEFT JOIN bv_action_impactee 
           ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro  
          WHERE  
            bv_action_pro_programme.id_marche = ? and
             bv_action_impactee.code_wilaya = ?`;        
          const [selectaction] = await db.promise().query(queryaction,[IdMarcher, codewilaya]);
        
          for (const action of selectaction) {
            let VolumeTotalRealisation = 0;
            let ratio = 0;
            let i = 0;
            const query1 = `SELECT  bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase,SUM(bv_realisation.volume_realise) as totalrealise,SUM(bv_tache.quantite_tache) as total_prevu FROM bv_marche
            INNER JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
            INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
            INNER JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
            LEFT JOIN bv_phase ON  bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
            LEFT JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
            LEFT JOIN  bv_realisation on bv_tache.id_tache=bv_realisation.id_tache 
            INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
            WHERE  
            bv_action_pro_programme.id_marche=? AND bv_action_pro_programme.id_pro_action_pro  =? AND bv_wilaya.wilaya_code=?
            GROUP BY bv_phase.num_phase,bv_tache.intitule_tache ORDER BY bv_wilaya.wilaya_name_ascii ASC;`;
            const values = [IdMarcher, action["id_pro_action_pro"],codewilaya];
            const [selectedTache] = await db.promise().query(query1, values);
         
            for (const tache of selectedTache) {
              if (tache.total_prevu !== 0 || tache.total_prevu!=null) {
                ratio = parseFloat(
                  (tache.totalrealise * 100) / tache.total_prevu
                );
                let formattedRatio = formatNumberWithoutRounding(ratio, 3);
                VolumeTotalRealisation += formattedRatio;
                i++;
              }
            }
            const obj = {
              volumeTotal:
                i !== 0
                  ? formatNumberWithoutRounding(VolumeTotalRealisation / i, 3)
                  : 0,
              wilaya: action.action,
            };
      statList.push(obj);
          }
        } 
//         else 
//         if (structure == "FORETS" || structure=="WALI") {
//           const queryCommune = `SELECT * FROM bv_commune 
//           INNER JOIN bv_action_impactee ON bv_commune.id=bv_action_impactee.code_commune 
//            LEFT JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro  
//           INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
//            WHERE  
//           bv_action_pro_programme.id_marche = ? 
//           AND bv_action_impactee.code_wilaya = ?
//           `;
//           const valuesW = [IdMarcher, codewilaya];
//           const [selectCommune] = await db
//             .promise()
//             .query(queryCommune, valuesW);
//           for (const item of selectCommune) {
//             let VolumeTotalRealisation = 0;
//             let i = 0;
//             let ratio = 0;
//             const query1 = `SELECT  bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase,SUM(bv_realisation.volume_realise) as totalrealise,SUM(bv_tache.quantite_tache) as total_prevu FROM bv_marche
//             INNER JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
//             INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
//             INNER JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
//             LEFT JOIN bv_phase ON  bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
//             LEFT JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
//             LEFT JOIN bv_realisation on bv_tache.id_tache=bv_realisation.id_tache 
//             INNER JOIN  bv_commune ON bv_action_impactee.code_commune = bv_commune.id
//           WHERE  
//             bv_action_pro_programme.id_marche=? AND bv_action_pro_programme.id_pro_action_pro  =? AND bv_wilaya.wilaya_code=?
//             GROUP BY bv_phase.num_phase,bv_tache.intitule_tache ORDER BY bv_wilaya.wilaya_name_ascii ASC;`;
//             const values = [IdMarcher, action["id_pro_action_pro"],codewilaya];
//             const [selectedTache] = await db.promise().query(query1, values);
//             for (const tache of selectedTache) {
//               if (tache.total_prevu !== 0) {
//                 ratio = parseFloat(
//                   (tache.totalrealise * 100) / tache.total_prevu
//                 );
//                 let formattedRatio = formatNumberWithoutRounding(ratio, 3);
//                 VolumeTotalRealisation += formattedRatio;
//                 i++;
//               }
//             }
//             const obj = {
//               volumeTotal:
//                 i !== 0
//                   ? formatNumberWithoutRounding(VolumeTotalRealisation / i, 3)
//                   : 0,
//               wilaya: item.commune_name_ascii,
//             };
//             statList.push(obj);
//           }
//         } else if(structure=="DSA" || structure=="HCDS") {
//           const queryCommune = `SELECT * FROM bv_commune 
//           INNER JOIN bv_action_impactee ON bv_commune.id=bv_action_impactee.code_commune 
//            LEFT JOIN bv_action_pro_programme 
//           ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro  
//           WHERE  
//           bv_action_pro_programme.id_marche = ? 
//           AND bv_action_pro_programme.id_action_programme = ?
//         and  bv_action_impactee.INSTITUTION_PILOTE=?
//           and bv_commune.wilaya_code=? GROUP BY bv_action_impactee.code_commune;`;
//           const valuesW = [IdMarcher, IdAction,structure,wilaya];
//           const [selectCommune] = await db
//             .promise()
//             .query(queryCommune, valuesW);
//           for (const item of selectCommune) {
//             let VolumeTotalRealisation = 0;
//             let i = 0;
//              let query1
//         query1 = `SELECT 
// bv_tache.intitule_tache, 
// bv_tache.unite_tache, 
// bv_phase.num_phase, 
// SUM(bv_realisation.volume_realise) AS totalrealise, 
// SUM(bv_tache.quantite_tache) AS total_prevu 
// FROM bv_marche
// INNER JOIN bv_action_pro_programme 
// ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
// INNER JOIN bv_action_programme 
// ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
// INNER JOIN bv_action_impactee 
// ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
// LEFT JOIN bv_phase 
// ON bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
// LEFT JOIN bv_tache 
// ON bv_phase.id_phase = bv_tache.id_phase
// LEFT JOIN bv_realisation 
// ON bv_tache.id_tache = bv_realisation.id_tache 
// INNER JOIN bv_commune 
// ON bv_action_impactee.code_commune = bv_commune.id
// WHERE  
// bv_action_pro_programme.id_marche = ? 
// AND bv_action_pro_programme.id_action_programme = ? 
// AND bv_action_impactee.code_commune = ? 
// AND bv_action_impactee.INSTITUTION_PILOTE = ?
// GROUP BY 
// bv_phase.num_phase, 
// bv_tache.intitule_tache, 
// bv_tache.unite_tache;
// `;
//             const values = [IdMarcher, IdAction, item.id, structure];
//             const [selectedTache] = await db.promise().query(query1, values);
//             for (const tache of selectedTache) {
//               if (tache.total_prevu !== 0) {
//                 ratio = parseFloat(
//                   (tache.totalrealise * 100) / tache.total_prevu
//                 );
//                 let formattedRatio = formatNumberWithoutRounding(ratio, 3);
//                 VolumeTotalRealisation += formattedRatio;
//                 i++;
//               }
//             }
//             const obj = {
//               volumeTotal:
//                 i !== 0
//                   ? formatNumberWithoutRounding(VolumeTotalRealisation / i, 3)
//                   : 0,
//               wilaya: item.commune_name_ascii,
//             };
//             statList.push(obj);
//           }
//         }else if(structure=="DGPA")
//           {
//             const queryWilaya = `
//             SELECT DISTINCT wilaya_code,wilaya_name_ascii
//             FROM bv_wilaya 
//             LEFT JOIN bv_action_impactee  ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
//             LEFT JOIN bv_action_pro_programme 
//               ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro  
//             WHERE  
//               bv_action_pro_programme.id_marche = ? 
//               AND bv_action_pro_programme.id_action_programme = ?
//               and (bv_action_impactee.INSTITUTION_PILOTE ='DSA' OR bv_action_impactee.INSTITUTION_PILOTE ='HCDS')`;
          
//             const [selectWilaya] = await db.promise().query(queryWilaya,[IdMarcher, IdAction]);
    
//             for (const wilaya of selectWilaya) {
//               let VolumeTotalRealisation = 0;
//               let ratio = 0;
//               let i = 0;
//               const query1 = `SELECT  bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase,SUM(bv_realisation.volume_realise) as totalrealise,SUM(bv_tache.quantite_tache) as total_prevu FROM bv_marche
//               INNER JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
//               INNER JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme  
//               INNER JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
//               LEFT JOIN bv_phase ON  bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee                          
//               LEFT JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase
//               LEFT JOIN  bv_realisation on bv_tache.id_tache=bv_realisation.id_tache 
//               INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
//               WHERE  
//                 bv_action_pro_programme.id_marche=? AND bv_action_pro_programme.id_action_programme  =? 
//                 AND bv_wilaya.wilaya_code=?
//                 and (bv_action_impactee.INSTITUTION_PILOTE ='DSA' OR bv_action_impactee.INSTITUTION_PILOTE ='HCDS')
//                 GROUP BY bv_phase.num_phase,bv_tache.intitule_tache ORDER BY bv_wilaya.wilaya_name_ascii ASC;`;
//               const values = [IdMarcher, IdAction, wilaya["wilaya_code"]];
//               const [selectedTache] = await db.promise().query(query1, values);
//               for (const tache of selectedTache) {
//                 if (tache.total_prevu !== 0) {
//                   ratio = parseFloat(
//                     (tache.totalrealise * 100) / tache.total_prevu
//                   );
//                   let formattedRatio = formatNumberWithoutRounding(ratio, 3);
//                   VolumeTotalRealisation += formattedRatio;
//                   i++;
//                 }
//               }
//               const obj = {
//                 volumeTotal:
//                   i !== 0
//                     ? formatNumberWithoutRounding(VolumeTotalRealisation / i, 3)
//                     : 0,
//                 wilaya: wilaya.wilaya_name_ascii,
//               };
//               statList.push(obj);
//             }
//           }
    
          }
          // else{
          //   if (structure == "BNEDER" || structure == "DGF" || structure == "SG" || structure == "MINISTRE")
          //   { 
          //     const [statEtude]=await db.promise().query(`select count(*) as total,count(date_remise_final) as fin,
          //                                               bv_action_programme.action from bv_etude
          //                                               join  bv_action_impactee on bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
          //                                               JOIN  bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro=bv_action_impactee.id_pro_action_programme
          //                                               join bv_action_programme on bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
          //                                               JOIN bv_marche ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
          //                                               JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
          //                                               where bv_marche.IDMarche=? and  bv_wilaya.wilaya_code=?
          //                                               group by bv_wilaya.wilaya_code
          //                                               order by bv_wilaya.wilaya_name_ascii`,[IdMarcher,codewilaya])
          //  statEtude.forEach((item) => {
          //    const obj = {
          //    volumeTotal: parseFloat((item.fin * 100) / item.total),
          //      wilaya: item.wilaya_name_ascii,
          //  }; 
          // statList.push(obj);
          //   });
          
          //   }
          //   if(structure=="DGPA")
          //       {
               
          //         const [statEtude]=await db.promise().query(`select count(*) as total,count(date_remise_final) as fin,
          //                                                   bv_wilaya.wilaya_name_ascii from bv_etude
          //                                                   join  bv_action_impactee on bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
          //                                                   JOIN  bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro=bv_action_impactee.id_pro_action_programme
          //                                                   JOIN bv_marche ON bv_marche.IDMarche = bv_action_pro_programme.id_marche
          //                                                   JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
          //                                                   where bv_marche.IDMarche=? 
          //                                                   and (INSTITUTION_PILOTE='DSA' OR INSTITUTION_PILOTE='HCDS')
          //                                                   and bv_action_impactee.id_pro_action_programme=?
          //                                                   group by bv_wilaya.wilaya_code
          //                                                   order by bv_wilaya.wilaya_name_ascii`,[IdMarcher,IdAction])
          //      statEtude.forEach((item) => {
          //        const obj = {
               
          //         volumeTotal: parseFloat((item.fin * 100) / item.total),
          //          wilaya: item.wilaya_name_ascii,
          //      };
          //     statList.push(obj);
          //       });
          
          //       }
          //   if (structure == "FORETS" || structure=="WALI") {
              
          //     try {
              
          //         const query = `
          //       SELECT count(id_etude) as total,
          //       COUNT(bv_etude.date_remise_final) AS fin,bv_commune.commune_name_ascii FROM bv_marche
          //        JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
          //        JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
          //       left JOIN  bv_etude on bv_action_impactee.id_action_impactee=bv_etude.id_action_impactee
          //        JOIN bv_commune ON  bv_action_impactee.code_commune=bv_commune.id
          //       WHERE  
          //             bv_marche.IDMarche=? and bv_action_impactee.code_wilaya=?
          //             and bv_action_impactee.id_pro_action_programme=?
          //             group by bv_action_impactee.code_commune `;
          //         const values = [IdMarcher,wilaya,IdAction];
          //         const [selectTraveaux] = await db
          //           .promise()
          //           .query(query, values);
           
          //         for (const items of selectTraveaux) {
                
          //           const obj = {
                 
          //             volumeTotal: parseFloat(
          //               (items.fin * 100) / items.total
          //             ),
          //             wilaya: items.commune_name_ascii,
          //           };
          //           statList.push(obj);
          //         }
                
          //     } catch (error) {
          //       console.error("Error occurred:", error);
          //     }
          //   }
          //     if(structure==="DSA"|| structure=="HCDS"){
          //       try {
              
          //         const query = `
          //       SELECT   count(id_etude) as total,
          //       COUNT(bv_etude.date_remise_final) AS fin,bv_commune.commune_name_ascii FROM bv_marche
          //       INNER JOIN bv_action_pro_programme ON  bv_marche.IDMarche = bv_action_pro_programme.id_marche
          //       INNER JOIN bv_action_impactee ON  bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
          //       JOIN  bv_etude on bv_action_impactee.id_action_impactee=bv_etude.id_action_impactee
          //       INNER JOIN bv_commune ON  bv_action_impactee.code_commune=bv_commune.id
          //       WHERE  
          //             bv_marche.IDMarche=?  and bv_action_impactee.code_wilaya=?
          //             and bv_action_impactee.id_pro_action_programme=?
          //             and INSTITUTION_PILOTE=?
          //             group by bv_commune.id `;
          //         const values = [IdMarcher,wilaya,IdAction,structure];
          //         const [selectTraveaux] = await db
          //           .promise()
          //           .query(query, values);
           
          //         for (const items of selectTraveaux) {
                
          //           const obj = {
                 
          //             volumeTotal: parseFloat(
          //               (items.fin * 100) / items.total
          //             ),
          //             wilaya: items.commune_name_ascii,
          //           };
          //           statList.push(obj);
          //         }
                
          //     } catch (error) {
          //       console.error("Error occurred:", error);
          //     }
          //     }
         
          // }
      
      }
      res.json(statList);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
/** */
const detailImpact = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      let selectedImpact = req.body.selectedImpact;
      let statList = [];
      const query1 = `SELECT bv_tache.intitule_tache ,bv_tache.unite_tache, bv_phase.num_phase,SUM(bv_realisation.volume_realise) as totalrealise,SUM(bv_tache.quantite_tache) as total_prevu FROM bv_action_impactee 
          INNER JOIN bv_phase ON bv_action_impactee.id_action_impactee = bv_phase.id_action_impactee 
          INNER JOIN bv_tache ON bv_phase.id_phase = bv_tache.id_phase 
          LEFT JOIN bv_realisation on bv_tache.id_tache=bv_realisation.id_tache 
          INNER JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code 
          WHERE bv_action_impactee.id_action_impactee=? 
          GROUP BY bv_phase.num_phase,bv_tache.intitule_tache;`;
      const values = [selectedImpact];
      const [selectedImpacts] = await db.promise().query(query1, values);
      for (const impact of selectedImpacts) {
        if (impact.total_prevu !== 0) {
          // Calculate the VolumeTotalRealisation
          let VolumeTotalRealisation = parseFloat(
            ((impact.totalrealise * 100) / impact.total_prevu).toFixed(2)
          );
          statList.push({
            Intituler: impact.intitule_tache,
            volumeTotal: VolumeTotalRealisation,
          });
        }
      }
      res.json(statList);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};


//..
const cardData = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      let statList = [];
      const IdMarcher = req.body.selectedMarche;
     if(req.body.type=="Réalisation")
     {
      const query = `SELECT sum(montant_avance_forf) as sum_avance_for  
        FROM bv_asf  left join bv_attachement on bv_attachement.id_asf= bv_asf.id_asf
               left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
               left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
               left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
               left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
               INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
               INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
               where bv_marche.IDMarche=?`;
      const valueAv = [IdMarcher];
      const [montant_avance_for] = await db.promise().query(query, valueAv);
      const query1 = `SELECT sum(montant_avance_apro) as sum_avance_appro FROM 
         bv_asf  left join bv_attachement on bv_attachement.id_asf= bv_asf.id_asf
               left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
               left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
               left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
               left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
               INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
               INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
               where bv_marche.IDMarche=?`;
      const valueAp = [IdMarcher];
      const [montant_avance_appro] = await db.promise().query(query1, valueAp);

      
      const query3 = `SELECT sum(montant_retenue_garanti) as sum_retenue_garanti FROM 
         bv_asf  left join bv_attachement on bv_attachement.id_asf= bv_asf.id_asf
               left join bv_realisation on bv_attachement.id_attachement=bv_realisation.id_attachement 
               left join bv_tache on bv_realisation.id_tache = bv_tache.id_tache 
               left join bv_phase on  bv_tache.id_phase =bv_phase.id_phase 
               left join  bv_action_impactee on bv_phase.id_action_impactee =bv_action_impactee.id_action_impactee 
               INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
               INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
               where bv_marche.IDMarche=?`;

      const [retenu_garanti] = await db.promise().query(query3, IdMarcher);

      const query2 = `     SELECT 
          SUM(bv_sous_traitance.montant) AS montant_sout, 
          bv_marche.mantant_ht
      FROM 
          bv_marche
      LEFT JOIN 
          bv_entreprise_realisation ON bv_marche.IDMarche = bv_entreprise_realisation.id_marche
      LEFT JOIN 
          bv_sous_traitance ON bv_entreprise_realisation.ID_entreprise = bv_sous_traitance.id_entreprise_realisation
      WHERE 
          bv_marche.IDMarche = ? `;
      const valuesSou = [IdMarcher];
      const [montant_soutraitance] = await db
        .promise()
        .query(query2, valuesSou);
      const montant_so =
        ((montant_soutraitance[0]?.montant_sout || 0) * 100) /
        (montant_soutraitance[0]?.mantant_ht || 1);
      const montant_sous = formatNumberWithoutRounding(montant_so, 2);
      /********************** */

      const pourc_retenu_granti =
      ((retenu_garanti[0].sum_retenue_garanti || 0) * 100) /
      (montant_soutraitance[0]?.mantant_ht || 1);
    const pourc_retenu_granti_round = formatNumberWithoutRounding(pourc_retenu_granti, 2);
      /********************** */
      const pourc_avav_forf =
      ((montant_avance_for[0].sum_avance_for || 0) * 100) /
      (montant_soutraitance[0]?.mantant_ht || 1);
    const pourc_avav_forf_round = formatNumberWithoutRounding(pourc_avav_forf, 2);

    /*****************************/

    const pourc_avav_apro=
    ((montant_avance_appro[0].sum_avance_appro|| 0) * 100) /
    (montant_soutraitance[0]?.mantant_ht || 1);
  const pourc_avav_apro_round = formatNumberWithoutRounding(pourc_avav_apro, 2);
      //*********************** */ Le nombre d entreprise soutraite
       const [nombre_entr]= await db.promise().query(`
                select count(*) as nombre_entr from bv_sous_traitance
                join bv_entreprise_realisation on bv_entreprise_realisation.ID_entreprise= bv_sous_traitance.id_entreprise_realisation
                join bv_marche on bv_entreprise_realisation.id_marche=bv_marche.IDMarche where bv_marche.IDMarche=?`,[IdMarcher])
      const obj = {
        nombre_entr:nombre_entr[0].nombre_entr,
        sum_avance_for: pourc_avav_forf_round,
        sum_avance_appro: pourc_avav_apro_round,
        montant_soutraitance: montant_sous,
        pourc_retenu_granti_round:pourc_retenu_granti_round
      };
      statList.push(obj);
    }
    else
    {
      const query = `SELECT sum(montant_avance_forf) as sum_avance_for  
        FROM bv_situation 
        left join bv_etude on bv_etude.id_sit= bv_situation.ID_situation
        left join  bv_action_impactee on bv_etude.id_action_impactee =bv_action_impactee.id_action_impactee 
        INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
        INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
        where bv_marche.IDMarche=?`;
      const valueAv = [IdMarcher];
      const [montant_avance_for] = await db.promise().query(query, valueAv);
      const query1 = `SELECT sum(montant_avance_apro) as sum_avance_appro FROM 
          bv_situation 
        left join bv_etude on bv_etude.id_sit= bv_situation.ID_situation
        left join  bv_action_impactee on bv_etude.id_action_impactee =bv_action_impactee.id_action_impactee 
               INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
               INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
               where bv_marche.IDMarche=?`;
      const valueAp = [IdMarcher];
      const [montant_avance_appro] = await db.promise().query(query1, valueAp);

      
      const query3 = `SELECT sum(montant_retenue_garanti) as sum_retenue_garanti  
           FROM bv_situation 
        left join bv_etude on bv_etude.id_sit= bv_situation.ID_situation
        left join  bv_action_impactee on bv_etude.id_action_impactee =bv_action_impactee.id_action_impactee
        INNER JOIN bv_action_pro_programme ON bv_action_impactee.id_pro_action_programme = bv_action_pro_programme.id_pro_action_pro
        INNER JOIN bv_marche ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
        where bv_marche.IDMarche=?`;

      const [retenu_garanti] = await db.promise().query(query3, IdMarcher);

      const query2 = `
      SELECT 
          SUM(bv_sous_traitance.montant) AS montant_sout, 
          bv_marche.mantant_ht
      FROM 
          bv_marche
      LEFT JOIN 
          bv_entreprise_realisation ON bv_marche.IDMarche = bv_entreprise_realisation.id_marche
      LEFT JOIN 
          bv_sous_traitance ON bv_entreprise_realisation.ID_entreprise = bv_sous_traitance.id_entreprise_realisation
      WHERE 
          bv_marche.IDMarche = ?
  `;
  
      const valuesSou = [IdMarcher];
      const [montant_soutraitance] = await db
        .promise()
        .query(query2, valuesSou);
      const montant_so =
        ((montant_soutraitance[0]?.montant_sout || 0) * 100) /
        (montant_soutraitance[0]?.mantant_ht || 1);
      const montant_sous = formatNumberWithoutRounding(montant_so, 2);
      /********************** */
console.log(montant_soutraitance[0])
      const pourc_retenu_granti =
      ((retenu_garanti[0].sum_retenue_garanti || 0) * 100) /
      (montant_soutraitance[0]?.mantant_ht || 1);
    const pourc_retenu_granti_round = formatNumberWithoutRounding(pourc_retenu_granti, 2);
      /********************** */
      const pourc_avav_forf =
      ((montant_avance_for[0].sum_avance_for || 0) * 100) /
      (montant_soutraitance[0]?.mantant_ht || 1);
    const pourc_avav_forf_round = formatNumberWithoutRounding(pourc_avav_forf, 2);

    /*****************************/

    const pourc_avav_apro=
    ((montant_avance_appro[0].sum_avance_appro|| 0) * 100) /
    (montant_soutraitance[0]?.mantant_ht || 1);
  const pourc_avav_apro_round = formatNumberWithoutRounding(pourc_avav_apro, 2);
      //*********************** */ Le nombre d entreprise soutraite
       const [nombre_entr]= await db.promise().query(`
                select count(*) as nombre_entr from bv_sous_traitance
                join bv_entreprise_realisation on bv_entreprise_realisation.ID_entreprise= bv_sous_traitance.id_entreprise_realisation
                join bv_marche on bv_entreprise_realisation.id_marche=bv_marche.IDMarche where bv_marche.IDMarche=?`,[IdMarcher])
      const obj = {
        nombre_entr:nombre_entr[0].nombre_entr,
        sum_avance_for: pourc_avav_forf_round,
        sum_avance_appro: pourc_avav_apro_round,
        montant_soutraitance: montant_sous,
        pourc_retenu_granti_round:pourc_retenu_granti_round
      };
      statList.push(obj);
    }
   
      res.json(statList);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const cardPrecCons=async(req,res)=>{
 try {
    await verifyJWT(req, res, async () => {
      structure=req.structure
      wilaya= req.wilaya
      if(structure === "DGF" || structure === "BNEDER" || structure === "MINISTRE" || structure === "SG" || structure=="DGPA")
      {
        if(req.body.selectedwilaya && !req.body.selectedInstProcedure)
          {
            const [procedureConsult]= await db.promise().query(`
            select SUM(CASE WHEN date_cahiercharge IS NOT NULL THEN 1 ELSE 0 END) AS cahiercharge,
            SUM(CASE WHEN date_appeloffre IS NOT NULL THEN 1 ELSE 0 END) AS appeloffre,
            SUM(CASE WHEN date_attribution IS NOT NULL THEN 1 ELSE 0 END) AS attribution,
            SUM(CASE WHEN date_contrat IS NOT NULL THEN 1 ELSE 0 END) AS contrat from bv_marche
            where  bv_marche.code_wilaya=? and bv_marche.IDProgramme=?`,[req.body.selectedwilaya,req.body.idprog])
              res.json({procedureConsult:procedureConsult[0]})
          }
          else if(req.body.selectedwilaya && req.body.selectedInstProcedure)
            {
              const [procedureConsult]= await db.promise().query(`
              select SUM(CASE WHEN date_cahiercharge IS NOT NULL THEN 1 ELSE 0 END) AS cahiercharge,
              SUM(CASE WHEN date_appeloffre IS NOT NULL THEN 1 ELSE 0 END) AS appeloffre,
              SUM(CASE WHEN date_attribution IS NOT NULL THEN 1 ELSE 0 END) AS attribution,
              SUM(CASE WHEN date_contrat IS NOT NULL THEN 1 ELSE 0 END) AS contrat from bv_marche
              where  bv_marche.contractant=? and  bv_marche.code_wilaya=? and bv_marche.IDProgramme=?`,[req.body.selectedInstProcedure,req.body.selectedwilaya,req.body.idprog])
                res.json({procedureConsult:procedureConsult[0]})
              }
          else
          {
            const [procedureConsult]= await db.promise().query(`
            select SUM(CASE WHEN date_cahiercharge IS NOT NULL THEN 1 ELSE 0 END) AS cahiercharge,
            SUM(CASE WHEN date_appeloffre IS NOT NULL THEN 1 ELSE 0 END) AS appeloffre,
            SUM(CASE WHEN date_attribution IS NOT NULL THEN 1 ELSE 0 END) AS attribution,
            SUM(CASE WHEN date_contrat IS NOT NULL THEN 1 ELSE 0 END) AS contrat from bv_marche
            where bv_marche.IDProgramme=?`,[req.body.idprog])
            
            const [procedureConsultWilaya]= await db.promise().query(`
              select wilaya_name_ascii,
               SUM(CASE WHEN date_cahiercharge IS NOT NULL THEN 1 ELSE 0 END) AS cahiercharge,
              SUM(CASE WHEN date_appeloffre IS NOT NULL THEN 1 ELSE 0 END) AS appeloffre,
              SUM(CASE WHEN date_attribution IS NOT NULL THEN 1 ELSE 0 END) AS attribution,
              SUM(CASE WHEN date_contrat IS NOT NULL THEN 1 ELSE 0 END) AS contrat from bv_marche
              join bv_wilaya on bv_marche.code_wilaya =bv_wilaya.wilaya_code
              where bv_marche.IDProgramme=?
              group by bv_wilaya.wilaya_code`,[req.body.idprog])
            
            res.json({procedureConsult:procedureConsult[0],procedureConsultWilaya:procedureConsultWilaya})
          }    
      }
   if(structure=="FORETS" || structure=="WALI")
   {
    if(!req.body.selectedInstProcedure)
      {
        const [procedureConsult]= await db.promise().query(`
        select SUM(CASE WHEN date_cahiercharge IS NOT NULL THEN 1 ELSE 0 END) AS cahiercharge,
        SUM(CASE WHEN date_appeloffre IS NOT NULL THEN 1 ELSE 0 END) AS appeloffre,
        SUM(CASE WHEN date_attribution IS NOT NULL THEN 1 ELSE 0 END) AS attribution,
        SUM(CASE WHEN date_contrat IS NOT NULL THEN 1 ELSE 0 END) AS contrat from bv_marche
        where  bv_marche.code_wilaya=? and bv_marche.IDProgramme=?`,[wilaya,req.body.idprog])
          res.json(procedureConsult[0])
      }
      else
        {
          const [procedureConsult]= await db.promise().query(`
          select SUM(CASE WHEN date_cahiercharge IS NOT NULL THEN 1 ELSE 0 END) AS cahiercharge,
          SUM(CASE WHEN date_appeloffre IS NOT NULL THEN 1 ELSE 0 END) AS appeloffre,
          SUM(CASE WHEN date_attribution IS NOT NULL THEN 1 ELSE 0 END) AS attribution,
          SUM(CASE WHEN date_contrat IS NOT NULL THEN 1 ELSE 0 END) AS contrat from bv_marche
          where  bv_marche.contractant=? and  bv_marche.code_wilaya=? and bv_marche.IDProgramme=?`,[req.body.selectedInstProcedure,wilaya,req.body.idprog])
            res.json(procedureConsult[0])
          }
   }
   if(structure=="DSA" || structure=="HCDS")
   {
    const [procedureConsult]= await db.promise().query(`
      select SUM(CASE WHEN date_cahiercharge IS NOT NULL THEN 1 ELSE 0 END) AS cahiercharge,
      SUM(CASE WHEN date_appeloffre IS NOT NULL THEN 1 ELSE 0 END) AS appeloffre,
      SUM(CASE WHEN date_attribution IS NOT NULL THEN 1 ELSE 0 END) AS attribution,
      SUM(CASE WHEN date_contrat IS NOT NULL THEN 1 ELSE 0 END) AS contrat from bv_marche
      where  bv_marche.contractant=? and  bv_marche.code_wilaya=? and bv_marche.IDProgramme=?`,[structure,wilaya,req.body.idprog])
        res.json(procedureConsult[0])
   }
        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}


//..


const DoughnutChartData = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const detailMarche= req.body.detailMarche
      const selectedButton = req.body.buttonType;
      const structure=req.structure;
  
        if(detailMarche.type_marche=="Etude" )
          {
          if(selectedButton){
            const [actionImpcat] = await db.promise().query(`
              Select * from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              where id_marche=?
             `, [detailMarche.id]);
              const montantActionFini=[];
               const montantActionNonLance=[];
             for (const action of actionImpcat) {
              const [etudeFini] = await db.promise().query(`
               select sum(cout) as montantEtudeFini  FROM bv_etude
               JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
               where bv_action_impactee.id_action_impactee=? and date_validation is not null`,[action.id_action_impactee])
              
             const [etudeNonLance] = await db.promise().query(`
               select sum(cout) as montantEtudNoneLance  FROM bv_etude
               JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
               where bv_action_impactee.id_action_impactee=? and  date_lancement is null `,[action.id_action_impactee])

               let montantTotalActionFini = etudeFini[0].montantEtudeFini
               montantActionFini.push(montantTotalActionFini);
               let montantTotalActionNonLance = etudeNonLance[0].montantEtudNoneLance
               montantActionNonLance.push(montantTotalActionNonLance);
               
               
             }
             let montantTotalActionsfini = 0; 
             for (let i = 0; i < montantActionFini.length; i++) {
              montantTotalActionsfini += montantActionFini[i];
             }
        
             let montantTotalActionsNonLance = 0; 
             for (let i = 0; i < montantActionNonLance.length; i++) {
              montantTotalActionsNonLance += montantActionNonLance[i];
             }

           const[ montantMarche]= await db.promise().query(`select mantant_ht from bv_marche where IDMarche=?
             `, [detailMarche.id])
             const [montantGolobalActions] = await db.promise().query(`
              Select sum(MONTANT_PREVU_RETENU) as montantGolobalAction from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              where id_marche=?
             `, [detailMarche.id]);
           const pourcentageEtudeFini=montantTotalActionsfini/montantMarche[0].mantant_ht
           const pourcentageEtudeNonLance=montantTotalActionsNonLance/montantMarche[0].mantant_ht
           const pourcentageEtudeEnCour=(montantGolobalActions[0].montantGolobalAction/montantMarche[0].mantant_ht)-(pourcentageEtudeFini+pourcentageEtudeNonLance)
           

           
           const pourcEtudeFiniRound = formatNumberWithoutRounding(pourcentageEtudeFini, 2);
           const pourcEtudeNonLanceRound = formatNumberWithoutRounding(pourcentageEtudeNonLance, 2);
           const pourcEtudeEncourRound = formatNumberWithoutRounding(pourcentageEtudeEnCour, 2); 

           // Create the response object
           const result = [
            pourcEtudeFiniRound*100,
            pourcEtudeEncourRound*100,
            pourcEtudeNonLanceRound*100,
         

     
           ];
           
           res.json(result);
          }
    
          else {

            const [actionImpcat] = await db.promise().query(`
              Select * from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              where id_marche=?
             `, [detailMarche.id]);
              const montantAction=[];                           
             for (const action of actionImpcat) {
              const [etude] = await db.promise().query(`
               select 
               
                CASE 
                    WHEN bv_etude.id_sit IS NOT NULL THEN sum(cout)
                    ELSE 0 
                END AS montantEtude FROM bv_etude
                JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
               where bv_phase.id_action_impactee=?`,[action.id_action_impactee])
              
               let montantTotalAction = etude[0].montantEtude
               montantAction.push(montantTotalAction);
               
             }
             let montantTotalActions = 0; 
             for (let i = 0; i < montantAction.length; i++) {
                 montantTotalActions += montantAction[i];
             }
        
           const[ montantMarche]= await db.promise().query(`select mantant_ht from bv_marche where IDMarche=?
             `, [detailMarche.id])
           const pourcentageTravaux=montantTotalActions/montantMarche[0].mantant_ht
        
           const pourcTravauxFiniRound = formatNumberWithoutRounding(pourcentageTravaux, 2);
           const pourcTravauxNonComRound = formatNumberWithoutRounding(1-pourcTravauxFiniRound, 2);
           
           // Create the response object
           const result = [
              pourcTravauxFiniRound*100,
     
              pourcTravauxNonComRound*100,
           ];
           
           res.json(result);
   
        }
          }
          else {
            if(selectedButton)
              {
                const [actionImpcat] = await db.promise().query(`
                 Select id_action_impactee from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                 where id_marche=?
                `, [detailMarche.id]);
                
                 const montantActionRealise=[];
                 const montantActionNonRealise=[];
                for (const action of actionImpcat) {
                 const [tacheR] = await db.promise().query(`
                  select bv_tache.id_tache,bv_tache.prix_ht_tache,montant_global from bv_tache
                  join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                  join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
                  where bv_phase.id_action_impactee=?`,[action.id_action_impactee])
         
                  let montantTotalActionRealise = 0
                  let montantTotalActionNonRealise=0
                  for(const tache of tacheR )
                  {
                      const [realisation]=await db.promise().query(`
                      select sum(volume_realise) as totalrealise from bv_realisation
                      where id_tache =? and bv_realisation.id_attachement is not null`,[tache.id_tache])
                      
                      const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                      const montant = totalRealise * tache.prix_ht_tache;
                       montantTotalActionRealise += montant;
                      
                      const [realisationNonCom]=await db.promise().query(`
                        select sum(volume_realise) as totalrealise from bv_realisation
                        where id_tache =?`,[tache.id_tache])
                        const totalNonRealise = realisationNonCom[0]?.totalrealise || 0;
                  if(totalNonRealise==0)    
                  {
                    montantTotalActionNonRealise += Number(tache.montant_global) || 0;
                  }   
                  }
               
                  montantActionRealise.push(montantTotalActionRealise);
                  montantActionNonRealise.push(montantTotalActionNonRealise);
                  
                }
       
                let montantTotalActions = 0; 
                for (let i = 0; i < montantActionRealise.length; i++) {
                    montantTotalActions += montantActionRealise[i];
                }
                let montantTotalActionsNonR = 0; 
                for (let i = 0; i < montantActionNonRealise.length; i++) {
                  montantTotalActionsNonR += montantActionNonRealise[i];
                }
                

                const [montantGolobalAction] = await db.promise().query(`
                  Select sum(MONTANT_PREVU_RETENU) as montantGolobalAction from bv_action_impactee 
                  Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                  where id_marche=?
                 `, [detailMarche.id]);
           
              const[ montantMarche]= await db.promise().query(`select mantant_ht from bv_marche where IDMarche=?
                `, [detailMarche.id])
              const pourcentageTravauxFini=montantTotalActions/montantMarche[0].mantant_ht
              const pourcentageTravauxNonCommence=montantTotalActionsNonR/montantMarche[0].mantant_ht
              const pourcentageTravauxEnCour=(montantGolobalAction[0].montantGolobalAction/montantMarche[0].mantant_ht)-(pourcentageTravauxFini+pourcentageTravauxNonCommence) 
              const pourcTravauxFiniRound = parseFloat(pourcentageTravauxFini.toFixed(2));
              const pourcTravauxNonComRound = parseFloat(pourcentageTravauxNonCommence.toFixed(2));
              const pourcTravauxEnCourRound = parseFloat(pourcentageTravauxEnCour.toFixed(2));
           
              // Create the response object
              const result = [
                Math.round(pourcTravauxFiniRound * 100),  
                Math.round(pourcTravauxEnCourRound * 100),
                Math.round(pourcTravauxNonComRound * 100)
             ];
              
              res.json(result);
                
              }
              else {
          const [actionImpcat] = await db.promise().query(`
              Select * from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
              where id_marche=?
             `, [detailMarche.id]);
              const montantAction=[];
             for (const action of actionImpcat) {
              const [tacheR] = await db.promise().query(`
               select bv_tache.id_tache,bv_tache.prix_ht_tache
              from bv_tache
               join bv_phase on bv_phase.id_phase=bv_tache.id_phase
               join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
               where bv_phase.id_action_impactee=?`,[action.id_action_impactee])
               const montantTache=[];
               let montantTotalAction = 0
               for(const tache of tacheR )
               {
                 const [realisation]=await db.promise().query(`
                   select 
                      -- Volume réalisé uniquement si id_asf n'est pas null
                    CASE 
                        WHEN bv_attachement.id_asf IS NOT NULL THEN sum(volume_realise)  
                        ELSE 0 
                    END AS totalrealise from bv_realisation
                     LEFT JOIN bv_attachement 
                    ON bv_realisation.id_attachement = bv_attachement.id_attachement
                   where id_tache =? and  bv_realisation.id_attachement is not null`,[tache.id_tache])
                   const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                   const montant = totalRealise * tache.prix_ht_tache; // Calculate montant
                   montantTache.push(montant); // Push montant into the array
                   montantTotalAction += montant;
               }
            
               montantAction.push(montantTotalAction);
               
             }
             let montantTotalActions = 0; 
             for (let i = 0; i < montantAction.length; i++) {
                 montantTotalActions += montantAction[i];
             }
        
           const[ montantMarche]= await db.promise().query(`select mantant_ht from bv_marche where IDMarche=?
             `, [detailMarche.id])
           const pourcentageTravaux=montantTotalActions/montantMarche[0].mantant_ht
        
           const pourcTravauxFiniRound = formatNumberWithoutRounding(pourcentageTravaux, 2);
           const pourcTravauxNonComRound = formatNumberWithoutRounding(1-pourcTravauxFiniRound, 2);
           
           // Create the response object
           const result = [
              pourcTravauxFiniRound*100,
              pourcTravauxNonComRound*100,
           ];
           
           res.json(result);
            }
          }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const DoughnutChartDataProg = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      
      const selectedButton = req.body.buttonType;
      const structure=req.structure;    
        if(req.body.type_marche=="Etude" )
          {
            if(selectedButton){
              const [actionImpcat] = await db.promise().query(`
                Select * from bv_action_impactee 
                Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                join bv_marche on bv_marche.IDmarche=bv_action_pro_programme.id_marche
                where bv_marche.IDProgramme=?
               `, [req.body.idprog]);
                const montantActionFini=[];
                const montantActionNonLance=[];
               for (const action of actionImpcat) {
                const [etudeFini] = await db.promise().query(`
                 select sum(cout) as montantEtudeFini  FROM bv_etude
                  JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
                 where bv_action_impactee.id_action_impactee=? and date_validation is not null`,[action.id_action_impactee])
                
                 const [etudeNonLance] = await db.promise().query(`
                  select sum(cout) as montantEtudNoneLance  FROM bv_etude
                   JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
                  where bv_action_impactee.id_action_impactee=? and  date_lancement is null `,[action.id_action_impactee])
   
                  let montantTotalActionFini = etudeFini[0].montantEtudeFini
                  montantActionFini.push(montantTotalActionFini);
                  let montantTotalActionNonLance = etudeNonLance[0].montantEtudNoneLance
                  montantActionNonLance.push(montantTotalActionNonLance);
                 
                 
                 
               }
               let montantTotalActionsfini = 0; 
               for (let i = 0; i < montantActionFini.length; i++) {
                montantTotalActionsfini += montantActionFini[i];
               }

               
             let montantTotalActionsNonLance = 0; 
             for (let i = 0; i < montantActionNonLance.length; i++) {
              montantTotalActionsNonLance += montantActionNonLance[i];
             }
          
             const[ montantMarche]= await db.promise().query(`select sum(mantant_ht) as mantant_ht from bv_marche
                                                               where IDProgramme=? and type_marche='Etude'
               `, [req.body.idprog])

             
               const [montantGolobalActions] = await db.promise().query(`
                Select sum(MONTANT_PREVU_RETENU) as montantGolobalAction from bv_action_impactee 
                Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                   join bv_marche on bv_action_pro_programme.id_marche= bv_marche.IDMarche
                  where  IDProgramme=? and type_marche='Etude'
               `, [req.body.idprog]);
             const pourcentageEtudeFini=montantTotalActionsfini/montantMarche[0].mantant_ht
             const pourcentageEtudeNonLance=montantTotalActionsNonLance/montantMarche[0].mantant_ht
             const pourcentageEtudeEnCour=(montantGolobalActions[0].montantGolobalAction/montantMarche[0].mantant_ht)-(pourcentageEtudeFini+pourcentageEtudeNonLance)
             
  
             
             const pourcEtudeFiniRound = formatNumberWithoutRounding(pourcentageEtudeFini, 2);
             const pourcEtudeNonLanceRound = formatNumberWithoutRounding(pourcentageEtudeNonLance, 2);
             const pourcEtudeEncourRound = formatNumberWithoutRounding(pourcentageEtudeEnCour, 2); 
  
             // Create the response object
             const result = [
              pourcEtudeFiniRound*100,
              pourcEtudeEncourRound*100,
              pourcEtudeNonLanceRound*100,
           
  
       
             ];
             
             res.json(result);
            }
      
            else {
  
              const [actionImpcat] = await db.promise().query(`
                Select * from bv_action_impactee 
                Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                  join bv_marche on bv_marche.IDmarche=bv_action_pro_programme.id_marche
                where bv_marche.IDProgramme=?
               `, [req.body.idprog]);
                const montantAction=[];                           
               for (const action of actionImpcat) {
                const [etude] = await db.promise().query(`
                 select 
                 
                  CASE 
                      WHEN bv_etude.id_sit IS NOT NULL THEN sum(cout)
                      ELSE 0 
                  END AS montantEtude FROM bv_etude
                 JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_etude.id_action_impactee
                 where bv_action_impactee.id_action_impactee=?`,[action.id_action_impactee])
                
                 let montantTotalAction = etude[0].montantEtude
                 montantAction.push(montantTotalAction);
                 
               }
               let montantTotalActions = 0; 
               for (let i = 0; i < montantAction.length; i++) {
                   montantTotalActions += montantAction[i];
               }
             const[montantMarche]= await db.promise().query(`select sum(mantant_ht ) as mantant_ht from bv_marche where IDProgramme=?`, [req.body.idprog])
             const pourcentageTravaux=montantTotalActions/montantMarche[0].mantant_ht
             const pourcTravauxFiniRound = formatNumberWithoutRounding(pourcentageTravaux, 2);
             const pourcTravauxNonComRound = formatNumberWithoutRounding(1-pourcTravauxFiniRound, 2);     
             const result = [
                pourcTravauxFiniRound*100,
                pourcTravauxNonComRound*100,
             ];
             res.json(result);
            }      

          }
          else {
            if(selectedButton)
              {
                const [actionImpcat] = await db.promise().query(`
                 Select * from bv_action_impactee 
                 Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                join bv_marche on bv_marche.IDmarche=bv_action_pro_programme.id_marche
                where bv_marche.IDProgramme=?
               `, [req.body.idprog]);
              
                 const montantAction=[];
                 const montantActionNonRealise=[];
                for (const action of actionImpcat) {
                 const [tacheR] = await db.promise().query(`
                  select bv_tache.id_tache,bv_tache.prix_ht_tache from bv_tache
                  join bv_phase on bv_phase.id_phase=bv_tache.id_phase
                  join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
                  where bv_phase.id_action_impactee=?`,[action.id_action_impactee])
                  const montantTache=[];
                  let montantTotalActionRealise = 0
                  let montantTotalActionNonRealise=0
                  for(const tache of tacheR )
                  {              
                    const [realisation]=await db.promise().query(`
                      select sum(volume_realise) as totalrealise from bv_realisation
                      where id_tache =? and bv_realisation.id_attachement is not null`,[tache.id_tache])
                      
                      const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                      const montant = totalRealise * tache.prix_ht_tache;
                       montantTotalActionRealise += montant;
                      
                      const [realisationNonCom]=await db.promise().query(`
                        select sum(volume_realise) as totalrealise from bv_realisation
                        where id_tache =?`,[tache.id_tache])
                        const totalNonRealise = realisationNonCom[0]?.totalrealise || 0;
                  if(totalNonRealise==0)    
                  {
                    montantTotalActionNonRealise += Number(tache.montant_global) || 0;
                  } 
                  }
 


                  montantActionNonRealise.push(montantTotalActionNonRealise);

                  montantAction.push(montantTotalActionRealise);
                }
                let montantTotalActions = 0; 
                for (let i = 0; i < montantAction.length; i++) {
                    montantTotalActions += montantAction[i];
                }

                let montantTotalActionsNonR = 0; 
                for (let i = 0; i < montantActionNonRealise.length; i++) {
                  montantTotalActionsNonR += montantActionNonRealise[i];
                }
                

                const [montantGolobalAction] = await db.promise().query(`
                  Select sum(MONTANT_PREVU_RETENU) as montantGolobalAction from bv_action_impactee 
                  Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                  join bv_marche on bv_action_pro_programme.id_marche= bv_marche.IDMarche
                  where  IDProgramme=? and bv_marche.type_marche='Réalisation'
                 `, [req.body.idprog]);
           
              const[ montantMarche]= await db.promise().query(`select sum(mantant_ht) as mantant_ht 
                                                           from bv_marche where IDProgramme=? and bv_marche.type_marche='Réalisation'
                `, [req.body.idprog])



                const pourcentageTravauxFini=montantTotalActions/montantMarche[0].mantant_ht
                const pourcentageTravauxNonCommence=montantTotalActionsNonR/montantMarche[0].mantant_ht
                const pourcentageTravauxEnCour=(montantGolobalAction[0].montantGolobalAction/montantMarche[0].mantant_ht)-(pourcentageTravauxFini+pourcentageTravauxNonCommence) 
                const pourcTravauxFiniRound = parseFloat(pourcentageTravauxFini.toFixed(2));
                const pourcTravauxNonComRound = parseFloat(pourcentageTravauxNonCommence.toFixed(2));
                const pourcTravauxEnCourRound = parseFloat(pourcentageTravauxEnCour.toFixed(2));
             
                // Create the response object
                const result = [
                  Math.round(pourcTravauxFiniRound * 100),  
                  Math.round(pourcTravauxEnCourRound * 100),
                  Math.round(pourcTravauxNonComRound * 100)
               ];
                
                res.json(result);
              
           
                
              }
              else {
          const [actionImpcat] = await db.promise().query(`
              Select * from bv_action_impactee 
              Join bv_action_pro_programme  on bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
             join bv_marche on bv_marche.IDmarche=bv_action_pro_programme.id_marche
                where bv_marche.IDProgramme=?
               `, [req.body.idprog]);
              const montantAction=[];
             for (const action of actionImpcat) {
              const [tacheR] = await db.promise().query(`
               select bv_tache.id_tache,bv_tache.prix_ht_tache
                from bv_tache
               join bv_phase on bv_phase.id_phase=bv_tache.id_phase
               join bv_action_impactee on bv_phase.id_action_impactee= bv_action_impactee.id_action_impactee 
               where bv_phase.id_action_impactee=?`,[action.id_action_impactee])
               const montantTache=[];
               let montantTotalAction = 0
               for(const tache of tacheR )
               {
                 const [realisation]=await db.promise().query(`
                   select 
                      -- Volume réalisé uniquement si id_asf n'est pas null
                    CASE 
                        WHEN bv_attachement.id_asf IS NOT NULL THEN sum(volume_realise)  
                        ELSE 0 
                    END AS totalrealise from bv_realisation
                     LEFT JOIN bv_attachement 
                    ON bv_realisation.id_attachement = bv_attachement.id_attachement
                   where id_tache =? `,[tache.id_tache])
                   const totalRealise = realisation[0]?.totalrealise || 0; // Ensure it's a number
                   const montant = totalRealise * tache.prix_ht_tache; // Calculate montant
                   montantTache.push(montant); // Push montant into the array
                   montantTotalAction += montant;
               }
            
               montantAction.push(montantTotalAction);
               
             }
             let montantTotalActions = 0; 
             for (let i = 0; i < montantAction.length; i++) {
                 montantTotalActions += montantAction[i];
             }
        
           const[ montantMarche]= await db.promise().query(`select sum(mantant_ht) as mantant_ht from bv_marche where IDProgramme=?
             `, [req.body.idprog])
           const pourcentageTravaux=montantTotalActions/montantMarche[0].mantant_ht
        
           const pourcTravauxFiniRound = formatNumberWithoutRounding(pourcentageTravaux, 2);
           const pourcTravauxNonComRound = formatNumberWithoutRounding(1-pourcTravauxFiniRound, 2);
           
           // Create the response object
           const result = [
              pourcTravauxFiniRound*100,
              pourcTravauxNonComRound*100,
           ];
           
           res.json(result);
            }
       }
      
    
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};


const PlanAction = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const structure=req.structure;
      if (structure == "BNEDER" || structure == "DGF" || structure == "SG" || structure == "MINISTRE")
      {
        const[ planactiion]= await db.promise().query(`SELECT 
    bv_action_programme.action, UNITE,
    COUNT(bv_action_programme.action) AS nombre,
    SUM(bv_action_impactee.VOLUME_VALIDE) AS volume,
    MAX(bv_action_impactee.COUT_UNITAIRE_VALIDE) AS COUT_UNITAIRE_VALIDE, 
    SUM(CASE WHEN bv_marche.type_marche = 'Réalisation' THEN bv_action_impactee.MONTANT_PREVU_RETENU ELSE 0 END) AS montant_realisation,
    SUM(CASE WHEN bv_marche.type_marche = 'Étude' THEN bv_action_impactee.MONTANT_PREVU_RETENU ELSE 0 END) AS montant_etude
FROM bv_action_impactee 
JOIN bv_action_pro_programme  
    ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
JOIN bv_action_programme 
    ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
JOIN bv_marche 
    ON bv_action_pro_programme.id_marche = bv_marche.IDMarche
WHERE IDProgramme = ?
GROUP BY bv_action_programme.action;

          `, [req.body.idprog])
          res.json(planactiion)
      }
     
      
    
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

/* *** Dictionnaire *** */
const getMarcher = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya = req.wilaya;

      if (structure == "BNEDER" || structure == "DGF" || structure == "MINISTRE" || structure == "SG") {
        const query = `SELECT IDMarche,type_marche,num_marche,echelle,code_wilaya,contractant FROM bv_marche WHERE IDProgramme = ?`;
        const valuesS = [req.body.idprog];
        const [marches] = await db.promise().query(query, valuesS);
        res.json({
          marches: marches,
        });
      } else {
        let query
        let valuesS
        if(structure=="WALI" || structure=="FORETS")
        {
          query = `
          SELECT IDMarche, type_marche,num_marche, echelle, code_wilaya, contractant 
          FROM bv_marche 
          WHERE IDProgramme = ? 
          AND (
              (echelle = 'National')
              OR 
              (echelle = 'Régional' AND code_wilaya = ? ) 
          );
      `;
      
           valuesS = [req.body.idprog, wilaya];
        }
         else{
          query = `
          SELECT IDMarche,type_marche ,num_marche, echelle, code_wilaya, contractant 
          FROM bv_marche 
          WHERE IDProgramme = ? 
          AND (
              (echelle = 'National')
              OR 
              (echelle = 'Régional' AND code_wilaya = ? AND contractant =?) 
          );
      `;
      
           valuesS = [req.body.idprog, wilaya,structure];
         }
        const [marches] = await db.promise().query(query, valuesS);
        res.json({
          marches: marches,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const getCommune = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const structure = req.structure;
      const wilaya = req.wilaya;
      const wilayat = req.body.wilaya;
      const selectedAction = req.body.selectedAction;
      if (structure == "BNEDER" || structure == "DGF") {
        const query = `SELECT bv_commune.id,bv_commune.commune_name_ascii FROM bv_action_impactee 
        INNER JOIN bv_commune ON bv_action_impactee.code_commune=bv_commune.id 
        WHERE bv_action_impactee.id_pro_action_programme=? AND bv_action_impactee.code_wilaya=?
        GROUP BY bv_action_impactee.code_commune;`;
        const valuesS = [selectedAction, wilayat];
        const [communes] = await db.promise().query(query, valuesS);
        res.json({
          communes: communes,
        });
      } else {
        const query = `SELECT bv_commune.id,bv_commune.commune_name_ascii FROM bv_action_impactee 
        INNER JOIN bv_commune ON bv_action_impactee.code_commune=bv_commune.id 
        WHERE bv_action_impactee.id_pro_action_programme=? AND bv_action_impactee.code_wilaya=?
        GROUP BY bv_action_impactee.code_commune;`;
        const valuesS = [selectedAction, wilaya];
        const [communes] = await db.promise().query(query, valuesS);
        res.json({
          communes: communes,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const getLieuDit = async (req, res) => {
  try {
    await verifyJWT(req, res, async () => {
      const map=req.body.map;
      const selectedCommune = req.body.selectedCommune;
      const selectedAction = req.body.selectedAction;
      if(map)
      {
 
        const query = `SELECT LOCALITES  FROM bv_action_impactee WHERE bv_action_impactee.code_commune=? `;
        const valuesS = [selectedCommune];
        const [lieuDit] = await db.promise().query(query, valuesS);
        res.json({
          lieuDit: lieuDit,
        });
      }
      else
      {
    
        const query = `SELECT id_action_impactee,LOCALITES as LieuDit FROM bv_action_impactee WHERE bv_action_impactee.code_commune=? AND id_pro_action_programme=?;`;
        const valuesS = [selectedCommune, selectedAction];
        const [lieuDit] = await db.promise().query(query, valuesS);
        res.json({
          lieuDit: lieuDit,
        });
      }
 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};  
const getPathGeo = async (req, res) => {
  try {
    const getValueByKey = (key) => {
      if (Array.isArray(req.body.selectionFilter)) {
        for (let i = 0; i < req.body.selectionFilter.length; i++) {
          if (req.body.selectionFilter[i][key] !== undefined) {
            return req.body.selectionFilter[i][key];
          }
        }
      }
      return null; // If selectionFilter is not an array or the key doesn't exist
    };

    await verifyJWT(req, res, async () => {
      const selectedMarche = req.body.selectedMarche;
      const structure = req.structure;
      const wilaya = req.wilaya;
      const actionValue = getValueByKey("action");  // Get action value
      const wilayaValue = getValueByKey("wilaya");  // Get wilaya value
      const communeValue = getValueByKey("commune");  // Get commune value
      const localiteValue = getValueByKey("localite");  // Get localite value

      let queryConditions = `WHERE bv_action_pro_programme.id_marche = ?`; // Default condition

      // Add conditions for actionValue, wilayaValue, communeValue, and localiteValue if they exist
      if (actionValue) {
        queryConditions += ` AND id_pro_action_programme = ?`;
      }
      if (wilayaValue) {
        queryConditions += ` AND bv_wilaya.wilaya_code = ?`;
      }
      if (communeValue) {
        queryConditions += ` AND bv_commune.id = ?`;
      }
      if (localiteValue) {
        queryConditions += ` AND LOCALITES = ?`;
      }

      if (structure === "DGF" || structure === "BNEDER" || structure === "MINISTRE" || structure === "SG") {
        const query = `SELECT chemin, bv_action_impactee.id_action_impactee, action, LOCALITES, wilaya_name_ascii, commune_name_ascii
                       FROM bv_geoloclisation
                       JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
                       JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                       JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
                       JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                       JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
                       ${queryConditions}`;
        const valuesS = [selectedMarche];
        if (actionValue) valuesS.push(actionValue);
        if (wilayaValue) valuesS.push(wilayaValue);
        if (communeValue) valuesS.push(communeValue);
        if (localiteValue) valuesS.push(localiteValue);
        const [paths] = await db.promise().query(query, valuesS);
        res.json(paths);
      }

      if (structure === "DGPA") {
        const query = `SELECT chemin, bv_action_impactee.id_action_impactee, action, LOCALITES, wilaya_name_ascii, commune_name_ascii
                       FROM bv_geoloclisation
                       JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
                       JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                       JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
                       JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                       JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
                       ${queryConditions} 
                         AND (bv_action_impactee.INSTITUTION_PILOTE = "DSA" OR bv_action_impactee.INSTITUTION_PILOTE = "HCDS")`;
        const valuesS = [selectedMarche];
        if (actionValue) valuesS.push(actionValue);
        if (wilayaValue) valuesS.push(wilayaValue);
        if (communeValue) valuesS.push(communeValue);
        if (localiteValue) valuesS.push(localiteValue);
        const [paths] = await db.promise().query(query, valuesS);
        res.json(paths);
      }

      if (structure === "FORETS" || structure === "WALI") {
        const query = `SELECT chemin, bv_action_impactee.id_action_impactee, action, LOCALITES, wilaya_name_ascii, commune_name_ascii
                       FROM bv_geoloclisation
                       JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
                       JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                       JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
                       JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                       JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
                       ${queryConditions}`;
        const valuesS = [selectedMarche];
        if (actionValue) valuesS.push(actionValue);
        if (wilaya) valuesS.push(wilaya);
        if (communeValue) valuesS.push(communeValue);
        if (localiteValue) valuesS.push(localiteValue);
        const [paths] = await db.promise().query(query, valuesS);
        res.json(paths);
      }

      if (structure === "DSA" || structure === "HCDS") {
        const query = `SELECT chemin, bv_action_impactee.id_action_impactee, action, LOCALITES, wilaya_name_ascii, commune_name_ascii
                       FROM bv_geoloclisation
                       JOIN bv_action_impactee ON bv_action_impactee.id_action_impactee = bv_geoloclisation.id_action_impacte
                       JOIN bv_action_pro_programme ON bv_action_pro_programme.id_pro_action_pro = bv_action_impactee.id_pro_action_programme
                       JOIN bv_commune ON bv_action_impactee.code_commune = bv_commune.id
                       JOIN bv_wilaya ON bv_action_impactee.code_wilaya = bv_wilaya.wilaya_code
                       JOIN bv_action_programme ON bv_action_programme.IDaction_programme = bv_action_pro_programme.id_action_programme
                       ${queryConditions}
                         AND bv_action_impactee.INSTITUTION_PILOTE = ?`;
        const valuesS = [selectedMarche, structure];
        if (actionValue) valuesS.push(actionValue);
        if (wilaya) valuesS.push(wilaya);
        if (communeValue) valuesS.push(communeValue);
        if (localiteValue) valuesS.push(localiteValue);
        const [paths] = await db.promise().query(query, valuesS);
        res.json(paths);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
 

module.exports = {
  getMarcher,getPathGeo,
  getCommune,
  getLieuDit,
  realisationBarCharts,
  realiationBarChartAct,
  realiationBarChartwilaya,
  detailImpact,
  cardData,cardPrecCons,
  DoughnutChartData,
  DoughnutChartDataProg,
  PlanAction
};
