import React, { useState, useEffect, useRef }  from "react";
import {addAvenant} from '../../utils/APIRoutes';
import { Button } from "primereact/button";
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { InputText } from "primereact/inputtext";
import { Row, Col } from "reactstrap";
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
export default function AddAvenant(props){
    const [submitted, setSubmitted] = useState(false);
    const [Avenant,setAvenant]=useState({num_avenant:"", contractant:"", cocontractant:"", delais_execution:"",  montant_ht:"", retenu_garantie:"", avance_forf:"",avance_appro:"",modalite_restitution_avance_forf:"", modalite_restitution_avance_appro:"", soutretence:""})  
    const token = localStorage.getItem("token");
    const toast = useRef(null);
    const accept = () => {
      toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Avenant ajouté avec succès', life: 3000 });
  }
  
const confirm2 = () => {
  confirmDialog({
      message: 'Vous ne pouvez pas ajouter un avenant sans aucune information',
      header: 'Attention',
      icon: 'pi pi-times-circle',
      acceptClassName: 'p-button-danger',
      footer: (props) => {
          const { accept, reject } = props;

          const handlereject = () => {
      
          };

          return (
              <>
                  <Button style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)'}} label="ok" icon="pi pi-times" className="p-button-text" onClick={handlereject} />
              </>
          );
      },
  });
};

    function AddAvenant() {
   
      if(!Avenant.num_avenant || !Avenant.contractant  || !Avenant.cocontractant|| !Avenant.delais_execution ||  !Avenant.montant_ht || !Avenant.retenu_garantie || !Avenant.modalite_restitution_avance_forf  || !Avenant.modalite_restitution_avance_appro || !Avenant.soutretence )
      {
        setSubmitted(true)
      }
      else{
        if(Avenant.retenu_garantie < 100 && Avenant.modalite_restitution_avance_forf < 100 && Avenant.modalite_restitution_avance_appro  < 100 && Avenant.soutretence < 100 )
        {  
        fetch(addAvenant, {
          method: "POST",
          credentials: 'include',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({Avenant:Avenant,IDMarche:props.idMarche}),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data === "true") {
               accept();
               setTimeout(() => {
                props.setaddAvenantDialog(false);
                props.getAllAvenants();
              }, 1000);
            } 
            if ( data === "exist")
            {
              toast.current.show({ severity:'warn', summary: 'Attention', detail: 'Ce numéro existe déjà dans ce marché. Veuillez le changer', life: 4000 });
            }
          })
          .catch((error) => {
            console.error(error);
          });
        }
       }
  
      
        }
        const addAvenantDialogFooter = (
            <React.Fragment>
                <Button label="Annuler" icon="pi pi-times"  style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)',marginRight:'8px'}} outlined onClick={()=>hideAddDialog()} />
                <Button label="Ajouter" style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}  icon="pi pi-check" onClick={()=>AddAvenant()} />
            </React.Fragment>
          );
          const hideAddDialog = () => {
            setAvenant({num_avenant:"", contractant:"", cocontractant:"", delais_execution:"",  montant_ht:"", retenu_garantie:"", modalite_restitution_avance_forf:"", modalite_restitution_avance_appro:"", soutretence:""});
            setSubmitted(false);
            props.setaddAvenantDialog(false);
          };
          const onInputChange = (e, name) => {
            const val = (e.target && e.target.value) || '';
            let _Avenant = { ... Avenant };
            if (name === 'date_notif_ods') 
            {
              const originalDate = new Date(val);
              if (!isNaN(originalDate.getTime())) {
                const newDate = new Date(originalDate);
                newDate.setDate(newDate.getDate() + 1);
                _Avenant[`${name}`] =  newDate.toISOString().slice(0, 10);
              }
            }else{
              _Avenant[`${name}`] = val;
            }
            setAvenant(_Avenant);
           
          };
          
  return (
   <Dialog headerStyle={{ backgroundColor: 'var(--green-300)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}}
    visible={props.addAvenantDialog} style={{ width: '70rem' }}  breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Ajouter un nouveau avenant pour le marché n° ${props.num_marche}`}  modal className="p-fluid" footer={addAvenantDialogFooter}
 onHide={hideAddDialog}>
     <Toast ref={toast} />
     <ConfirmDialog     group="headless"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center pr-2 pl-2 pt-6 pb-3 surface-overlay border-round">
                        <div className="border-circle inline-flex justify-content-center align-items-center h-5rem w-5rem -mt-8" style={{ backgroundColor: 'var(--red-600)',color: 'var(--primary-color-text)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}>
                            <i className="pi pi-times-circle text-5xl" ></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button
                            style={{ backgroundColor: 'var(--green-500)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}
                                label="ok"
                                onClick={(event) => {
                                    hide(event);
                                    
                                }}
                                
                                className="w-8rem"
                            ></Button>
                       
                      
                        </div>
                    </div>
                )} />
                <Row>
      <Col className="mr-3">
      <div >
          <label htmlFor="num_Avenant" className="font-bold">
           Numero de l'avenant
          </label>
          <InputNumber id="num_Avenant" onValueChange={(e) => onInputChange(e, 'num_avenant')} required autoFocus className={classNames({ 'p-invalid': submitted && !Avenant.num_avenant })} />
          {submitted && !Avenant.num_avenant && <small className="p-error">Champ obligatoire !</small>}
      </div>     

      <div >
          <label htmlFor="contractant" className="font-bold">
          Contractant
          </label>
          <InputText id="contractant" onChange={(e) => onInputChange(e, 'contractant')} required className={classNames({ 'p-invalid': submitted && !Avenant.contractant })} />
          {submitted && !Avenant.contractant && <small className="p-error">Champ obligatoire !</small>}
      </div>  
    
      <div >
          <label htmlFor="cocontractant" className="font-bold">
         Cocontractant
          </label>
          <InputText id="cocontractant" onChange={(e) => onInputChange(e, 'cocontractant')} required className={classNames({ 'p-invalid': submitted && !Avenant.cocontractant })}  />
          {submitted && !Avenant.cocontractant && <small className="p-error">Champ obligatoire !</small>}
      </div>  
  
      <div >
          <label htmlFor="mantant_ht" className="font-bold">
         Montant HT
          </label>
          <InputNumber suffix=" DA" minFractionDigits={2} value={Avenant.montant_ht} id="montant_ht" onValueChange={(e) => onInputChange(e, 'montant_ht')} required  className={classNames({ 'p-invalid': submitted && !Avenant.montant_ht})}  />
          {submitted && !Avenant.montant_ht && <small className="p-error">Champ obligatoire !</small>}
      </div>  
      <div >
          <label htmlFor="delais_execution" className="font-bold">
            Délais d'execution (mois)
          </label>
          <InputNumber suffix=" mois" id="delais_execution" onValueChange={(e) => onInputChange(e, 'delais_execution')} required className={classNames({ 'p-invalid': submitted && !Avenant.delais_execution })}  />
          {submitted && !Avenant.delais_execution && <small className="p-error">Champ obligatoire !</small>}
      </div>  
    
      </Col>
      <Col className="ml-3">  
      <div >
          <label htmlFor="date_notif_ods" className="font-bold">
             Date notification ODS
          </label>
          <Calendar  id="date_notif_ods" onChange={(e) => onInputChange(e, 'date_notif_ods')}  required className={classNames({ 'p-invalid': submitted && !Avenant.date_notif_ods })} />
          {submitted && !Avenant.date_notif_ods && <small className="p-error">Champ obligatoire !</small>}
      </div> 
             {/* <div >
                    <label htmlFor="avance_forf" className="font-bold">
                     Avance forfaitaire (%)
                    </label>
                    <InputNumber minFractionDigits={2}  value={Avenant.avance_forf}
                    className={classNames({ 'p-invalid': submitted && !Avenant.avance_forf })}
                    suffix=" %" id="avance_forf" onValueChange={(e) => onInputChange(e, 'avance_forf')}/>
                    {submitted && !Avenant.avance_forf && <small className="p-error">Champ obligatoire !</small>}
                    { Avenant.avance_forf>100 && <small className="p-error">Pourcentage de l'avance forfaitaire ne doit pas dépasser 100% !</small>}
              </div> 
              
              <div >
                    <label htmlFor="avance_appro" className="font-bold">
                     Avance approvisionement (%)
                    </label>
                    <InputNumber minFractionDigits={2}  value={Avenant.avance_appro}
                    className={classNames({ 'p-invalid': submitted && !Avenant.avance_appro })}
                    suffix=" %" id="avance_appro" onValueChange={(e) => onInputChange(e, 'avance_appro')}/>
                    {submitted && !Avenant.avance_appro && <small className="p-error">Champ obligatoire !</small>}
                    { Avenant.avance_appro>100 && <small className="p-error">Pourcentage de l'avance d'approvisionement ne doit pas dépasser 100% !</small>}
              
              </div>  */}
       <div >
           <label htmlFor="modalite_restitution_avance_forf" className="font-bold">
            Modalites de restitution de l'avance forfaitaire (%)
           </label>
           <InputNumber suffix=" %" id="modalite_restitution_avance_forf" onValueChange={(e) => onInputChange(e, 'modalite_restitution_avance_forf')}  required className={classNames({ 'p-invalid': submitted && !Avenant.modalite_restitution_avance_forf })} />
           {submitted && !Avenant.modalite_restitution_avance_forf && <small className="p-error">Champ obligatoire !</small>}
           {Avenant.modalite_restitution_avance_forf>100 && <small className="p-error">Pourcentage de modalites de restitution de l'avance forfaitaire ne doit pas dépasser 100% !</small>}
       </div> 
    
      <div >
          <label htmlFor="modalite_restitution_avance_forf" className="font-bold">
           Modalites de restitution de l'avance d'approvisionement (%)
          </label>
          <InputNumber  suffix=" %" id="modalite_restitution_avance_appro" onValueChange={(e) => onInputChange(e, 'modalite_restitution_avance_appro')} required className={classNames({ 'p-invalid': submitted && !Avenant.modalite_restitution_avance_appro })} />
          {submitted && !Avenant.modalite_restitution_avance_appro && <small className="p-error">Champ obligatoire !</small>}
          { Avenant.modalite_restitution_avance_appro>100 && <small className="p-error">Pourcentage de modalites de restitution de l'avance d'approvisionement ne doit pas dépasser 100% !</small>}
      </div> 
      <div >
          <label htmlFor="retenu_garantie" className="font-bold">
            Retenu de garantie (%)
          </label>
          <InputNumber  suffix=" %" id="retenu_garantie" onValueChange={(e) => onInputChange(e, 'retenu_garantie')}  required className={classNames({ 'p-invalid': submitted && !Avenant.retenu_garantie })}  />
          {submitted && !Avenant.retenu_garantie && <small className="p-error">Champ obligatoire !</small>}
          { Avenant.retenu_garantie>100 && <small className="p-error">Pourcentage de retenu de garantie ne doit pas dépasser 100% !</small>}
      </div> 
      <div >
          <label htmlFor="soutretence" className="font-bold">
        Sous-traitance (%)
          </label>
          <InputNumber suffix=" %" id="soutretence" onValueChange={(e) => onInputChange(e, 'soutretence')} required className={classNames({ 'p-invalid': submitted && !Avenant.soutretence })}  />
          {submitted && !Avenant.soutretence && <small className="p-error">Champ obligatoire !</small>}
          {Avenant.soutretence>100 && <small className="p-error">Pourcentage de soutraitance ne doit pas dépasser 100% !</small>}
      </div> 
    
      </Col>
      
    </Row>
 </Dialog>
 );
}

