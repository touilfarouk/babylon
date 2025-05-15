import React, { useState, useEffect, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import { useReactToPrint } from "react-to-print";
import { Toolbar } from "primereact/toolbar";
import {SetDetailSituation,GetDetailDecompt} from "../../utils/APIRoutes";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
export default function DetailDecompt (props)
{
  const [loading,setloading]=useState(false)
  const [detaildecompt,setdetaildecompt]=useState([])
  const [infodecompt,setinfodecompt]=useState([])
  const [infAtt,setinfAtt]=useState([])
  const componentRef = useRef();
  const token = localStorage.getItem("token");
  const [totalMontantPrevu, setTotalMontantPrevu] = useState(0);
  const [totalMontantRealisePrecedemment, setTotalMontantRealisePrecedemment] = useState(0);
  const [totalMontantRealiseSituation, setTotalMontantRealiseSituation] = useState(0);
  const [totalMontantRealiseCumule, setTotalMontantRealiseCumule] = useState(0);
  const toastTopLeft = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `@media print { @page { size: landscape; } }`,
  });
  const headerRight=()=>{
    return( 
      <>
      <Button  label="Imprimer" raised style={{backgroundColor: 'var(--orange-600)',borderColor:'var(--orange-600)'}}  onClick={() => {  handlePrint()  }} className="mr-2" />
      <Button  label="vallider" raised style={{backgroundColor: 'var(--green-600)',borderColor:'var(--green-600)'}}  onClick={() => { setloading(true); setDetailAsf()  }} className="mr-2" />
      </>  )
  }
  const getDecomptDetail = () => {
    fetch(GetDetailDecompt, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        IDMarche:props.IDMarche,
        id_asf: props.idasf,
      }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setdetaildecompt(data.tableauResultats);
        setinfodecompt(data.infasf);
        setinfAtt(data.tableauAtt)
   
      });
  };
  const setDetailAsf = () => {
    fetch(SetDetailSituation, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        detail:detaildecompt,
        id_asf: props.idasf,
        IDMarche:props.IDMarche
      }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        if(data=="true")
          {
            setloading(false)
            toastTopLeft.current.show({
              severity: 'success',
              summary: "Succées",
              detail: "Validation avec succées",
              life: 4000,
            });
          }
 
      });
  };
  useEffect(() => {
    getDecomptDetail();
  }, []);
  useEffect(() => {
    // Fonction pour calculer les totaux
    const calculateTotals = () => {
      let totalMontantPrevu = 0;
      let totalMontantRealisePrecedemment = 0;
      let totalMontantRealiseSituation = 0;
      let totalMontantRealiseCumule = 0;
  
      detaildecompt.forEach((sousTableau, index) => {
        sousTableau.forEach((obj) => {
          console.log(obj.total*obj.prix_ht_tache)
          totalMontantPrevu += obj.total?obj.total * obj.prix_ht_tache:0;
          totalMontantRealisePrecedemment += obj.volume_realise_antr_asf ? obj.volume_realise_antr_asf * obj.prix_ht_tache : 0;
          totalMontantRealiseSituation += obj.totalrealise ? obj.totalrealise * obj.prix_ht_tache : 0;
          totalMontantRealiseCumule += obj.totalrealise ? (obj.totalrealise * obj.prix_ht_tache) + (obj.volume_realise_antr_asf ? obj.volume_realise_antr_asf * obj.prix_ht_tache : 0) : 0;
        });
      });
  
      // Mettre à jour les totaux dans l'état local
     
      setTotalMontantPrevu(totalMontantPrevu);
      setTotalMontantRealisePrecedemment(totalMontantRealisePrecedemment);
      setTotalMontantRealiseSituation(totalMontantRealiseSituation);
      setTotalMontantRealiseCumule(totalMontantRealiseCumule);
    };
  
    // Appeler la fonction de calcul des totaux après la mise à jour des données
    if (detaildecompt.length > 0) {
      calculateTotals();
    }
  }, [detaildecompt]);
  const countIdActionImpacteeForTache = (taches) => {
    const idActionImpacteeCounts = {}; // Un objet pour stocker les comptes de chaque id_action_impactee
  
    // Compter le nombre de répétitions de chaque id_action_impactee pour chaque tâche
    taches.forEach((tache) => {
      const idActionImpactee = tache.id_action_impactee;
      idActionImpacteeCounts[idActionImpactee] = (idActionImpacteeCounts[idActionImpactee] || 0) + 1;
    });
  
    return idActionImpacteeCounts;
  };

    return(    
    <Dialog  headerStyle={{ backgroundColor: 'var(--green-400)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}} header="Décompte de la wilaya" visible={props.detaildecompt} style={{ width: '80vw' }} onHide={() => props.setdetaildecompt(false)}>
                  {loading &&
    
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)", display: "flex",justifyContent: "center",  alignItems: "center",pointerEvents: "none",zIndex: "999"}}

    >
<ProgressSpinner   style={{

height: "3rem",

width: "3rem",

}} /> </div>} 
         <Toast ref={toastTopLeft} />
        <Toolbar className="mb-2 mt-1" left={headerRight}></Toolbar>
         <div ref={componentRef} className="m-5" >
         <div className="col-12   text-center square  mb-8 ">
            <center>
              <p>
                <u>
                  REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</u>
                  <br/>
                  <u>
                   Ministère de
                  l’Agriculture et de Développement Rural</u>
                  <br/>
                  {infodecompt.INSTITUTION_PILOTE=="FORETS" && (
                      <>
                      <u>
                        Conservation des Forêts de la Wilaya de{" "}
                        {infodecompt.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infodecompt.INSTITUTION_PILOTE=="DSA" && (
                      <>
                      <u>
                      Direction  des Services Agricoles de la Wilaya de {" "}
                        {infodecompt.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infodecompt.INSTITUTION_PILOTE=="HCDS" && (
                      <>
                      <u>
                      Haut-Commissariat au Développement de la Steppe de la Wilaya de 
 {" "}
                        {infodecompt.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
               
              </p>
              <br/>
          
            </center>
         
         
          <div className="table-container-att mt-6">
          <table style={{ border: '1px solid #000', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th>Action</th>
      <th>Phase</th>
      <th>Tâche</th>
      <th>Unité</th>
      <th>Cout unitaire (HT)</th>
      <th>Volume prévu</th>
      <th>Volume réalisé précedement</th>
      <th>Volume réalisé de la situation</th>
      <th>Volume réalisé cumulé</th>
      <th>Montant prévu(HT)</th>
      <th>Montant réalisé précedement</th>
      <th>Montant réalisé de la situation</th>
      <th>Montant réalisé cumulé</th>
    </tr>
  </thead>
  <tbody>
    {detaildecompt.map((sousTableau, index) => {
      const [actionObj, ...rest] = sousTableau;
      const action = actionObj.action;
      return rest.map((obj, objIndex) => (
        <tr key={`${action}-${obj.intitule_tache}`}>
          {objIndex === 0 ? (
            <td rowSpan={rest.length}>
                <div>{action}</div>
            </td>
          ) : null}
          <td style={{fontSize: '16px'}}>{"Phase 0" + obj.num_phase}</td>
          <td style={{fontSize: '16px'}}>{obj.intitule_tache}</td>
          <td style={{fontSize: '16px'}}>{obj.unite_tache}</td>
          <td style={{fontSize: '16px'}}> {(Number(obj.prix_ht_tache) || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA</td>
          <td style={{fontSize: '16px'}}>{obj.total}</td>
          <td style={{fontSize: '16px'}}>{obj.volume_realise_antr_asf?obj.volume_realise_antr_asf.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'}</td>
          <td style={{fontSize: '16px'}}>{obj.totalrealise ? obj.totalrealise.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : `-`}</td>
          <td style={{fontSize: '16px'}}>{obj.volume_realise_antr_asf ? (obj.totalrealise + obj.volume_realise_antr_asf).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })  : `-`}</td>
          <td style={{fontSize: '16px'}}>{(obj.total * obj.prix_ht_tache).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style={{fontSize: '16px'}}>{obj.volume_realise_antr_asf ? (obj.volume_realise_antr_asf * obj.prix_ht_tache).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>
          <td style={{fontSize: '16px'}}>{obj.totalrealise ? (obj.totalrealise * obj.prix_ht_tache).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'}</td>
          <td style={{fontSize: '16px'}}>{obj.totalrealise != null  ? ((obj.totalrealise * obj.prix_ht_tache) + (obj.prix_ht_tache * obj.volume_realise_antr_asf)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>
        </tr>
      ));
    })}
    <tr>
      <td  style={{fontSize: '16px'}} className="font-bold" colSpan={9}>Total</td>
      <td style={{fontSize: '16px'}} className="font-bold">{totalMontantPrevu.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}} className="font-bold">{totalMontantRealisePrecedemment.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}} className="font-bold">{totalMontantRealiseSituation.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}} className="font-bold">{totalMontantRealiseCumule.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
    <tr>
      <td style={{fontSize: '16px'}} className="font-bold" colSpan={9}>TVA (19%)</td>
      <td style={{fontSize: '16px'}} className="font-bold">{(totalMontantPrevu * 0.19).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}} className="font-bold">{(totalMontantRealisePrecedemment * 0.19).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}} className="font-bold">{(totalMontantRealiseSituation * 0.19).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}} className="font-bold">{(totalMontantRealiseCumule * 0.19).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
    <tr>
      <td style={{fontSize: '16px'}} className="font-bold" colSpan={9}>TOTAL TTC</td>
      <td style={{fontSize: '16px'}} className="font-bold">{(totalMontantPrevu + (totalMontantPrevu * 0.19)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}}className="font-bold">{(totalMontantRealisePrecedemment + (totalMontantRealisePrecedemment * 0.19)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}} className="font-bold">{(totalMontantRealiseSituation + (totalMontantRealiseSituation * 0.19)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td style={{fontSize: '16px'}} className="font-bold">{(totalMontantRealiseCumule + (totalMontantRealiseCumule * 0.19)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    </tr>
  </tbody>
</table>

 {/* <table style={{ border: '1px solid #000', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th>Action</th>
      <th>Phase</th>
      <th>Tâche</th>
      <th>Unité</th>
      <th>Cout unitaire (HT)</th>
      <th>Volume prévu</th>
      <th>Volume réalisé précedement</th>
      <th>Volume réalisé de la situation</th>
      <th>Volume réalisé cumulé</th>
      <th>Montant prévu(HT)</th>
      <th>Montant réalisé précedement</th>
      <th>Montant réalisé de la situation</th>
      <th>Montant réalisé cumulé</th>
    </tr>
  </thead>
  <tbody>
    {detaildecompt.map((sousTableau, index) => {
      const [actionObj, ...rest] = sousTableau;
      const action = actionObj.action;
      return rest.map((obj, objIndex) => (
        <tr key={`${action}-${obj.intitule_tache}`}>
          {objIndex === 0 ? (
            <td rowSpan={rest.length}>
              <div>{action}</div>
            </td>
          ) : null}
          <td>{"Phase 0"+obj.num_phase}</td>
          <td>{obj.intitule_tache}</td>
          <td>{obj.unite_tache}</td>
          <td>{obj.prix_ht_tache} DA</td>
          <td>{obj.total}</td>
          <td>{obj.volume_realise_antr_asf}</td>
          <td>{obj.totalrealise ? obj.totalrealise : `-`}</td>
          <td>{obj.volume_realise_antr_asf ? obj.totalrealise+obj.volume_realise_antr_asf : `-`}</td>
          <td>{obj.total * obj.prix_ht_tache }</td>
          <td>{obj.volume_realise_antr_asf ?obj.volume_realise_antr_asf * obj.prix_ht_tache :'-'}</td>
          <td>{obj.totalrealise * obj.prix_ht_tache }</td>
          <td>{obj.totalrealise ? obj.totalrealise * obj.prix_ht_tache + obj.prix_ht_tache*obj.volume_realise_antr_asf :'-' }</td>
        </tr>
      ));
    })}
     <tr>
          <td  className="font-bold"colSpan={9}>Total</td>
          <td className="font-bold">{totalMontantPrevu}</td>
          <td className="font-bold">{totalMontantRealisePrecedemment}</td>
          <td className="font-bold">{totalMontantRealiseSituation}</td>
          <td className="font-bold">{totalMontantRealiseCumule}</td>
      
        </tr>
        <tr>
          <td className="font-bold" colSpan={9}>TVA (19%)</td>
          <td className="font-bold">{(totalMontantPrevu * 0.19).toFixed(2)}</td>
          <td className="font-bold">{(totalMontantRealisePrecedemment * 0.19).toFixed(2)}</td>
          <td className="font-bold">{(totalMontantRealiseSituation * 0.19).toFixed(2)}</td>
          <td className="font-bold">{(totalMontantRealiseCumule * 0.19).toFixed(2)}</td>
      
        </tr>
        <tr>
  <td className="font-bold" colSpan={9}>TOTAL TTC</td>
  <td className="font-bold">{(totalMontantPrevu + (totalMontantPrevu * 0.19)).toFixed(2)}</td>
  <td className="font-bold">{(totalMontantRealisePrecedemment + (totalMontantRealisePrecedemment * 0.19)).toFixed(2)}</td>
  <td className="font-bold">{(totalMontantRealiseSituation + (totalMontantRealiseSituation * 0.19)).toFixed(2)}</td>
  <td className="font-bold">{(totalMontantRealiseCumule + (totalMontantRealiseCumule * 0.19)).toFixed(2)}</td>
</tr>
  </tbody>
</table> */}

</div> 
         </div>  
      
      
         </div>
         
</Dialog>)
}