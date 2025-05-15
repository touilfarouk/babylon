import React, { useState, useEffect,useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { Card } from 'primereact/card';
import { useParams,useLocation  } from 'react-router-dom';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import { locale, addLocale } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import {Row} from "reactstrap"; 
import { Image } from 'primereact/image';
import {getAllActionImpact,getMarche,getActionFillter,getWilayaFiltter,getCommuneFiltter,getComposante} from '../../utils/APIRoutes';
import { useNavigate  } from 'react-router-dom';
import pl from "./image/plantation.jpg"
import fora from "./image/forage.jpg"
import ouverture from "./image/ouverture.jpg"
import brise from "./image/brise.jpg"
import concervation from "./image/conservation.jpg"
export default function ActionImpcatee() {
    locale('fr');
addLocale('fr', { "startsWith": "Commence par","contains": "Contient","notContains": "Ne contient pas","endsWith": "Se termine par","equals": "Égal à", "notEquals": "Différent de","noFilter": "Aucun filtre","filter": "Filtre", "lt": "Inférieur à", "apply":"Appliquer","clear":"Annuler", "No results found":"Aucun resultat trouvée"});
  const token = localStorage.getItem('token');
  const [actionPragramme, setactionPragramme] = useState([]);
  const Axe=['EXTENSION DU BARRAGE VERT','DEVELOPPEMENT DU BARRAGE VERT','REHABILITATION DU BARRAGE VERT'];
  const [intAction,setintAction]=useState([])
  const [wilaya,setwilaya]=useState([]);
  const [commune,setcommune]=useState([]);
  const [marche,setmarche]=useState([]);
  const [Composante,setComposante]=useState([])
  const [filters, setFilters] = useState({
    LOCALITES: { value: null, matchMode: FilterMatchMode.CONTAINS},
});
const [loading, setLoading] = useState(false);
const [search,setsearch]=useState({commune:'',wilaya:'',action:'',Composante:'',IDMarche:''})
const [submittedIm, setSubmittedIm] = useState(false);
const Navigate  = useNavigate ();

const navigateWithObject = (rowData) => {
  Navigate(`/admin/DetailActionImp/${rowData.id_action_impactee}/${id}/real/1/1`, { state: { objectData: actionPragramme} });
};
const navigateWithObjectEtude = (rowData) => {
  Navigate(`/admin/DetailEtude/${rowData.id_action_impactee}/${id}`, { state: { objectData: actionPragramme} });
};
const location = useLocation();
const objectData = location.state?.objectData;
useEffect(() => {
  if (objectData) {
    setactionPragramme(objectData);
  }
}, [objectData]); 
  /***************************** action programme **********************************/
const id= useParams().idprog;
const type=useParams().type;
function getmarche() {
  fetch(getMarche, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-cache',
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({fillter:"yes",idprog:id,type_marche:type})})
    .then((response) => response.json())
    .then((data) => {
      setmarche(data);
     })
    .catch((error) => {
      console.log('Error:', error);
    });
}
function getcomposante(axe) {
  
  fetch(getComposante, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-cache',
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({Axe:axe,id:search.IDMarche})})
    .then((response) => response.json())
    .then((data) => {     
        setComposante(data);
     })
    .catch((error) => {
      console.log('Error:', error);
    });
}
  function getAllAction (search) {
   
    
    if((!search.Axe || !search.Composante || !search.action || !search.commune || !search.wilaya ) && !objectData )
    {
      setSubmittedIm(true)
    }
    else{
    
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
    body: JSON.stringify({id:search.IDMarche,search_obj:search})})
    .then((response) => response.json())
    .then((data) => {
        setactionPragramme(data);
        console.log("search :",data)
     })
    .catch((error) => {
      console.log('Error:', error);
    });}
} 
function getIntAction(com) {
  setwilaya([]);
  fetch(getActionFillter, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-cache',
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({composante:com,id:search.IDMarche})})
    .then((response) => response.json())
    .then((data) => {
      setintAction(data);
     })
    .catch((error) => {
      console.log('Error:', error);
    });
}  
function getListWilaya() {
  fetch(getWilayaFiltter, {
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
function getListCommune() {
  fetch(getCommuneFiltter, {
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
      setcommune(data);
     })
    .catch((error) => {
      console.log('Error:', error);
    });
} 

const onInputChangeIm = (e, name) => {
  let _search = { ... search };
  const val = (e.target && e.target.value) || '';
  _search[`${name}`] = val;
  setsearch(_search);

};
useEffect(() => {
  if(search.action)
  {
    getListWilaya()
  }
  if(search.wilaya)
  {
    getListCommune()
  }
}, [search]); 


useEffect(() => {

  getmarche();
  // Load initial data or perform actions based on other dependencies here
}, []); 

  const leftToolbarTemplate = () => {
    return (   
   <>
   {/* <Button style={{ backgroundColor: 'var(--yellow-600)',borderColor:'var(--yellow-700)' , borderRadius: 'var(--border-radius)',padding:'5px'}} raised onClick={()=>getAllAction()}>Attestation de service fait</Button> */}
   </>
     
    );
  };
  /****************filter*************************** */
  const AxeBodyTemplate = (rowData) => {
    const Axe = rowData.AXE;
    
    return (
    <div className="flex align-items-center gap-2">
          <span>{Axe}</span>
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
  return ( 
    <div className ="content mt-3"  >
      {type=="etude"?<p style={{  fontSize: '20px'}} >Suivi des études</p>:<p style={{  fontSize: '20px'}} >Suivi des réalisations</p>}
        <Row> 
            <div>
            <div className="flex flex-wrap mt-2 w-full">
           <div> <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{type=="etude"? Navigate(`/admin/ComposantEtude/${id}`): Navigate(`/admin/Composantrealisation/${id}`)}} style={{  marginRight: '5px',marginBottom:'5px' , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised /></div> 
            <div className="mr-1">
         <Dropdown
          options={marche} 
          value={search.IDMarche}
          placeholder="Marché" 
          onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'IDMarche')}} 
          className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.IDMarche  })}`}
          style={{  marginTop: '5px' }} 
         />
         {submittedIm && !search.IDMarche && <small className="p-error">Champ obligatoire !</small>}
         </div>
         <div className="mr-1">
         <Dropdown options={Axe} 
          value={search.Axe}
          placeholder="Axe" 
          onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'Axe');getcomposante(e.value)}} 
          className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.Axe })}`}
          style={{  marginTop: '5px' }} 
         />
   
         {submittedIm && !search.Axe && <small className="p-error">Champ obligatoire !</small>}
         </div>
         <div className="mr-1">
         <Dropdown options={Composante}   style={{  marginTop: '5px' }} 
         value={search.Composante}
         placeholder="Composante"  className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.Composante })}`}
         onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'Composante');getIntAction(e.value)}}/>
         <br/>
        {submittedIm && !search.Composante && <small className="p-error">Champ obligatoire !</small>}
         </div> 
    
       <div className="mr-1" >
       <Dropdown  style={{  marginTop: '5px' }} 
         value={search.action}
         options={intAction} optionLabel="action" 
         onChange={(e) => { onInputChangeIm({ target: { value: e.value } }, 'action');}}
         placeholder="Action" className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.action })}`} />
                <br/>
            {submittedIm && !search.action && <small className="p-error">Champ obligatoire !</small>}
       </div>
        <div className="mr-1">

        <Dropdown options={wilaya} optionLabel="label" 
         value={search.wilaya}
         placeholder="Wilaya" className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.wilaya })}`}
         onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'wilaya')}}
         style={{  marginTop: '5px' }} 
         />
              <br/>
         {submittedIm && !search.wilaya && <small className="p-error">Champ obligatoire !</small>}
        </div>
    <div>
    <Dropdown options={commune} optionLabel="label"   style={{  marginTop: '5px' }} 
            value={search.commune}
          placeholder="Commune" 
          onChange={(e) => {onInputChangeIm({ target: { value: e.value } }, 'commune')}}
          className={`w-full md:w-12rem ${classNames({ 'p-invalid': submittedIm && !search.commune })}`}/>
               <br/>
            {submittedIm && !search.commune && <small className="p-error">Champ obligatoire !</small>}
    </div>
  
    <div classeName="" >
            <Button style={{ backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)',marginLeft:'5px'}} raised rounded onClick={()=>getAllAction(search)}>Afficher</Button>
         </div>
      
         </div>
   
              {
         actionPragramme.length > 0 &&
         <>
                    {/* <Toolbar className="mt-3 mb-3" left={leftToolbarTemplate}></Toolbar> */}
            <DataTable  value={actionPragramme} paginator size={'small'} rows={15} dataKey="id_action_impactee" filters={filters}  
              filterDisplay="row" loading={loading}
             emptyMessage="Aucunne action trouvée." style={{ fontSize: '0.9rem' }} >
                <Column field="AXE" header="AXE" body={AxeBodyTemplate} />
                <Column field="composante_mdr" header="COMPOSANTE" body={ComposanteBodyTemplate} />
                <Column field="action" header="ACTION" body={actionBodyTemplate}  />
                <Column field="wilaya_name_ascii" header="WILAYA" body={wilayaBodyTemplate}/>
                <Column field="commune_name_ascii" header="COMMUNE"/>
                <Column field="LOCALITES" header="LOCALITES"  />
              
                <Column
                   header="Actions"
                   body={(rowData) => (
        
                    <button
                    
                    style={{
                      fontSize: '1.5rem',
                      backgroundColor: 'var(--green-400)',
                      borderRadius: '40%',
                      border: 'none',
                    }}
                    onClick={() => {
                      type === 'realisation'
                        ? navigateWithObject(rowData)
                        : navigateWithObjectEtude(rowData);
                    }}
                  >
          <i className="pi pi-eye" style={{ fontSize: '1rem',color:"#fff", backgroundColor: 'var(--green-400)',borderColor:'var(--green-400)' ,}}></i>
        </button>
  
        )}
      />
            </DataTable>
         </>
       }

               </div>
      </Row>
           {   actionPragramme.length ==0 && 
            <>
               <div style={{ display: 'flex' ,marginTop:'15px'}}>
            <Card> 
            <Image src={pl} alt="" width="280" height="200" />  
            </Card>

             <Card> 
             <Image src={fora} alt="" width="280" height="200" />  
             </Card>

             <Card> 
             <Image src={ouverture} alt=""width="280" height="200"/>  
             </Card>
             <Card> 
             <Image src={concervation} alt=""width="280" height="200"/>  
             </Card>
            </div>
            <div style={{ display: 'flex' }}>
            <Card> 
            <Image src={concervation} alt="" width="280" height="200" />  
            </Card>

             <Card> 
             <Image src={ouverture} alt="" width="280" height="200" />  
             </Card>

             <Card> 
             <Image src={brise} alt=""width="280" height="200"/>  
             </Card>
             <Card> 
             <Image src={pl} alt=""width="280" height="200"/>  
             </Card>
            </div>
            </>
         
            
            }

    
    </div>
  );
}