import React, { useState, useEffect, useRef }  from "react";
import {addActionProgramme,getAction,getComposanteDict,addComposante} from '../../utils/APIRoutes';
import { useParams, useHistory } from "react-router-dom";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Toolbar } from 'primereact/toolbar';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import {Row,Card} from "reactstrap";
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
export default  function ActionProgramme() {
  const token = localStorage.getItem('token');
  const [actionPragramme, setactionPragramme] = useState([]);
  const [composante, setcomposante]=useState([]);
  const [actionPrDialog, setactionPrDialog] = useState(false);
  const [composantDialog, setcomposantDialog] = useState(false);
  const [action_p, setaction_p] = useState({action:"",composante_madr:""});
  const [addcomposante, setaddcomposante] = useState({composante_madr:""});

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const accept = () => {
      toast.current.show({ severity: 'success', summary: 'Confirmé', detail: "L'action a été ajoutée avec succès", life: 3000 });
  }
  const reject = () => {
      toast.current.show({ severity: 'warn', summary: 'Rejeté', detail: "L'action que vous avez insérée existe déjà", life: 3000 });
  }
  function getAllAction() {
  fetch(getAction, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-cache',
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
   })
    .then((response) => response.json())
    .then((data) => {
        setactionPragramme(data);
     })
    .catch((error) => {
      console.log('Error:', error);
    });
  } 
  function getAllComposante() {
    fetch(getComposanteDict, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
     })
      .then((response) => response.json())
      .then((data) => {
        setcomposante(data);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
    }  
useEffect(() => {
  getAllAction();
  getAllComposante();
}, []); 
  
  function addActionP() {
        if(!action_p.composante_madr || !action_p.action)
        {
          setSubmitted(true)
        }
        else{
          fetch(addActionProgramme, {
            method: "POST",
            credentials: 'include',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({action_p:action_p}),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data === "true") {
                getAllAction();
                hideDialog();
                accept()
              } 
              if(data === "exist")
              {
                reject()
              }
            })
            .catch((error) => {
              console.error(error);
            });
          }
        }
        const actionPDialogFooter = (
            <React.Fragment>
                <Button label="Annuler"  style={{ backgroundColor: 'var(--red-400)',borderColor:'var(--red-400)' , color: '#fff'}} icon="pi pi-times" outlined onClick={()=>hideDialog()} />
                <Button label="Ajouter" style={{backgroundColor: 'var(--green-500)',borderColor:'var(--green-500)',marginLeft:'5px'}}  icon="pi pi-check" onClick={addActionP} />
            </React.Fragment>
          );
          const actionPDialogFooter2 = (
            <React.Fragment>
                <Button label="Annuler"  style={{ color: '#fff',backgroundColor:'var(--red-400)',borderColor:'var(--red-500)'}} icon="pi pi-times"  onClick={()=>hideDialog()} />
                <Button label="Ajouter" style={{backgroundColor: 'var(--green-500)',borderColor:'var(--green-500)',marginLeft:'5px'}}  icon="pi pi-check" onClick={addActionP} />
            </React.Fragment>
          );

          const hideDialog = () => {
            setaction_p({action:"",composante_madr:""});
            setSubmitted(false);
            setactionPrDialog(false);
            setcomposantDialog(false);
            setaddcomposante({composante_madr:""})
          };
          const onInputChange = (e, name) => {
            const val = (e.target && e.target.value) || '';
            let _actionp = { ... action_p };
            _actionp[`${name}`] = val;
            setaction_p(_actionp);
          };
          const onInputChangeComposante = (e, name) => {
            const val = (e.target && e.target.value) || '';
            let _composante = { ... addcomposante };
            _composante[`${name}`] = val;
            setaddcomposante(_composante);
          };
          const leftToolbarTemplate = () => {
            return (
                <div className="flex flex-wrap gap-2">
                    <Button style={{backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)'}}  label="NOUVELLE ACTION PROGRAMME" icon="pi pi-plus" onClick={()=>{setactionPrDialog(true); getAllComposante()}}/>
                </div>
            );
          };
          const leftToolbarTemplate2 = () => {
            return (
                <div className="flex flex-wrap gap-2">
                    <Button style={{backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)'}}  label="NOUVELLE COMPOSANTE PM" icon="pi pi-plus" onClick={()=>setcomposantDialog(true)}/>
                </div>
            );
          };
return<div className="content mt-8">
      <Toast ref={toast} />
      <Accordion activeIndex={0}>
      <AccordionTab header="La liste des composante PM" style={{backgroundColor: 'var(--green-400)'}}>
    <Row >
              <Card style={{ height: "auto" , width:'100%'}}>  
          
              <Toolbar className="mb-4" left={leftToolbarTemplate2}></Toolbar>
              <DataTable value={composante} size={'small'} tableStyle={{ maxWidth: '95%',marginLeft:"1rem", borderCollapse: 'collapse', border: '1px solid #ddd'}}
                    dataKey="id_composante"  paginator rows={10}>
              
                <Column field="label" header="COMPOSANTE PM"/>
                
            </DataTable>
            
              </Card>
      </Row>
    </AccordionTab>
    <AccordionTab header="La liste des action programme" style={{backgroundColor: 'var(--green-400)'}}>
    <Row >
              <Card style={{ height: "auto" , width:'100%'}}>  
          
              <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
              <DataTable value={actionPragramme} size={'small'} tableStyle={{ maxWidth: '70rem',marginLeft:"5rem", borderCollapse: 'collapse', border: '1px solid #ddd'}}
                    dataKey="IDaction_programme"  paginator rows={10}>
                <Column field="action" header="L'INTITULE DE L'ACTION" />
                <Column field="composante_mdr" header="COMPOSANTE PM"/>
                
            </DataTable>
            
              </Card>
      </Row>
    </AccordionTab>

  
</Accordion>

      <Dialog visible={actionPrDialog}  headerStyle={{backgroundColor: 'var(--green-500)',borderColor:'var(--green-500)',height:'12px',color:'#fff',borderRadius:'15px',marginBottom:"5px"}}   className="p-fluid"  
       style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Ajouter une nouvelle action programme" modal footer={actionPDialogFooter } onHide={hideDialog} >       
                <div >
                    <label htmlFor="actionP" className="font-bold">
                        ACTION
                    </label>
                    <InputText  value={action_p.action} 
                    id="actionP" onChange={(e) => onInputChange(e, 'action')} required autoFocus className={classNames({ 'p-invalid': submitted && !action_p.action })} />
                    {submitted && !action_p.action && <small className="p-error">Champ obligatoire !</small>}
                </div>     
                <div >
                    <label htmlFor="composante_madr" className="font-bold">
                    COMPOSANTE PM
                    </label>
                    <Dropdown
                   options={composante} 
                   value={action_p.composante_madr}
                   placeholder="Marché" 
                   onChange={(e) => {onInputChange(e, 'composante_madr')}} 
                   className={classNames({ 'p-invalid': submitted && !action_p.composante_madr })}
          style={{  marginTop: '5px' }} 
         />
                    {submitted && !action_p.composante_madr && <small className="p-error">Champ obligatoire !</small>}
                </div>  

      </Dialog>
      <Dialog visible={composantDialog} style={{ width: '32rem' }} headerStyle={{backgroundColor: 'var(--green-500)',borderColor:'var(--green-400)',height:'12px',color:'#fff',borderRadius:'15px',marginBottom:"5px"}}  breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Ajouter une nouvelle action programme" modal className="p-fluid" footer={actionPDialogFooter2 } onHide={hideDialog} >       
                
                <div >
                    <label htmlFor="composante_madr" className="font-bold">
                    COMPOSANTE PM
                    </label>
                    <InputText id="composante_madr" onChange={(e) => onInputChangeComposante(e, 'composante_madr')} required className={classNames({ 'p-invalid': submitted && !action_p.composante_madr })} />
                    {submitted && !action_p.composante_madr && <small className="p-error">Champ obligatoire !</small>}
                </div>  

      </Dialog>
</div>          
}