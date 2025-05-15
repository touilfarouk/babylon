import React, { useState, useEffect, useRef } from "react";
import { listAttachement,DeleteAttachement,getWilaya,getActionProgramme,getEntrepriseRealisation } from "../../utils/APIRoutes";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Toolbar } from "primereact/toolbar";
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import AttachementDetails from "./AttachementDetails";
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { locale, addLocale } from 'primereact/api';
import "./table.css"
import { FilterMatchMode} from 'primereact/api';
function Listattachement(props) {
  const toastTopCenter = useRef(null);
  locale('fr');
  addLocale('fr', { "startsWith": "Commence par","contains": "Contient","notContains": "Ne contient pas","endsWith": "Se termine par","equals": "Égal à", "notEquals": "Différent de","noFilter": "Aucun filtre","filter": "Filtre", "lt": "Inférieur à", "apply":"Appliquer","clear":"Annuler", "No results found":"Aucun resultat trouvée"});
  const [attachement,setattachement] = useState([]);
  const [detailattachement,setdetailattachement] = useState(false);
  const [Idattachement,setIdattachement] = useState(0);
  const [wilaya,setwilaya]=useState([]);
  const [search,setsearch]=useState({wilaya:'',action:''})
  const [submittedIm, setSubmittedIm] = useState(false);
  const [intAction,setintAction]=useState([])
  const [EntreprisesList, setEntreprisesList] = useState([]);
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState({

    wilaya_name_ascii:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    action:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    commune_name_ascii:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    libelle:{ value: null, matchMode: FilterMatchMode.CONTAINS},
});

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
      body: JSON.stringify(search)})
   
      .then((response) => response.json())
      .then((data) => {
        //const wil = data.map(wilaya => wilaya.label);
        setwilaya(data);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
  } 


  
  function getIntAction() {
    fetch(getActionProgramme, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({idmarche:props.search.IDMarche})})
      .then((response) => response.json())
      .then((data) => {
        setintAction(data);
       })
      .catch((error) => {
        console.log('Error:', error);
      });
  } 


  function getAllEntreprise() {
    fetch(getEntrepriseRealisation, {
       method: "POST",
       credentials: "include",
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`, 
       },
       body: JSON.stringify({idmarche:props.search.IDMarche})})

       .then((reponse) => reponse.json())
       .then((data) => {
        const transformedData = data.map(item => ({
          value: String(item.ID_entreprise).padStart(2, '0'), // Format ID_entreprise with leading zeros
          label: item.libelle
      }));
        setEntreprisesList(transformedData);
       })
       .catch((error) => {
         console.log("Error:", error);
       });
   }

  // useEffect(() => {
      
  //   getListWilaya();
  //   getIntAction();
  //   getAllEntreprise();
  // }, []);
  const confirm2 = (id,num) => {
    confirmDialog({
        message: `Voulez-vous supprimer l'attachement N°${num}`,
        header: 'Confirmation de suppression',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        footer: (props) => {
            const { accept, reject } = props;
  
            const handleAccept = () => {
              deleteAttachement(id);
                accept();
            };
            const handlereject = () => {
                reject();
            };
  
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ backgroundColor: "var(--red-500)", color: 'var(--primary-color-text)', borderColor: 'var(--red-400)', borderRadius: 'var(--border-radius)' }} label="Annuler" icon="pi pi-times" className="mr-2" onClick={handlereject} />
              <Button style={{ backgroundColor: 'var(--purple-400)', color: 'var(--primary-color-text)', borderRadius: 'var(--border-radius)' }} label="Confirmer" icon="pi pi-check" className="p-button-text" onClick={handleAccept} />
            </div>
            );
        },
    });
  };
  function getListAttachement() {
    fetch(listAttachement, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({action:props.search.action,IDMarche:props.search.IDMarche,type:"all"}),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
      
        setattachement(data);
     
      });
  }

  function deleteAttachement(id_attachement) {
    fetch(DeleteAttachement, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id_attachement:id_attachement}),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        if(data=="true")
        {getListAttachement()}
      else{showMessage(toastTopCenter,"Erreur est survenu l'attachement n'a pas été supprimé");}
      });
  }
  const showMessage = (ref,msg) => {

    ref.current.show({severity: 'error',  summary: 'info', detail: msg, life: 7000 });
  };
  useEffect(() => {
    getListAttachement();
  }, [search]);
  const valiationBody = (option) => {
   
    return (
      <>
       &nbsp;
       { option.valider_attchement===1 ? <Tag style={{backgroundColor: 'var(--cyan-500)'}} >Validé</Tag>:<Tag style={{backgroundColor: 'var(--orange-700)'}} >Non validé</Tag>}
      </>
    );
 
  }

  const onInputChangeIm = (e, name) => {
    let _search = { ... search };
    const val = (e.target && e.target.value) || '';
    _search[`${name}`] = val;
    setsearch(_search);
  
  };


  const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2 ">
       
         <Dropdown options={wilaya} optionLabel="label" 
     value={search.wilaya}
     placeholder="Filltrer par wilaya" className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.wilaya })}`}
     onChange={ (e) => {
       onInputChangeIm({ target: { value: e.value } }, 'wilaya');

  }}
     style={{  marginTop: '5px' }} 
     />
          <br/>
     {submittedIm && !search.wilaya && <small className="p-error">Champ obligatoire !</small>}
   
         <Dropdown  style={{  marginTop: '5px' }} 
     value={search.action}
     options={intAction} optionLabel="action" 
     onChange={(e) => { onInputChangeIm({ target: { value: e.value } }, 'action');}}
     placeholder="Filltrer par action" className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.action })}`} />
            <br/>
        {submittedIm && !search.action && <small className="p-error">Champ obligatoire !</small>}

        <Dropdown  style={{  marginTop: '5px' }} 
     value={search.entreprise}
     options={EntreprisesList} optionLabel="label" 
     onChange={(e) => { onInputChangeIm({ target: { value: e.value } }, 'entreprise');}}
     placeholder="Filltrer par entreprise" className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.action })}`} />
            <br/>
        {submittedIm && !search.action && <small className="p-error">Champ obligatoire !</small>}
   
       
          
   
       
        </div>
    );
  };



  return (<>
    <Toast ref={toastTopCenter} position="top-center" />
  
           <ConfirmDialog />
           {/* <Toolbar className="mb-2 p-2" left={leftToolbarTemplate}></Toolbar> */}
       {detailattachement && <AttachementDetails  getListAttachement={getListAttachement} detail={"list"} id_attachement={Idattachement} setIdattachement={setIdattachement} setDetailAttachment={setdetailattachement}/>}
      <DataTable filters={filters} filterDisplay="row" globalFilterFields={[ 'action', 'wilaya_name_ascii','commune_name_ascii','bv_entreprise_realisation']} showGridlines  rowGroupMode="rowspan" groupRowsBy="wilaya" style={{ fontSize: '0.8rem',paddingTop:"20px" }} value={attachement} size="small"  emptyMessage="Aucun attachement trouvé." >
              
      <Column        filter
                     field="action"
                     header="Action"
                   ></Column>   
                   <Column
                     field="num_attachement"
                     header="Numero"
                   ></Column>
        
                   <Column filter
                     field="wilaya_name_ascii"
                     header="wilaya"
                   ></Column>
                     <Column filter
                     field="libelle"
                     header="Entreprise"
                   ></Column>
 <Column 
  header="Commune / Localites"
  body={(rowData) => (
    <>
     {rowData.liste.map((item, index) => (
        <span key={index}>
          <p style={{ display: 'inline-block', marginRight: '5px' }}>{item.commune_name_ascii}:</p>
          {item.LOCALITES.map((locality, index) => (
            <span key={index} style={{ display: 'inline-block', marginRight: '5px' }}>{locality},</span>
          ))}
          <br />
        </span>
      ))} 
    </>
  )}
/>
                    
                   <Column
                     field="valider_attchement"
                     body={valiationBody}
                     header="Validation"
                    ></Column>
                      <Column
         header="Action"
        body={(rowData) => (
        <>
            <button onClick={()=>{setdetailattachement(true);setIdattachement(rowData.id_attachement);}}
        style={{ fontSize: '1.1rem',margin:"3px", backgroundColor: 'var(--purple-400)',color:"#fff",borderRadius:"40%",border:"none" }}>
          <i className="pi pi-eye" style={{ fontSize: '01rem'}}></i>
      
        </button>  
          <button onClick={()=>{confirm2(rowData.id_attachement)}}
        style={{ fontSize: '1.1rem', backgroundColor: 'var(--red-600)',color:"#fff",borderRadius:"40%",border:"none" }}>
          <i className="pi pi-trash" style={{ fontSize: '01rem'}}></i>
      
        </button>
        </>
        )}
      /> 
       </DataTable>      
 
  </>
 
  );
}

export default Listattachement;
