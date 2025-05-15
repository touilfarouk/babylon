import React, { useState, useEffect, useRef }  from "react";
import {GetAvenant,getDetAvenant,updateAvenant} from '../../utils/APIRoutes';
import { useParams, useNavigate } from "react-router-dom";
import { DataView } from 'primereact/dataview';
import { Button } from "primereact/button";
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { InputText } from "primereact/inputtext";
import { Row, Col } from "reactstrap";
import { classNames } from 'primereact/utils';
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { InputNumber } from 'primereact/inputnumber';
import { uploadPdf,ReadPdf } from '../../utils/APIRoutes';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import AddAvenant from './AddAvenant';
export default function Avenant(){
  const token = localStorage.getItem("token");
  const [submitted, setSubmitted] = useState(false);
  const [disable, setdisable] = useState(true);
  const [AvenantDialog, setAvenantDialog] = useState(false)
  const [layout, setLayout] = useState('grid');
  const [listAvenant, setlistAvenant] = useState([]);
  const [Avenant,setAvenant]=useState({num_avenant:"", contractant:"", cocontractant:"", avance_forf:"", avance_appro	:"", delais_execution:"", objet:"", montant_ht:"", tva:"", avance_for:"", avance_appro:"", date_notification_ods:"", retenu_garantie:"", modalite_restitution_avance_forf:"", modalite_restitution_avance_appro:"", soutretence:""})  
  const [UpdateAvenant,setUpdateAvenant]=useState({}) 
  const idprog = useParams().idprog;
  const idMarche = useParams().idmarche; 
  const formData = new FormData(); 
  const num_marche = useParams().num_marche; 
  const [addAvenantDialog, setaddAvenantDialog] = useState(false);
  const Navigate  = useNavigate ();
  function getAllAvenants() {
    fetch(GetAvenant, {
       method: "POST",
       credentials: "include",
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`, // Initialize 'token' before using it
       },
       body: JSON.stringify({idprog:idprog,idMarche:idMarche})})

       .then((reponse) => reponse.json())
       .then((data) => {
        setlistAvenant(data);
       })
       .catch((error) => {
         console.log("Error:", error);
       });
   }
   useEffect(() => {
    getAllAvenants();
  }, []);

  /************************************* */

  const handleFileChange = (event,id) => {
    formData.append('file', event.target.files[0]);

      sendFile(id);
   
  };
  const sendFile = (idav) => {
    var path=`${uploadPdf}/5/${idav}`;
 
    try {
      fetch(path, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, // Initialize 'token' before using it
          },
        body: formData,
          }).then((response) => response.json())
           .then((data) => {
          if(data=="update")
          {
          
            toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Le fichier PDF a été uploadé avec succès', life: 3000 });
          }
   
           formData.forEach((value, key) => {
           formData.delete(key);
           });
       
         })
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileOpen = (fileName) => {
    if(!fileName)
      {
        toast.current.show({ severity: 'warn', summary: 'Rejeté', detail: "La pièce jointe de ce CPT n'a pas encore été uploadée", life: 3000 });
      }
      else{    fetch(ReadPdf, {
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


  /******************************* */
  const listItem = (realisation) => {
    return (
        <div className="col-12">
            <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{realisation.name}</div>
                        <Rating value={realisation.rating} readOnly cancel={false}></Rating>
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-tag"></i>
                                <span className="font-semibold">{realisation.category}</span>
                            </span>
                            <Tag value={realisation.inventoryStatus} severity={getSeverity(realisation)}></Tag>
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">${realisation.price}</span>
                        <Button  icon="pi pi-shopping-cart" className="p-button-rounded" disabled={realisation.inventoryStatus === 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
const getSeverity = (realisation) => {
    switch (realisation.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};
const gridItem = (Avenant) => {
    return (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-6 p-2">
            <div className="p-2 border-3 surface-border surface-card border-round" >
              
                <div className="flex flex-column align-items-center justify-center gap-1 py-1"  >
                    <div  style={{ backgroundColor: 'var(--yellow-100)', borderRadius: 'var(--border-radius)'}}>
                   &nbsp; &nbsp; <b>REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</b>&nbsp; &nbsp;
                   </div>
                   <div>
                   <div className="text-2xl align-items-center justify-center mt-3"  style={{ backgroundColor: 'var(--yellow-200)', borderRadius: 'var(--border-radius)'}}> &nbsp;&nbsp;&nbsp;Ministère del’Agriculture et de Développement Rural
                 </div>
                    <br/>
                    <br/>
                    <br/>
               
                    <div className="text-2xl border-2 p-2 "> 
                    Avenant <span  style={{ backgroundColor: 'var(--red-100)', borderRadius: 'var(--border-radius)'}}>N° {Avenant.num_avenant}</span> de la mise en œuvre du plan d'actionde la Réhabilitation,de l'Exention et du
                    Développement du barrage vert <span  style={{ backgroundColor: 'var(--red-100)', borderRadius: 'var(--border-radius)'}}>{Avenant.debut}-{Avenant.fin}</span> du marché <span  style={{ backgroundColor: 'var(--red-100)', borderRadius: 'var(--border-radius)'}}> N° {Avenant.num_marche}</span>
                    </div>
                    <div className="text-xl p-4"> <b>Objet: </b> {Avenant.objet}
                    </div>
                 
                  
                    <div className="flex sm:flex-row justify-content-end align-items-center sm:align-items-end gap-2 pt-3 sm:gap-2 m-3">
                            
                    <Button className="p-button-rounded" 
    style={{ 
        backgroundColor: 'var(--green-400)',
        borderColor: 'var(--green-400)', 
        borderRadius: 'var(--border-radius)' 
    }}  
    onClick={() => { getAvenant(Avenant.id_Avenant); setAvenantDialog(true); }} 
>
    Voir l'avenant
</Button>

<label 
    className="addfile" 
    htmlFor="file-input" 
    style={{ 
        backgroundColor: 'var(--green-400)', // Button-like color
        borderColor: 'var(--green-400)', // Button-like border
        borderRadius: 'var(--border-radius)', // Rounded corners
        padding: '0.3rem 0.8rem', // Button-like padding
        display: 'inline-block', // Make it like a button
        cursor: 'pointer', 
        fontSize: '1.2rem', 
        color: '#fff', // Change text color to white to match button
        textAlign: 'center', 
    }}
>
    Ajouter la pièce jointe
</label>

<input
    className="inputfile"
    id="file-input"
    type="file"
    name="file"
    style={{ display: 'none' }} // Hide the actual file input
    onChange={(event) => handleFileChange(event, Avenant.id_Avenant)}
/>
<Button className="p-button-rounded" 
    style={{ 
        backgroundColor: 'var(--green-400)',
        borderColor: 'var(--green-400)', 
        borderRadius: 'var(--border-radius)' 
    }}  
    onClick={() => {Avenant.pdf!="" ?handleFileOpen(Avenant.pdf) :   toast.current.show({ severity: 'warn', summary: 'Attention', detail: "Vous n'avez pas encore uploadé la pièce jointe", life: 3000 }); }} 
>
    Voir la pièce jointe de l'avenant
</Button>
 <Button raised className="p-button-rounded" 
 style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', 
 borderRadius: 'var(--border-radius)', padding: '3px', fontSize: "15px" }} 
 onClick={() => {Navigate(`/admin/allimp/${idMarche}/${idprog}/${num_marche}/${""}`)}}>Action impactee</Button>
                        </div>
                    </div>
                
                
                </div>
                {/* <div className="flex align-items-center justify-content-between">
                    <span className="text-2xl font-semibold"></span>
                    <Button  style={{ backgroundColor: 'var(--cyan-800)',borderColor:'var(--cyan-800)', borderRadius: 'var(--border-radius)' }} className="p-button-rounded"  >Voir Detail</Button>
                </div> */}
            </div>
        </div>
    );
};
  const itemTemplate = (Avenant, layout) => {
    if (!Avenant) {
        return;
    }

    if (layout === 'list') return listItem(Avenant);
    else if (layout === 'grid') return gridItem(Avenant);
};

  const onInputChangeUpdate = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _Avenant = { ... UpdateAvenant };
    if (name === 'date_notif_ods' ) 
    {
      const originalDate = new Date(val);
      if (!isNaN(originalDate.getTime())) {
        const newDate = new Date(originalDate);
        newDate.setDate(newDate.getDate() + 1);
        _Avenant[`${name}`] =  newDate.toISOString().slice(0, 10);
      }
    }
    else{
    _Avenant[`${name}`] = val;
    }
    setUpdateAvenant(_Avenant);
  };

  function updateAvenantData() {
    if( !UpdateAvenant.num_avenant || !UpdateAvenant.contractant  || !UpdateAvenant.cocontractant|| !UpdateAvenant.delais_execution ||  !UpdateAvenant.montant_ht || !UpdateAvenant.retenu_garantie || !UpdateAvenant.modalite_restitution_avance_forf  || !UpdateAvenant.modalite_restitution_avance_appro || !UpdateAvenant.soutretence )
      {
        setSubmitted(true)
      }
       else{
        if(UpdateAvenant.retenu_garantie < 100 && UpdateAvenant.modalite_restitution_avance_forf < 100 && UpdateAvenant.modalite_restitution_avance_appro  < 100 && UpdateAvenant.soutretence < 100 )
        {   
       
          fetch(updateAvenant, {
          method: "POST",
          credentials: 'include',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(UpdateAvenant),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data === "true") {
              accept()
              getAllAvenants();
              hideDialog();
            }
            else{
              reject()
            }
          })
          .catch((error) => {
            console.error(error);
          });}

      }
  }
  
    function getAvenant(id_Avenant) {
  
      fetch(getDetAvenant, {
        method: "POST",
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({id_Avenant:id_Avenant}),
      })
        .then((response) => response.json())
        .then((data) => {
          setUpdateAvenant(data[0])
        })
        .catch((error) => {
          console.error(error);
        });
      
    }
  
    const actionPDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)',marginRight:'8px'}} icon="pi pi-times" outlined onClick={()=>hideDialog()} />
            <Button disabled={disable} style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  label="Enregister les modification" icon="pi pi-check" onClick={()=>updateAvenantData()} />
        </React.Fragment>
      );


      const hideDialog = () => {
         setdisable(true)
        setSubmitted(false);
        setAvenantDialog(false);
      };
   
      const toast = useRef(null);
      const accept = () => {
        toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Avenant modifier avec succès', life: 3000 });
    }
    const reject = () => {
      toast.current.show({ severity: 'danger', summary: 'Confirmé', detail: "La modification de l'avenant a échoué", life: 3000 });
  }
      const leftToolbarTemplateUpdate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button className="m-1 p-2" style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  label="MODIFIER" icon="pi pi-pencil" onClick={()=>setdisable(false)}/>
            </div>
        );
      };
      const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2 ">
              <Button icon="pi pi-arrow-left" label ="Retour" onClick={()=>{Navigate(`/admin/marche/${idprog}`)}} style={{ background:'var(--red-500)', borderColor:'var(--yellow-600)'}} raised />
                <Button label="NOUVEAU AVENANT" onClick={()=>setaddAvenantDialog(true)} raised style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  icon="pi pi-plus" />
            </div>
        );
      };
return(<div className="content mt-3">
<p style={{  fontSize: '20px'}}> Avenants</p>

<Toast ref={toast} />
{addAvenantDialog && <AddAvenant getAllAvenants = {getAllAvenants} idMarche={idMarche} num_marche ={num_marche} addAvenantDialog={addAvenantDialog} setaddAvenantDialog={setaddAvenantDialog} />}
    <Row>
        <Col md="12">
        <Toolbar className="mb-2 p-2" left={leftToolbarTemplate}></Toolbar>
          <DataView  value={listAvenant} itemTemplate={itemTemplate} layout={layout} />
        </Col>
      </Row>

      <Dialog headerStyle={{ backgroundColor: 'var(--green-300)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}}
       visible={AvenantDialog} style={{ width: '60rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={UpdateAvenant.num_avenant ?`Détail l'avenant N° ${UpdateAvenant.num_avenant} du marché N° ${num_marche}`:""} modal className="p-fluid" footer={actionPDialogFooter } onHide={hideDialog} >       
      <Toolbar className="m-1 p-1 pl-3" left={leftToolbarTemplateUpdate}></Toolbar>
              <Row>

                <Col className="mr-3">
                <div >
                    <label htmlFor="num_avenant" className="font-bold">
                     Numero de l'avenant
                    </label>
                    <InputNumber disabled={disable} value={UpdateAvenant.num_avenant} id="num_avenant" className={classNames({ 'p-invalid': submitted && !UpdateAvenant.num_avenant })}
                    onValueChange={(e) => onInputChangeUpdate(e, 'num_avenant')} required autoFocus />
                    {submitted && !UpdateAvenant.num_avenant && <small className="p-error">Champ obligatoire !</small>}
                </div>
                   
                <div >
                    <label htmlFor="contractant" className="font-bold">
                    Contractant
                    </label>
                    <InputText disabled={disable}  value={UpdateAvenant.contractant} id="contractant" className={classNames({ 'p-invalid': submitted && !UpdateAvenant.contractant})}
                     onChange={(e) => onInputChangeUpdate(e, 'contractant')} required />
                    {submitted && !UpdateAvenant.contractant && <small className="p-error">Champ obligatoire !</small>}
                </div>  
            
                <div >
                    <label htmlFor="cocontractant" className="font-bold">
                   Cocontractant
                    </label>
                    <InputText disabled={disable} id="cocontractant"  value={UpdateAvenant.cocontractant}
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.cocontractant })}
                    onChange={(e) => onInputChangeUpdate(e, 'cocontractant')} required />
                    {submitted && !UpdateAvenant.cocontractant && <small className="p-error">Champ obligatoire !</small>}
                </div>  
        
                <div >
                    <label htmlFor="mantant_ht" className="font-bold">
                   Montant HT (DA)
                    </label>
                    <InputNumber disabled={disable} minFractionDigits={2} id="montant_ht" value={UpdateAvenant.montant_ht} 
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.montant_ht })}
                    onValueChange={(e) => onInputChangeUpdate(e, 'montant_ht')} required/>
                    {submitted && !UpdateAvenant.montant_ht && <small className="p-error">Champ obligatoire !</small>}
                </div>  
                <div >
                    <label htmlFor="delais_execution" className="font-bold">
                      Délais d'execution (mois)
                    </label>
                    <InputNumber  disabled={disable} value={UpdateAvenant.delais_execution} 
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.delais_execution})}
                    suffix= " mois" id="delais_execution" onValueChange={(e) => onInputChangeUpdate(e, 'delais_execution')} required />
                    {submitted && !UpdateAvenant.delais_execution && <small className="p-error">Champ obligatoire !</small>}
                </div>  

                <div >
          <label htmlFor="date_notif_ods" className="font-bold">
          Date notification ODS
          </label>
          <Calendar disabled={disable}  dateFormat="dd/mm/yy" id="date_notif_ods" className={classNames({ 'p-invalid': submitted && !UpdateAvenant.date_notif_ods })}
           onChange={(e) => onInputChangeUpdate(e, 'date_notif_ods')}
             value={UpdateAvenant.date_notif_ods!== null ? new Date(UpdateAvenant.date_notif_ods) : null} showIcon
         required/>
          {submitted && !UpdateAvenant.date_notif_ods && <small className="p-error">Champ obligatoire !</small>}
      </div> 
                </Col>
                <Col className="ml-3">
       
              {/* <div >
                    <label htmlFor="avance_forf" className="font-bold">
                     Avance forfaitaire (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateAvenant.avance_forf}
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.avance_forf })}
                    suffix=" %" id="avance_forf" onValueChange={(e) => onInputChangeUpdate(e, 'avance_forf')}/>
                    {submitted && !UpdateAvenant.avance_forf && <small className="p-error">Champ obligatoire !</small>}
                    { UpdateAvenant.avance_forf>100 && <small className="p-error">Pourcentage de l'avance forfaitaire ne doit pas dépasser 100% !</small>}
              </div> 
              
              <div >
                    <label htmlFor="avance_appro" className="font-bold">
                     Avance approvisionement (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateAvenant.avance_appro}
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.avance_appro })}
                    suffix=" %" id="avance_appro" onValueChange={(e) => onInputChangeUpdate(e, 'avance_appro')}/>
                    {submitted && !UpdateAvenant.avance_appro && <small className="p-error">Champ obligatoire !</small>}
                    { UpdateAvenant.avance_appro>100 && <small className="p-error">Pourcentage de l'avance d'approvisionement ne doit pas dépasser 100% !</small>}
              
              </div>  */}

              <div >
                    <label htmlFor="modalite_restitution_avance_forf" className="font-bold">
                     Modalites de restitution de l'avance forfaitaire (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateAvenant.modalite_restitution_avance_forf}
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.modalite_restitution_avance_forf })}
                    suffix=" %" id="modalite_restitution_avance_forf" onValueChange={(e) => onInputChangeUpdate(e, 'modalite_restitution_avance_forf')}  />
                    {submitted && !UpdateAvenant.modalite_restitution_avance_forf && <small className="p-error">Champ obligatoire !</small>}
                    { UpdateAvenant.modalite_restitution_avance_forf>100 && <small className="p-error">Pourcentage de modalites de restitution de l'avance forfaitaire ne doit pas dépasser 100% !</small>}
                </div> 
            
                <div>
                    <label htmlFor="modalite_restitution_avance_appro" className="font-bold">
                     Modalites de restitution de l'avance d'approvisionement (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateAvenant.modalite_restitution_avance_appro}
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.modalite_restitution_avance_appro})}
                    suffix=" %" id="modalite_restitution_avance_appro" onValueChange={(e) => onInputChangeUpdate(e, 'modalite_restitution_avance_appro')}  />
                    {submitted && !UpdateAvenant.modalite_restitution_avance_appro && <small className="p-error">Champ obligatoire !</small>}
                    { UpdateAvenant.modalite_restitution_avance_appro>100 && <small className="p-error">Pourcentage de modalites de restitution de l'avance d'approvisionement ne doit pas dépasser 100% !</small>}
                </div> 

                <div >
                    <label htmlFor="retenu_garantie" className="font-bold">
                  Retenu de garantie (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateAvenant.retenu_garantie} 
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.retenu_garantie })}
                    suffix=" %" id="retenu_garantie" onValueChange={(e) => onInputChangeUpdate(e, 'retenu_garantie')}   />
                    {submitted && !UpdateAvenant.retenu_garantie && <small className="p-error">Champ obligatoire !</small>}
                    { UpdateAvenant.retenu_garantie>100 && <small className="p-error">Pourcentage de retenu de garantie ne doit pas dépasser 100% !</small>}
                </div> 
                <div >
                    <label htmlFor="soutretence" className="font-bold">
                  Sous-traitance (%)
                    </label>
                    <InputNumber minFractionDigits={2} disabled={disable} value={UpdateAvenant.soutretence} suffix=" %" id="soutretence" 
                    className={classNames({ 'p-invalid': submitted && !UpdateAvenant.soutretence})}
                    onValueChange={(e) => onInputChangeUpdate(e, 'soutretence')}   />
                  {submitted && !UpdateAvenant.soutretence && <small className="p-error">Champ obligatoire !</small>}
                  { UpdateAvenant.soutretence>100 && <small className="p-error">Pourcentage de soutraitance ne doit pas dépasser 100% !</small>}
                </div> 
            
                </Col>
              
              </Row>
   
      </Dialog>
  
    </div>)
}