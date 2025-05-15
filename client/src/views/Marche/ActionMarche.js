import React, { useState, useEffect, useRef }  from "react";
import {getActionMarche,getAction,addActionMarche,DeleteActionMarche} from '../../utils/APIRoutes';
import { useParams } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from "primereact/button";
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useNavigate  } from 'react-router-dom';
import { Toast } from 'primereact/toast';
export default  function ActionMarche() {
  const token = localStorage.getItem('token');
  const [actionPragramme, setactionPragramme] = useState([]);
  const [actionMarche, setactionMarche] = useState([]);
  const [selected, setSelected] = useState([]);
  const id= useParams().idmarche;     
  const idprog=useParams().idprog
  const nummarche= useParams().nummarche;
  const toast = useRef(null);
  const Navigate  = useNavigate ();
  const accept = () => {
      toast.current.show({ severity: 'success', summary: 'Confirmation', detail: 'Suppression réussie.', life: 3000 });
  }

  const reject = () => {
      toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  function getAllActionMarche() {
    fetch(getActionMarche, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({idmarche:id})})
      .then((response) => response.json())
      .then((data) => {
        setactionMarche(data);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
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
    body: JSON.stringify({marche:"oui",idmarche:id})})
    .then((response) => response.json())
    .then((data) => {
        setactionPragramme(data);
     })
    .catch((error) => {
      console.log('Error:', error);
    });
}  
useEffect(() => {
  getAllAction();
  getAllActionMarche();
}, [id]); 
const confirmDelete = (rowData) => {
  confirmDialog({
    message: (
      <>
        <b>Attention</b>, si vous supprimez l'action {rowData.action},<br />
        vous risquez de supprimer toutes les actions impliquées liées à cette action.
      </>
    ),
      header: `Voulez-vous supprimer l'action ${rowData.action} du marche ${nummarche}`,
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      footer: (props) => {
        const { accept, reject } = props;

        const handleAccept = () => {
          deleteActionM(rowData.id_pro_action_pro);
            accept();
    
        };
        const handlereject = () => {
            reject();
    
        };

        return (
            <>
                <Button style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)'}} label="Annuler" icon="pi pi-times" className="p-button-text" onClick={handlereject} />
                <Button style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)', borderRadius: 'var(--border-radius)'}} label="Confirmer" icon="pi pi-check" className="p-button-text" onClick={handleAccept} />
            </>
        );
    },
  });
};
  function deleteActionM(id) {
 
          fetch(DeleteActionMarche, {
            method: "POST",
            credentials: 'include',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({id_pro_action_pro:id}),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data === "true") {
                getAllActionMarche()
                getAllAction()
                accept()
              } 
              else{
                reject()
              }
            })
            .catch((error) => {
              console.error(error);
            });
          }
  function addActionM() {
 
            fetch(addActionMarche, {
              method: "POST",
              credentials: 'include',
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({selected:selected,id_marche:id}),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data === "true") {
                  toast.current.show({ severity: 'success', summary: 'Confirmation', detail: "L'action a été ajoutée au marché avec succès.", life: 3000 });
                  getAllAction();
                  getAllActionMarche();
                  setSelected([])
                } 
              })
              .catch((error) => {
                console.error(error);
              });
            }
   

          const leftToolbarTemplate = () => {
            return (
                <div className="flex flex-wrap gap-2">
                    <Button label="Ajouter au marche" disabled={Object.keys(selected).length === 0} onClick={()=>addActionM()}  style={{backgroundColor: 'var(--green-400)',borderColor:'var(--green-200)'}} />
                </div>
            );
          };
return<div className="content mt-3">
        <ConfirmDialog />
        <Toast ref={toast} />
  <p style={{  fontSize: '20px'}}> Les actions du marché N°{nummarche} </p>
  <Button icon="pi pi-arrow-left" label ="Retour"onClick={()=>{Navigate(`/admin/marche/${idprog}`)}} style={{  marginRight: '10px',marginBottom:"10px"  , background:'var(--red-500)', borderColor:'var(--red-400)'}} raised />
  <Accordion multiple activeIndex={[0,1]}>
    <AccordionTab style={{backgroundColor: 'var(--green-300)'}} header={`La liste des actions du marché N° ${nummarche}`}>
    <DataTable showGridlines  value={actionMarche}  size={'small'}
                    dataKey="IDaction_programme" tableStyle={{ maxWidth: '70rem',marginLeft:"5rem", borderCollapse: 'collapse', border: '1px solid #ddd' }}  paginator rows={10}>
          
                <Column field="action" header="L'INTITULE DE L'ACTION" headerStyle={{ width: '50rem',height:'1rem' }} />
                <Column field="composante_mdr" header="COMPOSANTE MADR"  headerStyle={{ width: '50rem' }}/>
                <Column  header="ACTION"  body={(rowData) => (
                  <>
                    <Button icon="pi pi-trash" onClick={()=>confirmDelete(rowData)} text raised  style={{backgroundColor: 'var(--red-500)', color: 'var(--primary-color-text)', borderRadius: '50%',width:'25px',height:'25px'}} />
                  </>    
                    )}>

                    </Column>
            </DataTable>
    </AccordionTab>
    <AccordionTab style={{backgroundColor: 'var(--green-500)'}}  header={`Ajouter des nouvelles action pour le marché N° ${nummarche}`}>
              <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
              <DataTable showGridlines  
              value={actionPragramme}  size={'small'}
               selection={selected} 
               onSelectionChange={(e) => setSelected(e.value)}
               dataKey="IDaction_programme" tableStyle={{ maxWidth: '70rem',marginLeft:"4rem", paddingLeft:'2rem', borderCollapse: 'collapse', border: '1px solid #ddd' }}  paginator rows={10}>
               <Column selectionMode="multiple" headerStyle={{ width: '1rem',color: 'var(--highlight-text-color)' }}></Column>
                <Column field="action" header="L'INTITULE DE L'ACTION" headerStyle={{ width: '50rem' }} />
                <Column field="composante_mdr" header="COMPOSANTE MADR"  headerStyle={{ width: '50rem' }}/>
                      
            </DataTable>
            </AccordionTab>
</Accordion>
     
  
</div>          
}