import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { useReactToPrint } from "react-to-print";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { classNames } from 'primereact/utils';
import { Toolbar } from "primereact/toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  ValideAttachement,
  updateAttachement,
  getAttachementDetails,
  getRealisationList,ReadAttFile,uploadAttFile
} from "../../utils/APIRoutes";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from 'primereact/toast';
import { InputNumber } from "primereact/inputnumber";
function AttachementDetails(props) {
  const [submitted, setSubmitted] = useState(false);
  var id_attachement = props.id_attachement;
  const componentRef = useRef();
  const componentRefAr = useRef();
  const [attachementDetails, setattachementDetails] = useState({});
  const [infoavenant,setinfoavenant]=useState([])
  const [form, setform] = useState({date_signature_instutition:"",date_signature_bet:"",date_signature_entr:"",date_etabli_attachement:"",valider_attchement:"",chef_circonscription_forets:"",chef_district_forets:"",chef_zone:"",commisaire_reginal:""});
  const [realisationList, setrealisationList] = useState([]);  
  const [updatedRealisation, setupdatedRealisation] = useState([]);
  const [langue, setlangue] = useState("fr")
  const token = localStorage.getItem("token");
  const [visibleValidationDialog, setVisibleValidationDialog] = useState(false);
  const toast = useRef(null);
  const [loading,setloading]=useState(false)
  const [uniqueLocalites, setUniqueLocalites] = useState([]);
  const [uniqueCommunes, setUniqueCommunes] = useState([]);
  const formData = new FormData();
  /*************************************************** */
  const accept = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Modification effectuée avec succès.', life: 3000 });
  }
const valider = () => {
  toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Validation effectuée avec succès.', life: 3000 });
}
const invalider = () => {
  toast.current.show({ severity: 'warn', summary: 'Confirmé', detail: 'Invalidation effectuée avec succès.', life: 3000 });
}

const reject = () => {
   toast.current.show({ severity: 'danger', summary: 'Rejecté', detail: 'Vous avez refusé', life: 3000 });
}
  const setFormData = (e) => {
    let value = e.target?.value;
      
    if (e.target.name === 'date_signature_entr' || e.target.name === 'date_signature_bet' || e.target.name === 'date_signature_instutition' || e.target.name ==='date_etabli_attachement' ) {
      const originalDate = new Date(value);
  
      if (!isNaN(originalDate.getTime())) {
        // Add one day to the date
        const newDate = new Date(originalDate);
        newDate.setDate(newDate.getDate() + 1);
  
        // Format the date to the desired string format (e.g., ISO 8601)
        value = newDate.toISOString().slice(0, 10); // Adjust the slice based on your desired format
      } else {
        console.error('Invalid date:', value);
      }
    }
  
    setform((prevState) => ({
      ...prevState,
      [e.target.name]: value || '',
    }));
    //form[event.target.name] = event.target.value;
  
  };
  const _updateAttachement = () => {
    if(attachementDetails.INSTITUTION_PILOTE=="FORETS" || attachementDetails.INSTITUTION_PILOTE=="DSA")
    {
      if(!form.chef_circonscription_forets || !form.chef_district_forets || !form.chef_triage_forets || !form.dir_projet_ergr || !form.date_signature_entr || !form.date_signature_instutition || !form.date_etabli_attachement)
        {
          setSubmitted(true)
        }
       else{
        fetch(updateAttachement, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            all: "all",
            form: form,
            id_attachement: id_attachement,
          }),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
            if(data='true')
            {
              accept();
              _attachementDetails()
            }
          });
        }
    }
    else
    {
      if(!form.commisaire_reginal || !form.chef_zone || !form.dir_projet_ergr || !form.date_signature_entr || !form.date_signature_instutition || !form.date_etabli_attachement)
        {
          setSubmitted(true)
        }
       else{
        fetch(updateAttachement, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            all: "all",
            form: form,
            id_attachement: id_attachement,
          }),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
            if(data='true')
            {
              accept();
              _attachementDetails()
            }
          });
        }
    }
 
  
  };
  /************************************************/


// Helper function to check if all required fields are filled
const validateFields = (fields) => {
  return fields.every(field => attachementDetails[field]);
};

