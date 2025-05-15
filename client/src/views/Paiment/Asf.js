import React , {useState,useEffect,useRef} from "react"
import {GetASF,getActionFillter,getMarche,listAttachement,AddASF,getUserInf} from '../../utils/APIRoutes'
import { useNavigate,useParams  } from 'react-router-dom';
import { Button } from 'primereact/button';
import AddAsf from "./AddAsf";
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { FilterMatchMode} from 'primereact/api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import { classNames } from 'primereact/utils';
import DetailAsf from'./DetailAsf'
import DetailDecompt from"./DetailDecompt"
import Situation from "./Situation";
import { locale, addLocale } from 'primereact/api';
export default function Asf() {
const idprog=useParams().idprog
const type=useParams().type
const Navigate  = useNavigate ();
const [addasf,setaddasf]=useState(false)
const [search, setsearch] = useState({});
const [marche, setmarche] = useState([]); 
const [SelectedAtt, setSelectedAtt] = useState([]);
const [SelectedAsf, setSelectedAsf] = useState([]);
const [listeAsf, setlisteAsf] = useState([]);
const [listeAtt, setlisteAtt] = useState([]);
const [submitted, setsubmitted] = useState(false);
const [intAction, setintAction] = useState([]);
const [userinf, setuserinf] = useState([]);
const [idasf,setidasf]=useState([]);
const [detailasf,setdetailasf]=useState(false)
const [detaildecompt,setdetaildecompt]=useState(false)
const [situation,setsituation]=useState(false)
const [filters, setFilters] = useState({
wilaya_name_ascii: { value: null, matchMode: FilterMatchMode.CONTAINS },
num_asf: { value: null, matchMode: FilterMatchMode.CONTAINS }});
  locale('fr');
  addLocale('fr', { "startsWith": "Commence par","contains": "Contient","notContains": "Ne contient pas","endsWith": "Se termine par","equals": "Égal à", "notEquals": "Différent de","noFilter": "Aucun filtre","filter": "Filtre", "lt": "Inférieur à", "apply":"Appliquer","clear":"Annuler", "No results found":"Aucun resultat trouvée"});
    const token = localStorage.getItem('token');
    const onInputChangeSearch = (e, name) => {
    let _search = {...search };
    const val = (e.target && e.target.value) || '';
    _search[`${name}`] = val;
    setsearch(_search);
    };
    function getIntAction(IDMarche) {
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
        body: JSON.stringify({ attachement: 'oui', id: IDMarche })
      })
        .then((response) => response.json())
        .then((data) => {
          setintAction(data);
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    }
    function getUserInfo() {
         fetch(getUserInf, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((reponse) => reponse.json())
            .then((data) => {
           
              setuserinf(data.userinf)
          
             
            });
      
    }
    function getAsfs() {
      if(!search.IDMarche)
      {
        setsubmitted(true)
      }
      else
      {
         fetch(GetASF, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({IDMarche:search.IDMarche}),
          })
            .then((reponse) => reponse.json())
            .then((data) => {
           
                setlisteAsf(data)
          
             
            });
      }
    }
    
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
      body: JSON.stringify({ fillter: "yes", idprog: idprog, type_marche: type })
    })
      .then((response) => response.json())
      .then((data) => {
        setmarche(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }
  function getListAttachement() {
    fetch(listAttachement, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({action:search.action,IDMarche:search.IDMarche,type:"asf"}),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
      
        setlisteAtt(data);
     
      });
  }
  const _addasf = (e) => {
    if(SelectedAtt.length === 0 )
    {
     // showMessage(e, toastTopLeft, "error");
    }else{
        fetch(AddASF, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ selectedattachement: SelectedAtt }),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
            if(data.rep == "true"){
              getAsfs()
              setSelectedAtt([])
              setidasf(data.idAsf)
              setdetailasf(true)
              getListAttachement()
              //getAttachment();
              //setaddasf(false);
            } 
          });
      
 
    }
  };
    useEffect(() => {
        getmarche()
        getUserInfo()
      }, []); 
      const rightToolbarTemplate = (data) => {
        return (
          <>
          <div> <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/Composantrealisation/${idprog}`)}} style={{  marginRight: '3px',marginBottom:'3px'  , background:'var(--red-500)', borderColor:'var(--red-300)'}} raised /></div> 
            <div className="mr-1">
              <Dropdown
                placeholder="Sélectionner le marché"
                options={marche}
                value={search.IDMarche}
                onChange={(e) => { onInputChangeSearch({ target: { value: e.value } }, 'IDMarche'); getIntAction(e.value) }}
                className={`w-full md:w-12rem ${classNames({ 'p-invalid': submitted && !search.IDMarche })}`}
              />
              {submitted && !search.IDMarche && <small className="p-error">Champ obligatoire !</small>}
            </div>
            <div className="">
              <Button
                style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', marginLeft: '5px' }}
                raised rounded onClick={() => {
                  getListAttachement();
                  getAsfs();
                }}>Afficher</Button>
            </div>
          </>
        );
      };
      const confirm2 = (id,num) => {
        confirmDialog({
            message: `Voulez-vous supprimer l'attachement N°${num}`,
            header: 'Confirmation de suppression',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            footer: (props) => {
                const { accept, reject } = props;
      
                const handleAccept = () => {
              
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

      
    return(<div className="content mt-3">
               <ConfirmDialog />
    <p style={{fontSize:"22px"}}>Procédure de paiment</p>
    <Toolbar className="mb-2 mt-3 p-2" left={rightToolbarTemplate()}></Toolbar>
    {addasf && <AddAsf setaddasf={setaddasf} SelectedAtt={SelectedAtt} setSelectedAtt={setSelectedAtt} getAsfs={getAsfs}/> }
    {detailasf && <DetailAsf detailasf ={detailasf} IDMarche={search.IDMarche} setdetailasf={setdetailasf} idasf={idasf} />}
    {detaildecompt && <DetailDecompt detaildecompt ={detaildecompt} IDMarche={search.IDMarche} setdetaildecompt={setdetaildecompt} idasf={idasf}/>} 
    {situation && <Situation idasf={idasf} IDMarche={search.IDMarche} setsituation={setsituation}/>}
       <Accordion multiple activeIndex={[0,1]} style={{ color: "#fff", marginTop: "1rem" }}>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="La liste des attachements">
        {listeAtt.length>0 &&
          <div className="col-12 p-0">
            <Button
              label="Créer l'ASF + Decompte"
              icon="pi pi-check"
              style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)' }}
              onClick={() => {
                _addasf()   
              }}
            />
     
                 <DataTable
                 emptyMessage="Aucun attachement trouvé"
                 paginator
                 showGridlines
                 rows={10}
                 size={'small'}
                 value={listeAtt}
                 selection={SelectedAtt}
                 onSelectionChange={(e) => setSelectedAtt(e.value)}
                 dataKey="id_attachement"
                 style={{ padding:'10px' ,fontSize: '0.8rem'}}
               >
                 <Column
                   selectionMode="multiple"
                   headerStyle={{ width: "1rem" }}     style={{ padding:'5px' }}   
                 ></Column>
                 <Column
                        field="action"   headerStyle={{ width: "1rem" }}
                        header="Action"
                      ></Column>   
                      <Column
                        field="num_attachement"
                        header="Numero"
                        headerStyle={{ width: "1rem" }}
                      ></Column>
           
                      <Column
                        field="wilaya_name_ascii"
                        header="wilaya"   headerStyle={{ width: "1rem" }}
                      ></Column>
    <Column
     header="Commune / Localites"   headerStyle={{ width: "1rem" }}
     body={(rowData) => (
       <>
        {rowData.liste.map((item, index) => (
           <span key={index}>
             <p style={{ display: 'inline-block', marginRight: '5px' }}>{item.commune_name_ascii}:</p>
             {item.LOCALITES.map((locality, index) => (
               <span key={index} style={{ display: 'inline-block', marginRight: '5px', fontSize:'14px',padding:'0px',paddingBottom:'0px' }}>{locality},</span>
             ))}
             <br />
           </span>
         ))} 
       </>
     )}
   />
               </DataTable>
      
       
            <br />
          </div>
                   }
        </AccordionTab>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="La liste des attestation service fait">
        <Button
              disabled={SelectedAsf.length==0}
              label="Paiment"
              icon="pi pi-check"
              style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)' }}
              onClick={() => {
                  
              }}
            />
       {listeAsf.length>0 &&
        <DataTable
        emptyMessage="Aucune ASF trouvée"
        paginator
        showGridlines  filters={filters} filterDisplay="row"
        rows={10}
        size={'small'}
        value={listeAsf}
        selection={SelectedAsf}
        onSelectionChange={(e) => setSelectedAsf(e.value)}
        dataKey="id_asf"
        style={{ padding:'10px' ,fontSize: '0.8rem'}}
      >
               <Column
        selectionMode="multiple"
        headerStyle={{ width: "1rem" }} style={{ padding:'5px' }}   
         ></Column> 
       {userinf.structure=="DGF" && <Column filter filterPlaceholder="Recherche par wilaya" style={{ minWidth: '5rem' }} field="wilaya_name_ascii"  header="Wilaya" ></Column>}  
 
        <Column field="num_asf"  filter filterPlaceholder="Recherche par numéro" header="Numero de l'attestation service fait" ></Column>   
        <Column header=" Attestation service fait" body={(rowData) => (<>
       <button onClick={()=>{ setidasf(rowData.id_asf); setdetailasf(true)}}
        style={{ fontSize: '1.1rem',margin:"3px", backgroundColor: 'var(--purple-400)',color:"#fff",borderRadius:"40%",border:"none" }}>
       <i className="pi pi-eye" style={{ fontSize: '01rem'}}></i>
  </button>  

  </>
  )}
/> 
<Column
   header="Decompte provisoire"
  body={(rowData) => (
  <>
  <button onClick={()=>{ setidasf(rowData.id_asf); setdetaildecompt(true)}}
  style={{ fontSize: '1.1rem',margin:"3px", backgroundColor: 'var(--green-400)',color:"#fff",borderRadius:"40%",border:"none" }}>
    <i className="pi pi-eye" style={{ fontSize: '01rem'}}></i>
  </button> 

  </>
  )}
/> 
  <Column
   header="Situation"
  body={(rowData) => (
  <>

  <button onClick={()=>{ setidasf(rowData.id_asf); setsituation(true)}}
  style={{ fontSize: '1.1rem',margin:"3px", backgroundColor: 'var(--orange-400)',color:"#fff",borderRadius:"40%",border:"none" }}>
    <i className="pi pi-eye" style={{ fontSize: '01rem'}}></i>

  </button> 

  </>
  )}
/> 
      </DataTable>}
        </AccordionTab>
      </Accordion>
      

    </div>)
  
}