import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { useReactToPrint } from "react-to-print";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { classNames } from 'primereact/utils';
import { Toolbar } from "primereact/toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {GetDetailASF,SetASF,listAttachement} from "../../utils/APIRoutes";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Calendar } from "primereact/calendar";
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from "primereact/inputnumber";
export default function DetailAsf (props)
{
  const id= useParams().idprog;
  const [detailAsf,setdetailAsf]=useState([])
  const [infAsf,setinfAsf]=useState([])
  const [infAtt,setinfAtt]=useState([])
  const componentRef = useRef();
  const [Attachement,setAttachement]=useState([])
  const [updateasf,setupdateasf]=useState({id_asf:props.idasf,date_asf:""})
  const [submittedIm, setSubmittedIm] = useState(false);
  const token = localStorage.getItem("token");
  const currentYear= getCurrentYear();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const headerRight=()=>{
    return( 
      <>
      <Button  label="Imprimer" raised style={{backgroundColor: 'var(--green-400)',borderColor:'var(--green-500)'}}  onClick={() => {  handlePrint()  }} className="mr-2" />
      </>  )
 
  }
  const getAsfDetail = () => {
    fetch(GetDetailASF, {
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
        setdetailAsf(data.tableauResultats);
        setinfAsf(data.infasf);
        setinfAtt(data.tableauAtt);
        setupdateasf(prevState => ({
          ...prevState,
          ...data.infasf
        }));
        
      });
  };
  /******************************** */
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    if (e.target.name === 'date_asf') {
      const originalDate = new Date(val);
      if (!isNaN(originalDate.getTime())) {
        const newDate = new Date(originalDate);
        newDate.setDate(newDate.getDate() + 1);
        val = newDate.toISOString().slice(0, 10);
      } else {
        console.error('Invalid date:', val);
      }
    }
    let asf = { ... updateasf };
    asf[`${name}`] = val;
    setupdateasf(asf);
   
  };
  /************************** */
  const _updateasf = () => {
 
      if(!updateasf.conf || !updateasf.signataire || !updateasf.num_asf || !updateasf.date_asf)
      {
        setSubmittedIm(true)
      }
      else
      {
        fetch(SetASF, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateasf),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
            if(data=="true")
             { getAsfDetail()}
          });
      }
  };
  /*************annee************** */
  function getCurrentYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }
  /******************* */
  useEffect(() => {
    getAsfDetail();
  }, []);   

    return(    
    <Dialog header="Attestation service fait"  headerStyle={{ backgroundColor: 'var(--green-400)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}} visible={props.detailasf} style={{ width: '70vw' }} onHide={() => props.setdetailasf(false)}>

    <Accordion multiple activeIndex={[0,1]} style={{ color: "#fff", marginTop: "1rem" }}>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="Les informations de l'attestation service fait">
        <div className="flex flex-wrap gap-3 p-fluid pr-3">
        <div className="flex-auto">
          <label htmlFor="phone" className="font-bold block mb-2">
             Numéro de l'attestation service fait
            </label>
            <InputNumber  
             value={updateasf.num_asf}
            onValueChange={(e) => onInputChange(e,'num_asf')} rows={5} cols={100}
            className={classNames({ 'p-invalid': submittedIm && !updateasf.conf})} />
             {submittedIm && !updateasf.conf && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
          <label htmlFor="phone" className="font-bold block mb-2">
             Date de l'attestation service fait
            </label>
            <Calendar  
              value={updateasf.date_asf!== null ? new Date(infAsf.date_asf) : null} showIcon
             dateFormat="dd/mm/yy"
            onChange={(e) => onInputChange(e,'date_asf')}
            className={classNames({ 'p-invalid': submittedIm && !updateasf.date_asf})} />
             {submittedIm && !updateasf.date_asf && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">

          {infAsf.INSTITUTION_PILOTE=="HCDS" ?<label htmlFor="ssn" className="font-bold block mb-2">
             Haut-commissaire au développement de la steppe 
            </label>:  <label htmlFor="ssn" className="font-bold block mb-2">
            Conservateur des forêts
            </label>}
            <InputText
            value={updateasf.signataire}
            onChange={(e) => onInputChange(e,'signataire')}
            className={classNames({ 'p-invalid': submittedIm && !updateasf.signataire})}
            />
              {submittedIm && !updateasf.signataire && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
          <label htmlFor="phone" className="font-bold block mb-2">
             conformément
            </label>
            <InputTextarea    value={updateasf.conf} 
            onChange={(e) => onInputChange(e,'conf')} rows={5} cols={100}
            className={classNames({ 'p-invalid': submittedIm && !updateasf.conf})} />
             {submittedIm && !updateasf.conf && <small className="p-error">Champ obligatoire !</small>}
          </div>
 
      
        </div>
     
        <div className="flex justify-content-end mt-3">
        <Button
            label="Enregistrer les modifications"            
            icon="pi pi-check" raised    
            style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-300)', borderRadius: 'var(--border-radius)' }}
            onClick={(e) => {
              _updateasf()
            }}
        />
        </div>
        </AccordionTab>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="Detail de l'attestation service fait">
        <Toolbar className="mb-2 mt-1" left={headerRight}></Toolbar>
         <div ref={componentRef} className="m-5" >
         <div className="col-12   text-center square  mb-6 " style={{ width: '27cm', minHeight: '30.7cm', margin: 'auto'}}>
            <center>
              <h5>
                <u>
                  REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</u>
                  <br/>
                  <u>
                   Ministère de
                  l’Agriculture et de Développement Rural</u>
                  <br/>
                  {infAsf.INSTITUTION_PILOTE=="FORETS" && (
                      <>
                      <u>
                        Conservation des Forêts de la Wilaya de{" "}
                        {infAsf.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infAsf.INSTITUTION_PILOTE=="DSA" && (
                      <>
                      <u>
                      Direction  des Services Agricoles de la Wilaya de {" "}
                        {infAsf.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infAsf.INSTITUTION_PILOTE=="HCDS" && (
                    
                      <u>
                      Haut-Commissariat au Développement de la Steppe de la Wilaya de 
 {" "}
                        {infAsf.wilaya_name_ascii}.
                      </u>
                  ) }
               <br/>
               <u>  {infAsf.num_avenant != "" &&<> AVENANT N° {infAsf.num_avenant} DU {infAsf.date_notif_ods } AU</> } MARCHE N° {infAsf.num_marche} DU {infAsf.date_notification_ods}</u>
               <br/>
               <u>N° {infAsf.num_asf}/{currentYear} </u>
              </h5>
              <br/>
          
              {/* <h1 >
                <u>Extrait d’attachement des travaux N° {attachementDetails.num_attachement}</u>
              </h1>
              <br/>
              <h3>
                <u> <u>AVENANT N°{infoavenant.num_avenant} du {infoavenant.date_notif_ods} AU</u> MARCHE N°{attachementDetails.num_marche} du {attachementDetails.date_notification_ods}</u>
              </h3> */}
            </center>
            <div className="col-12 offset-3 ml-1" style={{ fontSize: '16px',textAlign: 'left'  }}>
  <b><u>conformément:</u></b>
  {infAsf.conf && infAsf.conf.split(';').map((item, index) => (
    <div key={index}>{item.trim()}</div>
  ))}
    
<div>
   Je soussigné Monsieur <b>{infAsf.signataire}</b>  {infAsf.INSTITUTION_PILOTE=="HCDS"?'Haut-commissaire au développement de la steppe' :'Conservateur des forêts'} de la wilaya de <b>{infAsf.wilaya_name_ascii}</b> ,
   atteste que les actions citées ci-dessous et détaillées en annexe ci-jointe, 
   ont été exécutées en conformité avec les clauses du cahier des prescriptions techniques (CPT)
   du marché et réceptionnés par mes services territorialement compétents.</div>

</div>
         
 
         </div>  
         <div className="col-12   text-center square2  mb-6 " style={{ width: '26cm', minHeight: '40.7cm', margin: 'auto'}}>
          <div className="table-container-att mt-4">
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

</div> 
         </div>  
         <div className="table-container-att square" style={{ width: '26cm', minHeight: '39.7cm', padding: '1cm', margin: 'auto', pageBreakBefore: 'always' }}>
           <div className="col-12 mt-3  text-center">
            <center>
              <p>
                  <u>
                   Ministère de
                   l’Agriculture et de Développement Rural</u>
                  <br/>
                  {infAsf.INSTITUTION_PILOTE=="FORETS" && (
                      <>
                      <u>
                        Conservation des Forêts de la Wilaya de{" "}
                        {infAsf.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infAsf.INSTITUTION_PILOTE=="DSA" && (
                      <>
                      <u>
                      Direction  des Services Agricoles de la Wilaya de {" "}
                        {infAsf.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infAsf.INSTITUTION_PILOTE=="HCDS" && (
                      <>
                      <u>
                      Haut-Commissariat au Développement de la Steppe de la Wilaya de 
 {" "}
                        {infAsf.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
              </p>
              <br/>
            </center>
          
          </div>
          <div className="col-12 mt-1  text-left">

<ul>
<u>
        <li> {infAsf.num_avenant != "" &&<> Avenant N° {infAsf.num_avenant} DU {infAsf.date_notif_ods } au</> } Marche N° {infAsf.num_marche} DU {infAsf.date_notification_ods}</li>
        <li>ERGR:</li>
        
        <li>Source de financement: Budget de l'état</li></u> 
      
    </ul>

          </div>
          <center><u>Annexe à l'Attestation de Service Fait n°{infAsf.num_asf}/{currentYear}  </u></center>
<table>
  <thead>
    <tr>
      <th>Commune</th>
      <th>Localités</th>
    
      <th>Action</th>
      <th>Extrait d'attachement</th>
      <th>Date d'attachement</th>
      <th>Numéro de phase</th>
      <th>Intitulé de tâche</th>
      <th>Unité de tâche</th>
      <th>Quantité de tâche</th>
      <th>Volume réalisé</th>
      <th>Volume réalisé antérieur</th>
    </tr>
  </thead>
  <tbody>
    {infAtt.map((obj, index) => { 
  const rows = obj.map((tache, tacheIndex) => {
        return (
          <tr key={`${index}-${tacheIndex}`}>
            {tacheIndex === 0 ? (
              <>
                <td rowSpan={obj.length}>{tache.commune_name_ascii}</td>
                <td rowSpan={obj.length}>{tache.LOCALITES}</td>
                <td rowSpan={obj.length}>{tache.action}</td>
              </>
            ) : null}
            <td style={{ fontSize: '18px' }}>{tache.num_attachement?tache.num_attachement:'-'}</td>

          <td style={{ fontSize: '18px' }} >{tache.date}</td>
            <td style={{ fontSize: '18px' }}>{tache.num_phase}</td>
            <td style={{ fontSize: '18px' }}>{tache.intitule_tache}</td>
            <td style={{ fontSize: '18px' }}>{tache.unite_tache}</td>
            <td style={{ fontSize: '18px' }}>{tache.quantite_tache}</td>
            <td style={{ fontSize: '18px' }}>{tache.volume_realise?tache.volume_realise:"/"}</td>
            <td style={{ fontSize: '18px' }}>{tache.volume_realise_antr?tache.volume_realise_antr:"/"}</td>
          </tr>
        );
      });

      return <React.Fragment key={index}>{rows}</React.Fragment>;
    })}
  </tbody>
</table>





         </div> 
         </div>
        </AccordionTab>
    </Accordion>

         
</Dialog>)
}