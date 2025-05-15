import React, { useState, useEffect,useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { FilterMatchMode} from 'primereact/api';
import { useParams } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import { locale, addLocale } from 'primereact/api';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import {Row} from "reactstrap";
import {getAllActionImpact,DeleteActionImpct,getUserInf} from '../../utils/APIRoutes';
import { useNavigate  } from 'react-router-dom';
import AddActionImpact from "./AddActionImpact";

export default function AllActionImpactee() {
locale('fr');
addLocale('fr', { "startsWith": "Commence par","contains": "Contient","notContains": "Ne contient pas","endsWith": "Se termine par","equals": "Égal à", "notEquals": "Différent de","noFilter": "Aucun filtre","filter": "Filtre", "lt": "Inférieur à", "apply":"Appliquer","clear":"Annuler", "No results found":"Aucun resultat trouvée"});
  const token = localStorage.getItem('token');
  const [actionPragramme, setactionPragramme] = useState([]);
  const [userinf,setuserinf]=useState({})
  const nummarche= useParams().nummarche;
  const toast = useRef(null);
 
  const [filters, setFilters] = useState({
    LOCALITES: { value: null, matchMode: FilterMatchMode.CONTAINS},
    wilaya_name_ascii:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    composante_mdr:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    action:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    commune_name_ascii:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    INSTITUTION_PILOTE:{ value: null, matchMode: FilterMatchMode.CONTAINS},
});

const [addimp,setaddimp]=useState(false)
const id= useParams().idMarche;
const idprog= useParams().idprog;
const type= useParams().type;

const Navigate  = useNavigate ();
useEffect(() => {
  fetch(getUserInf, {
    method: "POST",
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Initialize 'token' before using it
    },
  })
    .then((reponse) => reponse.json())
    .then((data) => {
      setuserinf(data.userinf)
     })
    .catch((error) => {
      console.log("Error:", error);
    });
}, [])
const accept = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmation', detail: 'Suppression réussie.', life: 3000 });
}
const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
}
const confirmDelete = (rowData) => {
  confirmDialog({
    message: (
      <>
        <b>Attention</b>, si vous supprimez l'action {rowData.action} de {rowData.LOCALITES},<br />
        vous risquez de supprimer toutes les informations liées à cette action.
      </>
    ),
      header: `Voulez-vous supprimer l'action ${rowData.action} du marche ${nummarche}`,
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      footer: (props) => {
        const { accept, reject } = props;

        const handleAccept = () => {
          deleteActionImp(rowData.id_action_impactee);
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
function deleteActionImp(id) {
 
          fetch(DeleteActionImpct, {
            method: "POST",
            credentials: 'include',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({id_action_impactee:id}),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data === "true") {

                accept()
                getAllAction()
              } 
              else{
                reject()
              }
            })
            .catch((error) => {
              console.error(error);
            });
          }
function getAllAction() {
   
  fetch(getAllActionImpact, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-cache',
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({id:id})})
    .then((response) => response.json())
    .then((data) => {
        setactionPragramme(data);
     })
    .catch((error) => {
      console.log('Error:', error);
    });
} 
useEffect(() => {
    getAllAction()
  }, []); 
  /***************************** action programme **********************************/
const rightToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">
              <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/marche/${idprog}`)}} style={{  marginRight: '10px'  , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised />
              <Button raised label="Nouvelle action impactée" style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}} icon="pi pi-plus" onClick={()=>setaddimp(true)}/>
        </div>
    );
  };
  
  /****************filter*************************** */
  const AxeBodyTemplate = (rowData) => {
    const INSTITUTION_PILOTE = rowData.INSTITUTION_PILOTE;
    
    return (
    <div className="flex align-items-center gap-2">
          <span>{INSTITUTION_PILOTE}</span>
     </div>
    );
  };
  const ComposanteBodyTemplate = (rowData) => {
    const composante = rowData.composante_mdr
    ;
    
    return (
      <div className="flex align-items-center gap-2">
          <span>{composante}</span>
      </div>
    );
  };
  const actionBodyTemplate = (rowData) => {
    const Action = rowData.action
    ;
    
    return (
      <div className="flex align-items-center gap-2">
          <span>{Action}</span>
      </div>
    );
  };
  const wilayaBodyTemplate = (rowData) => {
    const wilaya = rowData.wilaya_name_ascii
    ; 
    return (
      <div className="flex align-items-center gap-2">
          <span>{wilaya}</span>
      </div>
    );
  };
  function navFunction(rowData) {
    if(type==='Etude')
      {
        Navigate(`/admin/DetailActionImp/${rowData.id_action_impactee}/${idprog}/updateE/${id}/${nummarche}`)
      }
      else
      {
        Navigate(`/admin/DetailActionImp/${rowData.id_action_impactee}/${idprog}/updateR/${id}/${nummarche}`)
      }
    
  }
  return ( 
    <div className ="content mt-3"  >
       <p style={{ fontSize: '20px'}}> Les actions impactée du marché N°{nummarche} </p>
       <ConfirmDialog />
        <Toast ref={toast} />
         {addimp && <AddActionImpact userinf={userinf} addimp={addimp} setaddimp={setaddimp} getAllAction={getAllAction} idmarche={id} typemarche={type} />} 
        <Row> 
            <div className="card" style={{ width: '100%' }}>
              <Toolbar className="mb-1 pl-3 pt-2 pb-2" left={rightToolbarTemplate}></Toolbar>
              {
         actionPragramme.length > 0 &&
         <div  >
            <DataTable filters={filters} filterDisplay="row" globalFilterFields={['AXE', 'composante_mdr', 'action', 'wilaya_name_ascii','commune_name_ascii']} showGridlines  value={actionPragramme} paginator size={'small'}  tableStyle={{  borderCollapse: 'collapse', border: '1px solid #ddd' }} rows={10} dataKey="id_action_impactee" 
             emptyMessage="Aucunne action trouvée." style={{ fontSize: '0.8rem' }} >
                <Column field="INSTITUTION_PILOTE" header="INSTITUTION PILOTE" filter body={AxeBodyTemplate} />
                <Column field="composante_mdr" filter header="COMPOSANTE" body={ComposanteBodyTemplate} />
                <Column field="action" header="ACTION" filter body={actionBodyTemplate}  />
             {userinf.structure==='DGF' &&   <Column field="wilaya_name_ascii" filter header="WILAYA" body={wilayaBodyTemplate}/>} 
                <Column field="commune_name_ascii" filter header="COMMUNE"/>
                <Column field="LOCALITES" filter header="LOCALITES"/>
                <Column  header="ACTION" headerStyle={{ width: '2rem' }} body={(rowData) => (
                  <>
                    <Button icon="pi pi-trash" onClick={()=>confirmDelete(rowData)} text raised  style={{ color: 'var(--red-500)', borderRadius: '50%',width:'25px',height:'25px',marginLeft:"5px"}} />
                    <Button icon="pi pi-eye" onClick={()=>{navFunction(rowData)}} text raised  style={{ color: 'var(--purple-500)', borderRadius: '50%',width:'25px',height:'25px',marginLeft:"5px"}} />
                  </>    
                    )}>
                    </Column>
                    
            </DataTable>
         </div>
       }

               </div>
      </Row>
      

    
    </div>
  );
}