import React, { useState, useEffect, useRef }  from "react";
import {getMarche,getDetMarche,addMarche,updateMarche,getWilaya} from '../../utils/APIRoutes';
import PrecedureConsultation from "./PrecedureConsultation";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Row, Col } from "reactstrap";
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from "primereact/dialog";
import { RadioButton } from 'primereact/radiobutton';
import { Toolbar } from "primereact/toolbar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { useNavigate,useParams} from 'react-router-dom'; 
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
export default function Marche(){
  const Navigate  = useNavigate ();
  const token = localStorage.getItem("token");
  const [submitted, setSubmitted] = useState(false);
  const [disable, setdisable] = useState(true);
  const [marcheDialog, setmarcheDialog] = useState(false);
  const [addmarcheDialog, setaddmarcheDialog] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [listmarche, setlistmarche] = useState([]);
  const [marche,setmarche]=useState({num_marche:"", contractant:"", cocontractant:"", date_signature_contractant:"", date_signature_cocontractant:"", delais_execution:"", objet:"", mantant_ht:"", tva:"", montant_ttc:"", avance_for:"", avance_appro:"", date_notification_ods:"", retenu_garantie:"", modalite_restitution_avance_forf:"", modalite_restitution_avance_appro:"", soutretence:""})  
  const [UpdateMarche,setUpdateMarche]=useState({date_notification_ods:""}) 
  const [procedure,setprocedure]=useState(false)
  const [idmarche,setidmarche]=useState('')
  const [numMarcheFilltre,setnumMarcheFilltre]=useState(0)
  const [numMarcheliste,setnumMarcheliste]=useState('')
  const idprog = useParams().idprog;
  const [wilaya,setwilaya]=useState([]);
  const type=['Etude','Réalisation']
  const toast = useRef(null);
  const accept = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Le marché a été modifié avec succès', life: 3000 });
}
const accept2 = () => {
  toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Le marché a été ajouté avec succès', life: 3000 });
}
function getAllMarches() {
    fetch(getMarche, {
       method: "POST",
       credentials: "include",
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`, // Initialize 'token' before using it
       },
       body: JSON.stringify({idprog:idprog,numMarcheFilltre:numMarcheFilltre})})

       .then((reponse) => reponse.json())
       .then((data) => {
        setlistmarche(data);
        if(numMarcheFilltre==0)
       {const numMarcheList = data.map(marche => marche.num_marche);
        setnumMarcheliste(numMarcheList);} 
       })
       .catch((error) => {
         console.log("Error:", error);
       });
   }
   function getListWilaya() {
    fetch(getWilaya, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({})})
   
      .then((response) => response.json())
      .then((data) => {
        //const wil = data.map(wilaya => wilaya.label);
        setwilaya(data);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
  } 
   useEffect(() => {
    getAllMarches();
 
  }, [numMarcheFilltre]);
  useEffect(() => {
  
    getListWilaya();
  }, []);

const gridItem = (marche) => {
    return (
        <div className="col-12 sm:col-12 lg:col-12 xl:col-6 p-2">
            <div className="p-2 border-3 surface-border surface-card border-round" >
              
                <div className="flex flex-column align-items-center justify-center gap-1 py-1">
                    <div  style={{ backgroundColor: 'var(--green-50)', borderRadius: 'var(--border-radius)'}}>
                      &nbsp; &nbsp; <b>REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</b>
                   </div>
                   <div>
                   <div className="text-2xl "  style={{ backgroundColor: 'var(--green-100)', borderRadius: 'var(--border-radius)'}}> Ministère del’Agriculture et de Développement Rural
                 </div>
                    <br/>
                    <br/>
                    <br/>
               
                    <div className="text-2xl border-2 p-2 "> 
                    Marché <span style={{ backgroundColor: 'var(--red-100)', borderRadius: 'var(--border-radius)'}}>N° {marche.num_marche}  </span> de {marche.intitule_marche} <span style={{ backgroundColor: 'var(--red-100)', borderRadius: 'var(--border-radius)'}}>{marche.debut}-{marche.fin}</span>
                    </div>
               
                    <div className="text-xl p-4"> <b>Objet : </b> {marche.objet}
                 </div>
                 
                  
                 <div className="flex sm:flex-row justify-content-end align-items-center sm:align-items-end gap-2 pt-3 sm:gap-2 m-3">
  <Button raised className="p-button-rounded" style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '3px', fontSize: "15px" }} onClick={() => { getmarche(marche.IDMarche); setmarcheDialog(true)}}>Afficher contrat</Button>
  <Button raised className="p-button-rounded" style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '3px', fontSize: "15px" }} onClick={() => { setidmarche(marche.IDMarche);setprocedure(true)}}>Procedure de consultation</Button>
  <Button raised className="p-button-rounded" style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '14px', fontSize: "15px" }} onClick={() => {Navigate(`/admin/avenant/${idprog}/${marche.IDMarche}/${marche.num_marche}`)}}>Avenant</Button>
  <Button raised className="p-button-rounded" style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '14px', fontSize: "15px" }} onClick={() => {Navigate(`/admin/entreprise/${marche.IDMarche}/${idprog}/${marche.num_marche}`)}}>{marche.type_marche=== "Réalisation"?'Entreprises':'Bet'}</Button>
  <Button raised className="p-button-rounded" style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '3px', fontSize: "15px" }} onClick={() => {Navigate(`/admin/actionmarche/${marche.IDMarche}/${marche.num_marche}/${idprog}`)}}>Action contrat</Button>
  <Button raised className="p-button-rounded" style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '3px', fontSize: "15px" }} onClick={() => {Navigate(`/admin/allimp/${marche.IDMarche}/${idprog}/${marche.num_marche}/${marche.type_marche}`)}}>Action impactee</Button>
  {(marche.type_marche) === "Réalisation" && 
    <Button raised className="p-button-rounded" style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', padding: '14px', fontSize: "15px"}} onClick={() => {Navigate(`/admin/cpt/${marche.IDMarche}/${idprog}`)}}>Cpt</Button>}
</div>

                    </div>      
                </div>
            </div>
        </div>
    );
};
  const itemTemplate = (marche, layout) => {
    if (!marche) {
        return;
    }

    if (layout === 'list') return null;
    else if (layout === 'grid') return gridItem(marche);
};
const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _marche = { ... marche };
    if (name === 'date_notification_ods') 
      {
        const originalDate = new Date(val);
        if (!isNaN(originalDate.getTime())) {
          const newDate = new Date(originalDate);
          newDate.setDate(newDate.getDate() + 1);
          _marche[`${name}`] =  newDate.toISOString().slice(0, 10);
        }
      }
        else {
          _marche[`${name}`] = val;
        }
    setmarche(_marche);
   
  };
  const onInputChangeUpdate = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _marche = { ... UpdateMarche };
    if (name === 'date_notification_ods' || name === 'date_signature_contractant' || name === 'date_signature_cocontractant') 
    {
      const originalDate = new Date(val);
      if (!isNaN(originalDate.getTime())) {
        // Add one day to the date
        const newDate = new Date(originalDate);
        newDate.setDate(newDate.getDate() + 1);
        _marche[`${name}`] =  newDate.toISOString().slice(0, 10);

      }
    }
      else {
        _marche[`${name}`] = val;
      }
 
    setUpdateMarche(_marche);
   
  };
  function addmarche() {
    if(marche.num_marche || marche.contractant || marche.cocontractant|| marche.objet|| marche.mantant_ht|| marche.tva || marche.delais_execution || marche.retenu_garantie|| marche.modalite_restitution_avance_forf|| marche.modalite_restitution_avance_appro || marche.soutretence || marche.type_marche || marche.echelle)
    { 
      if(marche.retenu_garantie < 100 && marche.modalite_restitution_avance_forf < 100 && marche.modalite_restitution_avance_appro <100 && marche.soutretence && marche.avance_appro <100 && marche.avance_appro<100 )
      {fetch(addMarche, {
      method: "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({marche:marche,idprog:idprog}),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "true") 
          {
          getAllMarches();
          hideAddDialog();
          accept2();
          } 
      })
      .catch((error) => {
        console.error(error);
      });
    }
    }
    else{
      setSubmitted(true)
      }
    }
  function Updatemarche() {

    if(!UpdateMarche.num_marche || !UpdateMarche.contractant || !UpdateMarche.cocontractant|| !UpdateMarche.objet|| !UpdateMarche.mantant_ht || !UpdateMarche.delais_execution || !UpdateMarche.modalite_restitution_avance_forf|| !UpdateMarche.modalite_restitution_avance_appro || !UpdateMarche.soutretence || !UpdateMarche.type_marche)
    {
 
      setSubmitted(true)
    }
    else{
      if(UpdateMarche.retenu_garantie <100 && UpdateMarche.modalite_restitution_avance_forf <100 && UpdateMarche.modalite_restitution_avance_appro <100 && UpdateMarche.soutretence && UpdateMarche.avance_appro <100 && UpdateMarche.avance_appro<100 )
      {
      fetch(updateMarche, {
        method: "POST",
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(UpdateMarche),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === "true") {
            getAllMarches();
            accept();
            hideDialog();
          } 
        })
        .catch((error) => {
          console.error(error);
        });
      }
      }
      
    }
    function getmarche(id_marche) {
  
      fetch(getDetMarche, {
        method: "POST",
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({id_marche:id_marche}),
      })
        .then((response) => response.json())
        .then((data) => {
          setUpdateMarche(data[0])
        })
        .catch((error) => {
          console.error(error);
        });
      
    }
  
    const actionPDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" style={{ color: '#fff',backgroundColor: 'var(--red-400)', borderRadius: 'var(--border-radius)',marginRight:'8px'}} icon="pi pi-times" outlined onClick={()=>hideDialog()} />
            <Button disabled={disable} style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  label="Enregister les modification" icon="pi pi-check" onClick={()=>Updatemarche()} />
        </React.Fragment>
      );
      const addMarcheDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" style={{ color: '#fff',backgroundColor: 'var(--red-400)',borderColor:'var(--red-400)' , borderRadius: 'var(--border-radius)',marginRight:'5px'}} outlined onClick={()=>hideAddDialog()} />
            <Button label="Ajouter" style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  icon="pi pi-check" onClick={addmarche} />
        </React.Fragment>
      );

      const hideDialog = () => {
         setdisable(true)
        setSubmitted(false);
        setmarcheDialog(false);
        setUpdateMarche({})
      };
      const hideAddDialog = () => {
        setmarche({num_marche:"", contractant:"", cocontractant:"", date_signature_contractant:"", date_signature_cocontractant:"", delais_execution:"", objet:"", mantant_ht:"", tva:"", montant_ttc:"", avance_for:"", avance_appro:"", date_notification_ods:"", retenu_garantie:"", modalite_restitution_avance_forf:"", modalite_restitution_avance_appro:"", soutretence:""});
        setSubmitted(false);
        setaddmarcheDialog(false);
      };
      const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2 ">
                <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/ComposantProgramme/${idprog}`)}} style={{  marginRight: '10px' , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised />
                <Button raised label="Nouvelle contrat" style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  icon="pi pi-plus" onClick={()=>setaddmarcheDialog(true)}/>
               <Dropdown placeholder="Fillrer les contrat par numéro" options={numMarcheliste} value={numMarcheFilltre} id="type" onChange={(e) =>{setnumMarcheFilltre(e.target.value)}}  />
             
               
            </div>
        );
      };
      const leftToolbarTemplateUpdate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button style={{ padding:'8px',backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  label="MODIFIER" icon="pi pi-pencil" onClick={()=>setdisable(false)}/>
            </div>
        );
      };