const showConfirmationDialog = () => {
  if (!visibleValidationDialog) {
    setVisibleValidationDialog(true);  // Show the dialog
    setSubmitted(true);
  }
};

const validerAttachement = (e, n) => {
  const isForetsOrDSA = attachementDetails.INSTITUTION_PILOTE === "FORETS" || attachementDetails.INSTITUTION_PILOTE === "DSA";
  const requiredFields = isForetsOrDSA
    ? ["chef_circonscription_forets", "chef_district_forets", "chef_triage_forets", "dir_projet_ergr", "date_signature_entr", "date_signature_instutition"]
    : ["chef_zone", "commisaire_reginal", "dir_projet_ergr", "date_signature_entr", "date_signature_instutition"];

  // Use validateFields to check if all required fields are filled
  if (validateFields(requiredFields)) {
    acceptDelete(e, n);
  } else {
    showConfirmationDialog();
  }
};



  
  

  /************************************** */
  const acceptDelete = (id,n) => {
  
       fetch(ValideAttachement, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ all: "all", id_attachement: id,val:n }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        if (data == "validation") {
        valider();
        _attachementDetails();
        props.getListAttachement();
        setSubmitted(false);
        }
        else
        {
          invalider();
          _attachementDetails();
          props.getListAttachement();
        }
      });
  };
  const _attachementDetails = () => {
    fetch(getAttachementDetails, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        all: "all",
        id_attachement: props.id_attachement,
      }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
      
        setattachementDetails(data.detail);
        setinfoavenant(data.avenant)
        setform(data.detail);
        setrealisationList(data.realisation);
        const updatedRealisationList = data.realisation.map((item) => ({
          ...item,
          ...data.detail  // Using data.detail instead of attachementDetails directly
        }));
        setupdatedRealisation(updatedRealisationList)
        const localitesSet = new Set(data.realisation.map(item => item.LOCALITES));
        const uniqueLocalitesArray = Array.from(localitesSet);
    
        // Collecter les commune_name_ascii distincts
        const communesSet = new Set(data.realisation.map(item => item.commune_name_ascii));
        const uniqueCommunesArray = Array.from(communesSet);
        setUniqueLocalites(uniqueLocalitesArray);
        setUniqueCommunes(uniqueCommunesArray);
      });
  };

  useEffect(() => {
    _attachementDetails();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrintAr = useReactToPrint({
    content: () => componentRefAr.current,
  });
  const footer=()=>{
    return(   <Button 
      style={{
        backgroundColor: 'var(--green-300)',
        borderColor: 'var(--green-300)',
        transition: 'background-color 0.3s', // Optional: add transition for smooth effect
        ':hover': {
          backgroundColor: 'var(--green-500)', // Change to the desired hover color
        }
      }}
      label="Enregistrer les modification"
      raised
      onClick={_updateAttachement}
    />)
 
  }


  /**************************** */
  const handleFileChange = (event) => {
    formData.append('file', event.target.files[0]);

      sendFile(id_attachement);
   
  };
  const sendFile = (id) => {
    var path=`${uploadAttFile}/${id}`;
    try {
      setloading(true)
      fetch(path, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, // Initialize 'token' before using it
          },
        body: formData,
          }).then((response) => response.json())
           .then((data) => {
          if(data=="update")
          { setloading(false)
            _attachementDetails();
            toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Le fichier PDF a été uploadé avec succès', life: 5000 });
       
          }
           formData.forEach((value, key) => {
           formData.delete(key);
           });
       
         })
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
/*************************************** */
const handleFileOpen = (fileName) => {
const token = localStorage.getItem("token");
if(!fileName)
  {
    toast.current.show({ severity: 'warn', summary: 'Rejeté', detail: "La pièce jointe n'a pas encore été uploadée", life: 3000 });
  }
  else{
fetch(ReadAttFile, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Initialize 'token' before using it
  },
  body: JSON.stringify({ fileName: fileName }), // Pass the filename in the body
})
.then((response) => {
  if (!response.ok) {
    throw new Error('Error fetching file');
  }
  return response.blob(); // Get the response as a Blob
})
.then((blob) => {
  const fileURL = URL.createObjectURL(blob); // Create a temporary URL for the file
  window.open(fileURL, '_blank'); // Open the PDF in a new tab
})
.catch((error) => {
  console.error('Error opening file:', error); // Log the error
});}
};
  /************************* */
  const AttachementFooter = (
    <React.Fragment>
        <Button 
            label="Retour" 
            icon="pi pi-replay" 
            style={{ color: '#fff', borderColor: 'var(--red-400)',backgroundColor:'var(--red-400)', marginRight: '10px' }} 
            outlined 
            onClick={() =>{    if (props.detail === "list") {
              props.setDetailAttachment(false);
              props.setIdattachement(0);
            } else {
              props.setid_attachement(0);
      
            }}} 
        />
    </React.Fragment>
);
  /****************************** */
  const headerRight=()=>{
    return( 
      <>
    {form.valider_attchement === 1 ?  
  <Button  className="mr-2" label="valider"  style={{backgroundColor: 'var(--primary-400)',marginTop:'2px', borderColor: 'var(--primary-400)'}}
    />
  : 
  <Button  className="mr-2" label="Valider"  style={{backgroundColor: 'var(--green-600)',marginTop:'2px', borderColor: 'var(--green-600)'}}
    onClick={() => validerAttachement(id_attachement,1)} />
}
      {/* <Button  label="Uploder" raised style={{backgroundColor: 'var(--orange-600)',borderColor:'var(--orange-600)'}}  onClick={() => {  }} className="mr-2" /> */}
      <label className="addfile" htmlFor="file-input"  style={{color:'#fff',fontSize:'16px',marginLeft:'5px',marginRight:'5px',padding:'9px',marginTop:'10px',backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)'}} >
      Uploder
      </label>
                <input
                    className="inputfile"
                    id="file-input"
                    type="file"
                    name="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
      <Button  label="Afficher" disabled={!form.file} style={{backgroundColor: 'var(--orange-600)',marginTop:'2px',borderColor:'var(--orange-600)'}}  onClick={() => {  handleFileOpen(form.file) }}  />
      </>  )
 
  }

  return (
 
    <Dialog   headerStyle={{ backgroundColor: 'var(--green-400)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}}
    header={<div style={{ fontSize: '1.1rem' }}>{Object.values(attachementDetails).length > 0 ? `Détail de l'attachement N ° ${attachementDetails.num_attachement} pour l'action ${attachementDetails.action} wilaya ${attachementDetails.wilaya_name_ascii}`:null}</div>} 
    footer={AttachementFooter}
    visible={true}  style={{ width: '75rem', height: '100%' }}   onHide={() => {
      if (props.detail === "list") {
        props.setDetailAttachment(false);
        props.setIdattachement(0);
      } else {
        props.setid_attachement(0);

      }
    }}>
        {loading &&
    
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)", display: "flex",justifyContent: "center",  alignItems: "center",pointerEvents: "none",zIndex: "999"}}

    >
<ProgressSpinner   style={{

height: "3rem",

width: "3rem",

}} /> </div>}
            <ConfirmDialog
      visible={visibleValidationDialog}
      message="Veuillez remplir et enregistrer les informations de l'attachement"
      header="Validation de l'attachement"
      icon="pi pi-info-circle"
      style={{ borderRadius: '10px', padding: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
      headerStyle={{ backgroundColor: 'var(--green-400)',padding:'10px',color:'#fff' ,marginBottom:'6px'}}
      footerStyle={{ display: 'flex', justifyContent: 'space-between' }}
      onHide={() => setVisibleValidationDialog(false)}  // Close dialog and reset state
      footer={
          <Button
            label="Confirmer"
            onClick={() => { setVisibleValidationDialog(false) }}
            style={{
              backgroundColor: 'var(--green-400)', // Custom background color for the button
              borderColor: 'var(--green-400)', // Custom border color
              color: '#fff', // Button text color   
            
           
            }}/>
           }
    />



       <Toast ref={toast} />
        <Accordion multiple activeIndex={[0,1]} style={{color:"#fff",marginTop:"1rem",width:'100%'}}>
        <AccordionTab  style={{backgroundColor: 'var(--green-400)'}} header="LES INFORMATIONS LIÉES À L'ATTACHEMENT">
        <br />
        <div className="flex flex-wrap gap-4 p-fluid">
          { (attachementDetails.INSTITUTION_PILOTE=="FORETS" || attachementDetails.INSTITUTION_PILOTE=="DSA" )&& <><div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              Chef de la circonscription des forêts
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="chef_circonscription_forets"
              defaultValue={form.chef_circonscription_forets}
              className={classNames({ 'p-invalid': submitted && !form.chef_circonscription_forets})}
            />
              {submitted && !form.chef_circonscription_forets && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              Chef de district des forêts
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="chef_district_forets"
              defaultValue={form.chef_district_forets}
              className={classNames({ 'p-invalid': submitted && !form.chef_district_forets})}
            />
              {submitted && !form.chef_district_forets && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              Chef de triage des forêts
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="chef_triage_forets"
              defaultValue={form.chef_triage_forets}
              className={classNames({ 'p-invalid': submitted && !form.chef_triage_forets})}
            />
              {submitted && !form.chef_triage_forets && <small className="p-error">Champ obligatoire !</small>}
          </div></>}
          { attachementDetails.INSTITUTION_PILOTE=="HCDS" && <><div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
            Chef de zones
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="chef_zone"
              defaultValue={form.chef_zone}
              className={classNames({ 'p-invalid': submitted && !form.chef_zone})}
            />
              {submitted && !form.chef_zone && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
            Commissaire régional 
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="commisaire_reginal"
              defaultValue={form.commisaire_reginal}
              className={classNames({ 'p-invalid': submitted && !form.commisaire_reginal})}
            />
              {submitted && !form.commisaire_reginal && <small className="p-error">Champ obligatoire !</small>}
          </div>
          </>}
          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              Directeur du projet de l’ERGR
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="dir_projet_ergr"
              defaultValue={form.dir_projet_ergr}
              className={classNames({ 'p-invalid': submitted && !form.dir_projet_ergr})}
            />
              {submitted && !form.dir_projet_ergr && <small className="p-error">Champ obligatoire !</small>}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 p-fluid">
        <div className="flex-auto">
            <label htmlFor="ssn" className="font-bold block mb-2">
            Numéro de l'attachement
            </label>
            <InputNumber
              onValueChange={(event) => setFormData(event)}
              name="num_attachement"
              value={form.num_attachement}
              className={classNames({ 'p-invalid': submitted && !form.num_attachement})}
            />
              {submitted && !form.num_attachement && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
            <label htmlFor="ssn" className="font-bold block mb-2">
              Date de l'attachement
            </label>
            <Calendar
              showIcon
              dateFormat="dd/mm/yy"
              onChange={(event) => setFormData(event)}
              name="date_etabli_attachement"
              value={form.date_etabli_attachement !== null ? new Date(form.date_etabli_attachement) : null}
              className={classNames({ 'p-invalid': submitted && !form.date_signature_entr})}
            />
              {submitted && !form.date_etabli_attachement && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
            <label htmlFor="ssn" className="font-bold block mb-2">
              Date de signature de l'entreprise
            </label>
            <Calendar
              showIcon
              dateFormat="dd/mm/yy"
              onChange={(event) => setFormData(event)}
              name="date_signature_entr"
              value={form.date_signature_entr !== null ? new Date(form.date_signature_entr) : null}
              className={classNames({ 'p-invalid': submitted && !form.date_signature_entr})}
            />
              {submitted && !form.date_signature_entr && <small className="p-error">Champ obligatoire !</small>}
          </div>
          <div className="flex-auto">
            <label htmlFor="phone" className="font-bold block mb-2">
              Date de Signature de l'institution
            </label>
            <Calendar
              showIcon
              dateFormat="dd/mm/yy"
              onChange={(event) => setFormData(event)}
              name="date_signature_instutition"
              value={form.date_signature_instutition !== null ? new Date(form.date_signature_instutition) : null}
           
              className={classNames({ 'p-invalid': submitted && !form.date_signature_instutition})}
            />
              {submitted && !form.date_signature_instutition && <small className="p-error">Champ obligatoire !</small>}
          </div>

          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              Date de Signature de BET
            </label>
            <Calendar
              showIcon
              dateFormat="dd/mm/yy"
              onChange={(event) => setFormData(event)}   
              name="date_signature_bet"
              value={form.date_signature_bet !== null ? new Date(form.date_signature_bet) : null}
         
            />
          </div>
        </div>
        <br />
        {/* <div
          className="flex flex-wrap gap-4 p-fluid"
          style={{ textAlign: "right" }}
        >
          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              رئيس مقاطعة الغابات
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="chef_circonscription_forets_ar"
              defaultValue={form.chef_circonscription_forets_ar}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              رئيس إقليم الغابات
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="chef_district_forets_ar"
              defaultValue={form.chef_district_forets_ar}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              رئيس مفرزة
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="chef_triage_forets_ar"
              defaultValue={form.chef_triage_forets_ar}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="serial" className="font-bold block mb-2">
              مدير المشروع للمؤسسة الجهوية للهندسة الريفية
            </label>
            <InputText
              onChange={(event) => setFormData(event)}
              name="dir_projet_ergr_ar"
              defaultValue={form.dir_projet_ergr_ar}
            />
          </div>
        </div> */}
        <Toolbar className="mb-2 mt-3" end={footer}   ></Toolbar>
        </AccordionTab>
        <AccordionTab  style={{backgroundColor: 'var(--green-400)'}} header="ATTACHEMENT">
 
         <Toolbar className="mb-2 mt-1" left={headerRight}   ></Toolbar>
         {langue=="fr"? <Card className="p-4 m-3 square border-3 border-dark" ref={componentRef}>
          {/* <div className="col-12   text-center">
            <center>
              <p>
                <u>
                  REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</u>
                  <br/>
                  <u>
                   Ministère de
                  l’Agriculture et de Développement Rural</u>
                  <br/>
                  {attachementDetails.INSTITUTION_PILOTE=="FORETS" && (
                      <>
                      <u>Direction Générale des Forêts</u>
                      <br />
                      <u>
                        Conservation des Forêts de la Wilaya de{" "}
                        {attachementDetails.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {attachementDetails.INSTITUTION_PILOTE=="DSA" && (
                      <>
                      <u>
                      Direction  des Services Agricoles de la Wilaya de {" "}
                        {attachementDetails.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {attachementDetails.INSTITUTION_PILOTE=="HCDS" && (
                      <>
                      <u>
                      Haut-Commissariat au Développement de la Steppe de la Wilaya de 
 {" "}
                        {attachementDetails.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
               
              </p>
              <br/>
          
              <h1 >
                <u>Extrait d’attachement des travaux N° {attachementDetails.num_attachement}</u>
              </h1>
              <br/>
              <h3>
  <u>
  {infoavenant != null && (
  <>
    {infoavenant.num_avenant && `AVENANT N°${infoavenant.num_avenant} du `}
    {infoavenant.date_notif_ods} AU
    MARCHE N°{attachementDetails.num_marche} du {attachementDetails.date_notification_ods}
  </>
)}</u>
</h3>

            </center>
          </div> */}
          {/* <div className="col-12 offset-2 ml-4" style={{ fontSize: '1.2rem' }}>
            <p>Le   {form.date_etabli_attachement},nous soussignés:</p>
            <ul>
             { form.INSTITUTION_PILOTE==="FORETS" || form.INSTITUTION_PILOTE=="DSA" ? <><li>
                Mr <b>{form.chef_circonscription_forets}</b> Chef de la
                circonscription des forêts de {form.wilaya_name_ascii}
              </li>
              <li>
                Mr <b>{form.chef_district_forets} </b>  Chef de district
                des forêts de {form.wilaya_name_ascii}
              </li>
              <li>
                Mr <b> {form.chef_triage_forets} </b> Chef de triage des
                forêts de {form.wilaya_name_ascii}
              </li>
              </>
             : <><li>
                Mr <b>{form.chef_zone}</b> Chef de zones de {form.wilaya_name_ascii}
              </li>
              <li>
                Mr <b>{form.commisaire_reginal} </b>  Commissaire régional de  {form.wilaya_name_ascii}
              </li>
          
              </>}
              <li>
                Mr <b> {attachementDetails.dir_projet_ergr} </b> Directeur du projet de
                l’ERGR de {form.libelle}
              </li>
            </ul>
            <p>
  &nbsp;&nbsp;

    <span >
     <p>
  &nbsp;&nbsp;    En vertu de l’article N° ? du marché N°{attachementDetails.num_marche} du {attachementDetails.date_notification_ods}, déclarons nous être rendu au lieu-dit
   «  
    <span >
      <p style={{ display: 'inline-block', marginRight: '5px' }}>{uniqueLocalites.join(', ')}</p>
    </span>

  » de la commune de «  
    <span >
      <p style={{ display: 'inline-block', marginRight: '5px' }}> {uniqueCommunes.join(', ')}</p>
    </span>
 » pour prononcer la réception partielle des travaux de l’action de « {form.action} ». Réalisé par l’ERGR {form.libelle}.
</p>

    </span>

  
</p>

          </div> */}
          <div className="col-12 offset-3 ml-2 ">
          <div className="table-container-att">
      <table style={{border:' 1px solid #000;', borderCollapse: 'collapse'}}>
        <thead>
          <tr >
            <th >Action</th>
            <th>Commune</th>
            <th>Impact</th>
            <th>Espèces</th>
            <th>Phase</th>  
            <th>Tâche</th>  
            <th>Unité</th>  
            <th>Volume prévu</th>  
            <th>Volume réalisé antérieurement</th>  
            <th>Volume réalisé de la situation</th>  
            <th>Volume réalisé cumulé</th>

          </tr>
        </thead>
        <tbody>
        {updatedRealisation.map((row, index) => {
  // Check if it's the first occurrence of the commune_name_ascii
  const isFirstCommuneOccurrence = index === 0 || row.commune_name_ascii !== updatedRealisation[index - 1].commune_name_ascii;
  let rowspanCommune = 1;
  for (let i = index + 1; i < updatedRealisation.length; i++) {
    if (updatedRealisation[i].commune_name_ascii === row.commune_name_ascii) {
      rowspanCommune++;
    } else {
      break;
    }
  }
  const isFirstLocalitesOccurrence = index === 0 || row.LOCALITES !== updatedRealisation[index - 1].LOCALITES;
  let rowspanLocalites = 1;
  for (let i = index + 1; i < updatedRealisation.length; i++) {
    if (updatedRealisation[i].LOCALITES === row.LOCALITES) {
      rowspanLocalites++;
    } else {
      break;
    }
  }
  return (
    
    <tr key={index}>
                {index === 0 ? (
                <td rowSpan={updatedRealisation.length}>
                  <div>
                   {row.action}
                  </div>
                </td>
              ) : null}
      {/* Apply rowspan for commune_name_ascii if it's the first occurrence */}
      {isFirstCommuneOccurrence ? (
        <td rowSpan={rowspanCommune}>{row.commune_name_ascii}</td>
      ) : null}
  {isFirstLocalitesOccurrence ? (
        <td rowSpan={rowspanLocalites}>{row.LOCALITES}</td>
      ) : null}

      <td>{row.Espèces}</td>
      <td>Phase0{row.num_phase}</td>
      <td>{row.intitule_tache}</td>
      <td>{row.unite_tache}</td>
      <td>{row.quantite_tache}</td>
      <td>{row.volume_realise_antr}</td>
      <td>{row.volume_realise}</td>
      <td>{row.volume_realise_antr + row.volume_realise}</td>
    </tr>
  );
})}


        </tbody>
      </table>
    </div>
            {/* <DataTable value={updatedRealisation} size="small"  style={{ fontSize: '0.7rem' }}>
              <Column field="action" header="Action"></Column>
              <Column field="commune_name_ascii" header="Commune"></Column>
              <Column field="LOCALITES" header="Impact"></Column>
              <Column field="num_phase" header="Phase"></Column>
              <Column field="intitule_tache" header="Tâche"></Column>
              <Column field="unite_tache" header="Unité"></Column>
              <Column field="quantite_tache" header="Volume prévu"></Column>
              <Column field="volume_realise_antr" header="Volume réalisé antérieurement"   ></Column>
              <Column
                field="volume_realise"
                header="Volume réalisé de la situation"
              ></Column>
              <Column
              body={(rowData) => (
                <>{rowData.volume_realise_antr+rowData.volume_realise}</>
                
                )}
                header="Volume réalisé cumulé"
              />
            </DataTable> */}
            <br />
          

          </div>
         </Card>:
         <Card ref={componentRefAr}>
    
        
        </Card>}
        
         
        </AccordionTab>
        </Accordion>

    </Dialog>
  
  );
}

export default AttachementDetails;
