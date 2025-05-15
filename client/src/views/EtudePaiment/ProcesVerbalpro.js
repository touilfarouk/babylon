import React, { useState, useEffect, useRef } from "react";
import { addAttachement, getMarche, getUserInf,getEtude,addPvProvetude,getPvProvesoire} from "../../utils/APIRoutes";
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { classNames } from 'primereact/utils';
import { Accordion, AccordionTab } from 'primereact/accordion';
import DetailProcesVerbal from "./DetailProcesVerbal";
import { locale, addLocale } from 'primereact/api';
import { FilterMatchMode} from 'primereact/api';
function ProcesVerbalpro() {
  const token = localStorage.getItem("token");
  const idprog = useParams().idprog;
  const type = useParams().type;
  const [selectedetude, setselectedetude] = useState([])
  const [marche, setmarche] = useState([]);
  const [marcheid, setmarcheid] = useState(0);
  locale('fr');
  addLocale('fr', { "startsWith": "Commence par","contains": "Contient","notContains": "Ne contient pas","endsWith": "Se termine par","equals": "Égal à", "notEquals": "Différent de","noFilter": "Aucun filtre","filter": "Filtre", "lt": "Inférieur à", "apply":"Appliquer","clear":"Annuler", "No results found":"Aucun resultat trouvée"});
  const [submitted, setsubmitted] = useState(false);
  const [listeEtude, setlisteEtude] = useState([]);
  const [listpvpro, setlistpvpro] = useState([]);
  const Navigate = useNavigate();
  const [userinf, setuserinf] = useState({});

  const[id_pv_pro,setid_pv_pro]=useState("")   
  const[detailpv,setdetailpv]=useState(false)

  const [filters, setFilters] = useState({

    wilaya_name_ascii:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    action:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    num_pv:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    libelle:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    INSTITUTION_PILOTE:{ value: null, matchMode: FilterMatchMode.CONTAINS},
});
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
  }, []);


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


  
  function  getEtudes() {
    fetch(getEtude, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({IDMarche:marcheid})
    })
      .then((response) => response.json())
      .then((data) => {
        setlisteEtude(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }
    
  function  getPvProv() {
    fetch(getPvProvesoire, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-cache',
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({IDMarche:marcheid})
    })
      .then((response) => response.json())
      .then((data) => {
        setlistpvpro(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  useEffect(() => {
    getmarche();
    
  }, []);

  const showMessage = (event, ref, severity,msg) => {

    ref.current.show({
      severity: event,
      summary: severity,
      detail: msg,
      life: 5000,
    });
  };

  const toastTopLeft = useRef(null);
  const _addPvProv = (e) => {
    if (selectedetude.length === 0) {
      showMessage('warn', toastTopLeft, "Erreur","Selectionner une ou plusieurs études!");
    } else {
      fetch(addPvProvetude, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedetude:selectedetude}),
      })
        .then((reponse) => reponse.json())
        .then((data) => {
          if (data === "true") {
            setselectedetude([])
            getEtudes()
           showMessage('success', toastTopLeft, "succès","PV provisoire a été ajouté avec succès");
          }
        });
    }
  };

  const onInputChangeSearch = (e, name) => {
    const val = (e.target && e.target.value) || '';
    setmarcheid(val);
  };

  const rightToolbarTemplate = (data) => {
    return (
      <>
      <div> <Button icon="pi pi-arrow-left" label ="Retour" onClick={()=>{Navigate(`/admin/ComposantEtude/${idprog}`)}} style={{  marginRight: '5px',marginBottom:'5px'  , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised /></div> 
        <div className="mr-1">
        
          <Dropdown
            placeholder="Sélectionner le marché"
            options={marche}
            value={marcheid}
            onChange={(e) => { onInputChangeSearch({ target: { value: e.value } }, 'IDMarche');}}
            className={`w-full md:w-12rem ${classNames({ 'p-invalid': submitted && !marcheid })}`}
          />
          {submitted && !marcheid && <small className="p-error">Champ obligatoire !</small>}
        </div>

        <div className="">
          <Button
            style={{ backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)', marginLeft: '5px' }}
            raised rounded onClick={() => {
                getEtudes();getPvProv();
            }}>Afficher</Button>
        </div>
      </>
    );
  };
  const prepareRowSpanData = (data) => {
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.id_pv_pro]) {
            acc[item.id_pv_pro] = [];
        }
        acc[item.id_pv_pro].push(item);
        return acc;
    }, {});
    
    return Object.values(groupedData).flat();
};
const preparedData = prepareRowSpanData(listpvpro);

const rowSpanTemplate = (rowData, column) => {
    const group = preparedData.filter(item => item.id_pv_pro === rowData.id_pv_pro);
    const rowIndex = group.indexOf(rowData);

    if (rowIndex === 0) {
        return {
            rowSpan: group.length,
            value: rowData[column]
        };
    }

    return null;
};
  const EtudeFunction = (rowData) => {

    let content;
        switch (rowData.type_etude) {
            case 5:
                content = <span>Préliminaire</span>;
                break;
            case 2:
                content = <span>Faisabilité</span>;
                break;
            case 3:
                content = <span>Exécution</span>;
                break;
            default:
                content = <span>Aucun</span>;
                break;
        }
        return content;
};



  return (
    <div className="content mt-3">
      {detailpv && <DetailProcesVerbal id_pv_pro={id_pv_pro} setdetailpv={setdetailpv} marcheid={marcheid}/>}
      <p style={{ fontSize: '20px' }}>Procès Verbal</p>
      <Toolbar className="mb-2 mt-3 p-2" left={rightToolbarTemplate()}></Toolbar>
      <Accordion multiple activeIndex={[0,1]} style={{ color: "#fff", marginTop: "1rem" }}>
        <AccordionTab style={{ backgroundColor:'var(--green-400)' }} header="La liste des études réalisées">
       
          <div className="col-12 p-0">
            <Button
              label="Crée un procès verbal de récéption provisoire"
              icon="pi pi-check"
              style={{ backgroundColor:'var(--green-400)',borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)' ,marginBottom:'10px'}}
              onClick={() => {
                _addPvProv()
              }}
            />
            <DataTable
              emptyMessage="Aucune étude trouvée"
              paginator
              rows={10}
              size={'small'}
              value={listeEtude}
              selection={selectedetude}
              onSelectionChange={(e) => setselectedetude(e.value)}
              dataKey="id_etude"
            >
              < Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>
              <Column field="action" header="ACTION"></Column>
              <Column header="Etude" body={EtudeFunction}></Column>
              <Column field="wilaya_name_ascii" header="Wilaya" />
              <Column field="commune_name_ascii" header="Commune"></Column>
              <Column field="LOCALITES" header="Localites"></Column>
              <Column field="VOLUME_VALIDE" header="Volume valide" />
              <Column field="UNITE" header="Unite" />
            </DataTable>
            <br />
          </div>
        </AccordionTab>
        <AccordionTab style={{ backgroundColor: 'var(--green-400)' }} header="La liste des procès verbal de récéption provisoire">
        <DataTable
            value={preparedData}
            emptyMessage="Aucune étude trouvée"
            paginator
            rows={10}
            size="small"
            dataKey="id_pv_pro"
            filters={filters} filterDisplay="row" globalFilterFields={[ 'action', 'wilaya_name_ascii','commune_name_ascii','bv_entreprise_realisation']} showGridlines
        >
      <Column  filter
                field="num_pv"
                header="Numero de PV"
               
            />

            <Column  filter
                field="action"
                header="Action"
                body={(rowData) => rowSpanTemplate(rowData, 'action') ? rowSpanTemplate(rowData, 'action').value : ''}
                rowSpan={(rowData) => rowSpanTemplate(rowData, 'action') ? rowSpanTemplate(rowData, 'action').rowSpan : null}
            />
       
            <Column  filter
                field="wilaya_name_ascii"
                header="Wilaya"
                body={(rowData) => rowSpanTemplate(rowData, 'wilaya_name_ascii') ? rowSpanTemplate(rowData, 'wilaya_name_ascii').value : ''}
                rowSpan={(rowData) => rowSpanTemplate(rowData, 'wilaya_name_ascii') ? rowSpanTemplate(rowData, 'wilaya_name_ascii').rowSpan : null}
            />

            <Column filter
                field="libelle"
                header="Bureau d'etude" 
            />

            <Column filter
                field="INSTITUTION_PILOTE"
                header="Institution pilote"
            />
            
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
         header="Voir"
        body={(rowData) => (
        <>
            <button onClick={()=>{setid_pv_pro(rowData.id_pv_pro);setdetailpv(true);}}
            style={{ fontSize: '1.1rem',margin:"3px", backgroundColor: 'var(--green-500)',color:"#fff",borderRadius:"40%",border:"none" }}>
            <i className="pi pi-eye" style={{ fontSize: '01rem'}}></i>
      
        </button>  
          {/* <button onClick={()=>{}}
        style={{ fontSize: '1.1rem', backgroundColor: 'var(--red-600)',color:"#fff",borderRadius:"40%",border:"none" }}>
          <i className="pi pi-trash" style={{ fontSize: '01rem'}}></i>
      
        </button> */}
        </>
        )}
      /> 
        </DataTable>
        </AccordionTab>
        {/* <AccordionTab style={{ backgroundColor: 'var(--cyan-800)' }} header="La liste des procès verbal de récéption définitive ">
        
        </AccordionTab> */}
      </Accordion>
      <Toast ref={toastTopLeft} position="top-center"  />
    </div>
  );
}
export default ProcesVerbalpro;