return( 
     <div className ="content mt-3"  >
      {procedure && <PrecedureConsultation idmarche={idmarche} procedure={procedure} setprocedure={setprocedure}/>}
<p style={{  fontSize: '20px'}} > Contrats</p>
  <Toast ref={toast} />
<Toolbar className="mb-2 p-2" left={leftToolbarTemplate}></Toolbar>
      <Row>
 
        <Col md="12">
          <DataView value={listmarche} itemTemplate={itemTemplate} layout={layout} />
        </Col>
      </Row>

      <Dialog headerStyle={{ backgroundColor: 'var(--green-300)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}}
      visible={marcheDialog} style={{ width: '80rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={UpdateMarche.num_marche ?`Détail du contrat N° ${UpdateMarche.num_marche}`:"Détail du marché N°"} modal className="p-fluid" footer={actionPDialogFooter } onHide={hideDialog} >       
      <Toolbar className="m-1 p-1 pl-3" left={leftToolbarTemplateUpdate}></Toolbar>
              <Row>
                <Col className="mr-3">
                <div className="flex flex-wrap gap-3">
<div className="flex align-items-center">
        <RadioButton disabled={disable} inputId="ingredient1" name="pizza"value="National" checked={UpdateMarche.echelle === 'National'} onChange={(e) => onInputChange(e, 'echelle')} className={classNames({ 'p-invalid': submitted && !UpdateMarche.echelle })} />
        <label htmlFor="ingredient1" className="ml-2"  >Centralisé</label>
    </div>
    <div className="flex align-items-center">
        <RadioButton disabled={disable} inputId="ingredient2" name="pizza" value="Régional" checked={UpdateMarche.echelle === 'Régional'} onChange={(e) => onInputChange(e, 'echelle')} className={classNames({ 'p-invalid': submitted && !UpdateMarche.echelle })}/>
        <label htmlFor="ingredient2" className="ml-2" >Décentralisé</label>
    </div>
    {submitted && !UpdateMarche.echelle && <small className="p-error">Champ obligatoire !</small>}
</div>
                <div >
                    <label htmlFor="num_marche" className="font-bold">
                     Numero du contrat
                    </label>
                    <InputNumber disabled={disable} value={UpdateMarche.num_marche} id="num_marche" onValueChange={(e) => onInputChangeUpdate(e, 'num_marche')} required autoFocus className={classNames({ 'p-invalid': submitted && !UpdateMarche.num_marche })} />
                    {submitted && !UpdateMarche.num_marche && <small className="p-error">Champ obligatoire !</small>}
                </div>
                <div >
                    <label htmlFor="objet" className="font-bold">
                    Intitulé du contrat
                   </label>
                    <InputTextarea disabled={disable} value={UpdateMarche.intitule_marche} id="intitule_marche" onChange={(e) => onInputChangeUpdate(e, 'intitule_marche')} required className={classNames({ 'p-invalid': submitted && !UpdateMarche.intitule_marche })} />
                    {submitted && !UpdateMarche.intitule_marche && <small className="p-error">Champ obligatoire !</small>}
                </div>  
                <div >
                    <label htmlFor="type" className="font-bold">
                     Type du contrat
                    </label>
                    <Dropdown disabled={disable} options={type} value={UpdateMarche.type_marche} id="type" onChange={(e) => onInputChangeUpdate(e, 'type_marche')} required className={classNames({ 'p-invalid': submitted && !UpdateMarche.type_marche })} />
                    {submitted && !UpdateMarche.type_marche && <small className="p-error">Champ obligatoire !</small>}
                </div>       
                <div >
                    <label htmlFor="contractant" className="font-bold">
                    Contractant
                    </label>
                    <InputText disabled={disable}  value={UpdateMarche.contractant} id="contractant" onChange={(e) => onInputChangeUpdate(e, 'contractant')} required className={classNames({ 'p-invalid': submitted && !UpdateMarche.contractant })} />
                    {submitted && !UpdateMarche.contractant && <small className="p-error">Champ obligatoire !</small>}
                </div>  
            
                <div >
                    <label htmlFor="cocontractant" className="font-bold">
                   Cocontractant
                    </label>
                    <InputText disabled={disable} id="cocontractant"  value={UpdateMarche.cocontractant} onChange={(e) => onInputChangeUpdate(e, 'cocontractant')} required className={classNames({ 'p-invalid': submitted && !UpdateMarche.contractant })} />
                    {submitted && !UpdateMarche.cocontractant && <small className="p-error">Champ obligatoire !</small>}
                </div>  
                <div >
                    <label htmlFor="objet" className="font-bold">
                    Objet
                   </label>
                    <InputTextarea disabled={disable} value={UpdateMarche.objet} id="objet" onChange={(e) => onInputChangeUpdate(e, 'objet')} required className={classNames({ 'p-invalid': submitted && !UpdateMarche.objet })} />
                    {submitted && !UpdateMarche.objet && <small className="p-error">Champ obligatoire !</small>}
                </div>  
                <div >
                    <label htmlFor="mantant_ht" className="font-bold">
                   Montant HT (DA)
                    </label>
                    <InputNumber disabled={disable} minFractionDigits={2} id="mantant_ht" value={UpdateMarche.mantant_ht} onValueChange={(e) => onInputChangeUpdate(e, 'mantant_ht')} required className={classNames({ 'p-invalid': submitted && !UpdateMarche.mantant_ht })} />
                    {submitted && !UpdateMarche.mantant_ht && <small className="p-error">Champ obligatoire !</small>}
                </div>  
           
       
                <div >
                    <label htmlFor="montant_ttc" className="font-bold">
                       Montant TTC (DA)
                    </label>
                    <InputNumber disabled value={UpdateMarche.montant_ttc} id="montant_ttc"  />
                </div>  
                </Col>
                <Col className="ml-3">
                <div >
                    <label htmlFor="date_notification_ods" className="font-bold">
                     Date notification ODS
                    </label>
                    <Calendar onChange={(e)=>onInputChangeUpdate(e, 'date_notification_ods')} 
      dateFormat="dd/mm/yy" value={new Date(UpdateMarche.date_notification_ods) } disabled={disable} id="date_notification_ods" showIcon />

                   
                </div>  
          
                <div >
                    <label htmlFor="delais_execution" className="font-bold">
                      Délais d'execution (mois)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateMarche.delais_execution} suffix= " mois" id="delais_execution" onValueChange={(e) => onInputChangeUpdate(e, 'delais_execution')} required className={classNames({ 'p-invalid': submitted && !UpdateMarche.delais_execution })} />
                    {submitted && !UpdateMarche.delais_execution && <small className="p-error">Champ obligatoire !</small>}
                </div>  
                <div >
                    <label htmlFor="avance_for" className="font-bold">
                      Avance forfaitaire  (%)
                    </label>
                    <InputNumber disabled={disable} value={UpdateMarche.avance_for} suffix=" %" id="avance_for" onValueChange={(e) => onInputChangeUpdate(e, 'avance_for')}   />
                    {  UpdateMarche.avance_for >100 && <small className="p-error">L'avance forfaitaire ne doit pas dépasser 100 % !</small>}
                </div> 
                <div >
                    <label htmlFor="avance_appro" className="font-bold">
                      Avance d'approvisionement (%)
                    </label>
                    <InputNumber disabled={disable} value={UpdateMarche.avance_appro} suffix=" %" id="avance_appro" onValueChange={(e) => onInputChangeUpdate(e, 'avance_appro')}   />
                    {  UpdateMarche.avance_appro > 100 && <small className="p-error">L'avance d'approvisionement ne doit pas dépasser 100 % !</small>}
                </div> 
                <div >
                    <label htmlFor="modalite_restitution_avance_forf" className="font-bold">
                     Taux de restitution de l'avance forfaitaire (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateMarche.modalite_restitution_avance_forf} suffix=" %" id="modalite_restitution_avance_forf" onValueChange={(e) => onInputChangeUpdate(e, 'modalite_restitution_avance_forf')}   />
                    {submitted && !UpdateMarche.modalite_restitution_avance_forf && <small className="p-error">Champ obligatoire !</small>}
                    {  UpdateMarche.modalite_restitution_avance_forf >100 && <small className="p-error">Taux de restitution de l'avance forfaitaire ne doit pas dépasser 100 % !</small>}
                </div> 
            
                <div >
                    <label htmlFor="modalite_restitution_avance_appro" className="font-bold">
                     Taux de restitution de l'avance d'approvisionement (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateMarche.modalite_restitution_avance_appro}  suffix=" %" id="modalite_restitution_avance_appro" onValueChange={(e) => onInputChangeUpdate(e, 'modalite_restitution_avance_appro')}   />
                    {submitted && !UpdateMarche.modalite_restitution_avance_appro && <small className="p-error">Champ obligatoire !</small>}
                    { UpdateMarche.modalite_restitution_avance_appro >100 && <small className="p-error">La modalites de restitution de l'avance d'approvisionement ne doit pas dépasser 100 % !</small>}
                </div> 
                <div >
                    <label htmlFor="retenu_garantie" className="font-bold">
                  Retenu de garantie (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateMarche.retenu_garantie}  suffix=" %" id="retenu_garantie" onValueChange={(e) => onInputChangeUpdate(e, 'retenu_garantie')}   />
                 
                    {  UpdateMarche.retenu_garantie >100 && <small className="p-error">Le retenu de garantie ne doit pas dépasser 100 % !</small>}
                </div> 
                <div >
                    <label htmlFor="Cotation" className="font-bold">
                    Cotation de bonne exécution (DA)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateMarche.Cotation}  suffix=" %" id="Cotation" onValueChange={(e) => onInputChangeUpdate(e, 'Cotation')}   />

                </div> 
                <div >
                     <label htmlFor="soutretence" className="font-bold">
                         Sous-traitance (%)
                    </label>
                    <InputNumber disabled={disable} value={UpdateMarche.soutretence} suffix=" %" id="soutretence" onValueChange={(e) => onInputChangeUpdate(e, 'soutretence')}   />
                    {UpdateMarche.soutretence >100 && <small className="p-error">La Sous-traitance ne doit pas dépasser 100 % !</small>}
                    {submitted && !UpdateMarche.soutretence && <small className="p-error">Champ obligatoire !</small>}
                </div> 
            
                </Col>
              
              </Row>
   
      </Dialog>
      <Dialog headerStyle={{ backgroundColor: 'var(--green-300)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}}
      visible={addmarcheDialog} style={{ width: '70rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Ajouter une nouvelle contrat pour la tranche ${useParams().idprog}`}  modal className="p-fluid" footer={addMarcheDialogFooter} onHide={hideAddDialog} >       
              <Row>
                <Col className="mr-3">
                <div className="flex flex-wrap gap-3">
<div className="flex align-items-center">
        <RadioButton inputId="National" name="pizza"value="National" checked={marche.echelle === 'National'} onChange={(e) => onInputChange(e, 'echelle')} className={classNames({ 'p-invalid': submitted && !marche.echelle })} />
        <label htmlFor="National" className="ml-2"  >Centralisé</label>
    </div>
    <div className="flex align-items-center">
        <RadioButton inputId="Régional" name="pizza" value="Régional" checked={marche.echelle === 'Régional'} onChange={(e) => onInputChange(e, 'echelle')} className={classNames({ 'p-invalid': submitted && !marche.echelle })}/>
        <label htmlFor="Régional" className="ml-2" >Décentralisé</label>
       
    </div>
    {submitted && !marche.echelle && <small className="p-error">Champ obligatoire !</small>}
</div>

       {/* {   marche.echelle=="Régional"&&    <div >
                    <label htmlFor="code_wilaya" className="font-bold">
                     Wilaya
                    </label>
                    <Dropdown  options={wilaya} value={marche.code_wilaya} id="code_wilaya" onChange={(e) => onInputChange(e, 'code_wilaya')} required className={classNames({ 'p-invalid': submitted && !marche.code_wilaya })} />
                    {submitted && !marche.code_wilaya && <small className="p-error">Champ obligatoire !</small>}
                </div> } */}

                <div >
                    <label htmlFor="num_marche" className="font-bold">
                     Numero du contrat
                    </label>
                    <InputNumber id="num_marche" onValueChange={(e) => onInputChange(e, 'num_marche')} required autoFocus className={classNames({ 'p-invalid': submitted && !marche.num_marche })} />
                    {submitted && !marche.num_marche && <small className="p-error">Champ obligatoire !</small>}
                </div> 


                <div >
                    <label htmlFor="objet" className="font-bold">
                    Intitulé du contrat
                   </label>
                    <InputTextarea  value={marche.intitule_marche} id="intitule_marche" onChange={(e) => onInputChange(e, 'intitule_marche')} required className={classNames({ 'p-invalid': submitted && !marche.intitule_marche })} />
                    {submitted && !marche.intitule_marche && <small className="p-error">Champ obligatoire !</small>}
                </div>  
                <div >
                    <label htmlFor="type" className="font-bold">
                     Type du contrat
                    </label>
                    <Dropdown  options={type} value={marche.type_marche} id="type" onChange={(e) => onInputChange(e, 'type_marche')} required className={classNames({ 'p-invalid': submitted && !marche.type_marche })} />
                    {submitted && !marche.type_marche && <small className="p-error">Champ obligatoire !</small>}
                </div>  
                <div >
                    <label htmlFor="contractant" className="font-bold">
                    Contractant
                    </label>
                    <InputText id="contractant" onChange={(e) => onInputChange(e, 'contractant')} required className={classNames({ 'p-invalid': submitted && !marche.contractant })} />
                    {submitted && !marche.contractant && <small className="p-error">Champ obligatoire !</small>}
                </div>  
            
                <div >
                    <label htmlFor="cocontractant" className="font-bold">
                   Cocontractant
                    </label>
                    <InputText id="cocontractant" onChange={(e) => onInputChange(e, 'cocontractant')} required className={classNames({ 'p-invalid': submitted && !marche.cocontractant })} />
                    {submitted && !marche.cocontractant && <small className="p-error">Champ obligatoire !</small>}
                </div>  
                <div>
           <label htmlFor="rais_soc_add_cocotract" className="font-bold">
                    Raison sosiale et adresse cocontractant
           </label>
          <InputText 
           id="rais_soc_add_cocotract" onChange={(e) => onInputChange(e, 'rais_soc_add_cocotract')} required className={classNames({ 'p-invalid': submitted && !marche.rais_soc_add_cocotract })} />
           {submitted && !marche.rais_soc_add_cocotract && <small className="p-error">Champ obligatoire !</small>}
           </div>
           <div>
           <label htmlFor="regitre_commerce_cocotra" className="font-bold">
                  Registre de commerce cocontractant
           </label>
          <InputText id="regitre_commerce_cocotra"  onChange={(e) => onInputChange(e, 'regitre_commerce_cocotra')} required className={classNames({ 'p-invalid': submitted && !marche.regitre_commerce_cocotra })}/>
           {submitted && !marche.regitre_commerce_cocotra && <small className="p-error">Champ obligatoire !</small>}
           </div>
           <div>
           <label htmlFor="matricul_fiscal_cocontr" className="font-bold">
                  Matricule fiscale cocontractant
           </label>
          <InputText id="matricul_fiscal_cocontr" 
                        onChange={(e) => onInputChange(e, 'matricul_fiscal_cocontr')} required className={classNames({ 'p-invalid': submitted && !marche.matricul_fiscal_cocontr })}/>
           {submitted && !marche.matricul_fiscal_cocontr && <small className="p-error">Champ obligatoire !</small>}
           </div>
           <div>
           <label htmlFor="compte_bancaire_cocontr" className="font-bold">
                  Compte bancaire cocontractant
           </label>
          <InputText id="add" 
                        onChange={(e) => onInputChange(e, 'compte_bancaire_cocontr')} required className={classNames({ 'p-invalid': submitted && !marche.compte_bancaire_cocontr })}/>
           {submitted && !marche.compte_bancaire_cocontr && <small className="p-error">Champ obligatoire !</small>}
           </div>

           <div>
           <label htmlFor="visa_commission" className="font-bold">
                  Visa de la commission sectorielle
           </label>
          <InputText id="visa_commission" 
                        onChange={(e) => onInputChange(e, 'visa_commission')} required className={classNames({ 'p-invalid': submitted && !marche.visa_commission })}/>
           {submitted && !marche.visa_commission && <small className="p-error">Champ obligatoire !</small>}
           </div>
           <div>
           <label htmlFor="add" className="font-bold">
                 Mode de passation
           </label>
          <InputText id="add" 
                        onChange={(e) => onInputChange(e, 'mode_passation')} required className={classNames({ 'p-invalid': submitted && !marche.mode_passation })}/>
           {submitted && !marche.mode_passation && <small className="p-error">Champ obligatoire !</small>}
           </div>    
        </Col>
        <Col className="ml-3">
         <div >
            <label htmlFor="objet" className="font-bold">
              Objet
            </label>
           <InputTextarea id="objet" onChange={(e) => onInputChange(e, 'objet')} required className={classNames({ 'p-invalid': submitted && !marche.contractant })} />
            {submitted && !marche.objet && <small className="p-error">Champ obligatoire !</small>}
          </div>  
           <div >
             <label htmlFor="mantant_ht" className="font-bold">
               Montant HT (DA)
              </label>
                    <InputNumber suffix=" DA" minFractionDigits={2} value={marche.mantant_ht} id="mantant_ht" onValueChange={(e) => onInputChange(e, 'mantant_ht')} required className={classNames({ 'p-invalid': submitted && !marche.contractant })} />
                    {submitted && !marche.mantant_ht && <small className="p-error">Champ obligatoire !</small>}
                </div> 

                <div >
                    <label htmlFor="date_notification_ods" className="font-bold">
                     Date notification ODS
                    </label>
                    <Calendar id="date_notification_ods"  showIcon type='date' dateFormat="dd/mm/yy"  onChange={(e) => onInputChange(e, 'date_notification_ods')} required />
                </div>  
          
                <div >
                    <label htmlFor="delais_execution" className="font-bold">
                      Délais d'execution (mois)
                    </label>
                    <InputNumber suffix=" mois" id="delais_execution" onValueChange={(e) => onInputChange(e, 'delais_execution')} required className={classNames({ 'p-invalid': submitted && !marche.delais_execution })} />
                    {submitted && !marche.delais_execution && <small className="p-error">Champ obligatoire !</small>}
                </div>  

                <div >
                    <label htmlFor="avance_for" className="font-bold">
                      Avance forfaitaire (%)
                    </label>
                    <InputNumber  suffix=" %" id="avance_for" onValueChange={(e) => onInputChange(e, 'avance_for')} />
                    {  marche.avance_for >100 && <small className="p-error">L'avance forfaitaire ne doit pas dépasser 100 % !</small>}
                </div> 

                <div >
                    <label htmlFor="avance_appro" className="font-bold">
                      Avance d'approvisionement (%) 
                    </label>
                    <InputNumber suffix=" %" id="avance_appro" onValueChange={(e) => onInputChange(e, 'avance_appro')}    />
                    {  marche.avance_appro >100 && <small className="p-error">L'avance d'approvisionement ne doit pas dépasser 100 % !</small>}
                </div> 

                <div >
                    <label htmlFor="modalite_restitution_avance_forf" className="font-bold">
                    Modalites de restitution de l'avance forfaitaire (%)
                    </label>
                    <InputNumber suffix=" %" id="modalite_restitution_avance_forf" onValueChange={(e) => onInputChange(e, 'modalite_restitution_avance_forf')}  required className={classNames({ 'p-invalid': submitted && !marche.modalite_restitution_avance_forf })}  />
                    {submitted && !marche.modalite_restitution_avance_forf && <small className="p-error">Champ obligatoire !</small>}
                    {  marche.modalite_restitution_avance_forf >100 && <small className="p-error">La modalites de restitution de l'avance forfaitaire ne doit pas dépasser 100 % !</small>}
                </div> 
            
                <div >
                    <label htmlFor="modalite_restitution_avance_appro" className="font-bold">
                     Modalites de restitution de l'avance d'approvisionement (%)
                    </label>
                    <InputNumber  suffix=" %" id="modalite_restitution_avance_appro" onValueChange={(e) => onInputChange(e, 'modalite_restitution_avance_appro')} required className={classNames({ 'p-invalid': submitted && !marche.modalite_restitution_avance_appro })}   />
                    {submitted && !marche.modalite_restitution_avance_appro && <small className="p-error">Champ obligatoire !</small>}
                    { marche.modalite_restitution_avance_appro >100 && <small className="p-error">La modalites de restitution de l'avance d'approvisionement ne doit pas dépasser 100 % !</small>}
                </div> 
                <div >
                    <label htmlFor="retenu_garantie" className="font-bold">
                      Retenu de garantie (%)
                    </label>
                    <InputNumber  suffix=" %" id="retenu_garantie" onValueChange={(e) => onInputChange(e, 'retenu_garantie')}  required className={classNames({ 'p-invalid': submitted && !marche.delais_execution })}  />
                
                    {  marche.retenu_garantie >100 && <small className="p-error">Le retenu de garantie ne doit pas dépasser 100 % !</small>}
                </div> 
                <div >
                    <label htmlFor="Cotation" className="font-bold">
                    Cotation de bonne exécution (DA)
                    </label>
                    <InputNumber minFractionDigits={2} value={UpdateMarche.Cotation}  suffix=" DA" id="Cotation" onValueChange={(e) => onInputChange(e, 'Cotation')}   />

                </div> 

                <div >
                    <label htmlFor="soutretence" className="font-bold">
                  Sous-traitance (%)
                    </label>
                    <InputNumber suffix=" %" id="soutretence" onValueChange={(e) => onInputChange(e, 'soutretence')} required className={classNames({ 'p-invalid': submitted && !marche.delais_execution })} />
                    {submitted && !marche.soutretence && <small className="p-error">Champ obligatoire !</small>}
                    {marche.soutretence >100 && <small className="p-error">La Sous-traitance ne doit pas dépasser 100 % !</small>}
                </div> 
            
                </Col>
                
              </Row>
         
      </Dialog>
    </div>)
}