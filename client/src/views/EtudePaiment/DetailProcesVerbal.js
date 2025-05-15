import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { useReactToPrint } from "react-to-print";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { classNames } from 'primereact/utils';
import { Toolbar } from "primereact/toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {getPvProvesoireDetail,UpdatePvProvesoire} from "../../utils/APIRoutes";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
export default function DetailProcesVerbal (props)
{
  const idprog= useParams().idprog;
  const [infpv,setinfpv]=useState([])
  const [DetailPv,setDetailPv]=useState([])
  const componentRef = useRef();
  const [updatePv,setupdatePv]=useState({id_pv_pro:props.id_pv_pro})
  const [submittedIm, setSubmittedIm] = useState(false);
  const token = localStorage.getItem("token");
  const currentYear= getCurrentYear();
  const toast = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const headerRight=()=>{
    return( 
      <>
      <Button  label="Imprimer" raised style={{backgroundColor: 'var(--orange-600)',borderColor:'var(--orange-600)'}}  onClick={() => {  handlePrint()  }} className="mr-2" />
      </>  )
 
  }
 
/*************************************************************************************/
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    if (e.target.name === 'date') {
      const originalDate = new Date(val);
      if (!isNaN(originalDate.getTime())) {
        const newDate = new Date(originalDate);
        newDate.setDate(newDate.getDate() + 1);
        val = newDate.toISOString().slice(0, 10);
      } else {
        console.error('Invalid date:', val);
      }
    }
    let pv = { ... updatePv };
    pv[`${name}`] = val;
    setupdatePv(pv);
   
  };
  const getDetailPv =()=>
    {
      fetch(getPvProvesoireDetail, {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({id_pv_pro:props.id_pv_pro,IDMarche:props.marcheid}),
                })
                  .then((reponse) => reponse.json())
                  .then((data) => {
                  setinfpv(data.infopv)
                  setupdatePv((prev) => ({ ...prev, ...data.infopv }));
                  setDetailPv(data.detailpv)
                  });
    }
  /************************** */
  const _updatePv = () => {
 
      if( !updatePv.signataire || !updatePv.date)
      {
        setSubmittedIm(true)
      }
      else
      {
        fetch(UpdatePvProvesoire, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePv),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
            if(data=="true")
             { toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Les informations du PV provisoire ont été enregistrées avec succès.', life: 3000 }); }
          });
      }
 
    
  };

  /***************************************annee************************************/
  function getCurrentYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }
  /********************************************************************************/
  useEffect(() => {
    getDetailPv()
  }, []);   
  const extractYear = (dateString) => {
    if (!dateString) return 'Year not found';
    const match = dateString.match(/\d{4}/);
    return match ? match[0] : 'Year not found';
  };
  const getTypeEtude = (type_etude) => {
    switch (type_etude) {
      case 5:
        return 'Preliminaire';
  
       case 3:
         return 'Exécution';
       case 2:
        return 'Faisabilité';
      default:
        return type_etude;
    }
  };
    return(    
    <Dialog header="Proces verbal de recepetion provisoire"  headerStyle={{ backgroundColor: 'var(--green-400)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}} visible={true} style={{ width: '75vw' }} onHide={() => props.setdetailpv(false)}>
     <Toast ref={toast} />
    <Accordion multiple activeIndex={[0,1]} style={{ color: "#fff", marginTop: "1rem" }}>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="Les informations de l'attestation service fait">
        <div className="flex flex-wrap gap-3 p-fluid pr-3">
        <div className="flex-auto">
          <label htmlFor="phone" className="font-bold block mb-2">
             Date de procès verbal de récéption provisoire
            </label>
            <InputNumber  
              value={updatePv.num_pv} 
            onValueChange={(e) => onInputChange(e,'num_pv')}
            className={classNames({ 'p-invalid': submittedIm && !updatePv.num_pv})} />
             {submittedIm && !updatePv.num_pv && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
          <label htmlFor="phone" className="font-bold block mb-2">
             Date de procès verbal de récéption provisoire
            </label>
            <Calendar  
              value={updatePv.date!= null ? new Date(updatePv.date) : null }  showIcon
             dateFormat="dd/mm/yy"
            onChange={(e) => onInputChange(e,'date')}
            className={classNames({ 'p-invalid': submittedIm && !updatePv.date})} />
             {submittedIm && !updatePv.date && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">

          {infpv.INSTITUTION_PILOTE=="HCDS"&&<label htmlFor="ssn" className="font-bold block mb-2">
             Haut-Commissaire au Développement de la Steppe 
            </label>}{ infpv.INSTITUTION_PILOTE=="FORETS"&& <label htmlFor="ssn" className="font-bold block mb-2">
            Conservateur des Forêts
            </label>}
            { infpv.INSTITUTION_PILOTE=="DSA"&& <label htmlFor="ssn" className="font-bold block mb-2">
             Directeur des Services Agricoles
            </label>}
            <InputText
            value={updatePv.signataire}
            onChange={(e) => onInputChange(e,'signataire')}
            className={classNames({ 'p-invalid': submittedIm && !updatePv.signataire})}
            />
              {submittedIm && !updatePv.signataire && <small className="p-error">Champ obligatoire !</small>}
          </div>
      
        </div>
     
        <div className="flex justify-content-end mt-3">
        <Button
            label="Enregistrer les modifications"            
            icon="pi pi-check" raised    
            style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-300)', borderRadius: 'var(--border-radius)' }}
            onClick={(e) => {
              _updatePv()
            }}
        />
        </div>
        </AccordionTab>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="Detail de l'attestation service fait">
        <Toolbar className="mb-2 mt-1" left={headerRight}></Toolbar>
         <div ref={componentRef} className="m-5" >
         <div className="col-12 text-center square pt-4 border-1 p-2 " style={{ width: '27cm', minHeight: '39.7cm', margin: 'auto'}}>
            <center>
              <p style={{fontSize: '18px'}}>
                <u>
                  REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</u>
                  <br/>
                  <u>
                   Ministère de
                  l’Agriculture et de Développement Rural</u>
                  <br/>
                  <u>Direction Générale des Forêts</u>
                  <br/>
                  {infpv.INSTITUTION_PILOTE=="FORETS" && (
                      <>
                
                      <u>
                        Conservation des Forêts de la Wilaya de{" "}
                        {infpv.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infpv.INSTITUTION_PILOTE=="DSA" && (
                      <>
                      <u>
                      Direction  des Services Agricoles de la Wilaya de {" "}
                        {infpv.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infpv.INSTITUTION_PILOTE=="HCDS" && (
                    
                      <u>
                      Haut-Commissariat au Développement de la Steppe de la Wilaya de 
 {" "}
                        {infpv.wilaya_name_ascii}.
                      </u>
                  ) }
              </p>
              <br/>
              <h2><u>Procès-verbal de réception provisoire des études N° {infpv.num_pv}</u></h2>
              {infpv.id_Avenant && <h4><u>AVENANT N°{infpv.num_avenant} du {infpv.date_notif_ods} AU MARCHE N°{infpv.num_marche} du {infpv.date_notification_ods}</u> </h4>}
            
          
           
            </center>   <br/>   <br/>
    <div className="col-12 offset-3 m-3" style={{ fontSize: '21px',textAlign: 'left', lineHeight: '1.7' }}>
   <u>Intitulé du marché :</u>   {infpv.intitule_marche}
   <br/> 
   <u>Cadre de référence :</u>   {}
   <br/>
   <u>Source de financement :</u> Financé sur le budget de l'etat, Année {extractYear(infpv.date_notification_ods)}
   <br/> 
<u>Numéro et date du visa du marché</u> N° {infpv.num_marche} du {infpv.date_notification_ods }     
<br/> <br/> 
         <div>    
   Je soussigné Monsieur <b>{infpv.signataire}</b>  {infpv.INSTITUTION_PILOTE=="HCDS"?'Haut-commissaire au développement de la steppe' :'Conservateur des forêts'} de la wilaya de <b>{infpv.wilaya_name_ascii}</b> ,
   avons récéptionné, le<b> {new Date(infpv.date).toLocaleDateString()} </b>par ce procès-veral, en présence du représentant ............. les étude de .................. 
   confiées au {infpv.cocontractant} pour l annee {extractYear(infpv.date_notification_ods)} du programme de relance du barragevert, dont le détail est décliné dans 
   le tableau ci-après: </div>
</div>
         
<div className="table-container-att m-3">
 <table  style={{ border: '1px solid #000', borderCollapse: 'collapse',fontSize: '56px' }}>
  <thead>
    <tr>
      <th>Action</th>
      <th>Etude</th>
      <th>Commune</th>
      <th>Localité</th>
      <th>Volume</th>
      <th>Unité</th>
      <th>Résultat de l'étude</th>
    </tr>
  </thead>
  <tbody>
  {DetailPv.map((obj, objIndex) => (
    <tr key={`${obj.action}`}>
      {objIndex === 0 ? (
        <td rowSpan={DetailPv.length}>
          <div>{obj.action}</div>
        </td>
      ) : null}

      <td style={{ fontSize: '18px' }}>{getTypeEtude(obj.type_etude)}</td>

      <td style={{ fontSize: '18px' }}>{obj.commune_name_ascii}</td>
      <td style={{ fontSize: '18px' }}>{obj.LOCALITES}</td>
      <td style={{ fontSize: '18px' }}>{obj.VOLUME_VALIDE}</td>
      <td style={{ fontSize: '18px' }}>{obj.UNITE}</td>
      <td style={{ fontSize: '18px' }}>{obj.faisable==1 ? "Faisable" : "Non Faisable"}</td>

    </tr>
  ))}
  </tbody>
</table>

</div> 
         </div>  
         <div className="col-12   text-center square2  mb-6 " style={{ width: '26cm', minHeight: '40.7cm', margin: 'auto'}}>
        { /* <div className="table-container-att mt-4">
 <table  style={{ border: '1px solid #000', borderCollapse: 'collapse',fontSize: '56px',marginTop:'20px' }}>
  <thead>
    <tr>
      <th>Action de la situation</th>
      <th>Numéro de phase</th>
      <th>Tâche</th>
      <th>Unité</th>
      <th>Quantité prévue wilaya</th>
      <th>réalisation antérieure</th>
      <th>réalisation de la situation</th>
      <th>réalisation cumulée</th>
    </tr>
  </thead>
  <tbody>
    {detailAsf.map((sousTableau, index) => {
      const [actionObj, ...rest] = sousTableau;
      const action = actionObj.action;
      return rest.map((obj, objIndex) => (
        <tr key={`${action}-${obj.intitule_tache}`}>
          {objIndex === 0 ? (
            <td rowSpan={rest.length}>
              <div>{action}</div>
            </td>
          ) : null}
          <td style={{ fontSize: '18px' }}>{obj.num_phase}</td>
          <td style={{ fontSize: '18px' }}>{obj.intitule_tache}</td>
          <td style={{ fontSize: '18px' }}>{obj.unite_tache}</td>
          <td style={{ fontSize: '18px' }}>{obj.total?obj.total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'-'}</td>
          <td style={{ fontSize: '18px' }}>{obj.totalrealiseantr?obj.totalrealiseantr.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }):'/'}</td>
          <td style={{ fontSize: '18px' }}>{obj.totalrealise ? obj.totalrealise.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2 }) : `/`}</td>
          <td style={{ fontSize: '18px' }}>{obj.totalrealiseantr ? (obj.totalrealise+obj.totalrealiseantr).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : `/`}</td>
        </tr>
      ));
    })}
  </tbody>
</table>

</div> */}
         </div>  

         </div>
        </AccordionTab>
    </Accordion>

         
</Dialog>)
}