import React, { useState, useEffect, useRef } from "react";
import { getMarche, getUserInf,addSituation,getSituationEtude,getEtudePaiment} from "../../utils/APIRoutes";
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
import Decompt from"./Decompt"
import DetailSituation from "./DetailSituation";
import { locale, addLocale } from 'primereact/api';
import { FilterMatchMode} from 'primereact/api';
function DecomptSituation() {
  const token = localStorage.getItem("token");
  const idprog = useParams().idprog;
  const type = useParams().type;
  const [selectedetude, setselectedetude] = useState([])
  const [marche, setmarche] = useState([]);
  const [marcheid, setmarcheid] = useState(0);
  const [submitted, setsubmitted] = useState(false);
  const [listeEtude, setlisteEtude] = useState([]);
  const [listSit, setlistSit] = useState([]);
  const [idSit, setidSit] = useState(null);
  const [showDecompt,setshowDecompt]=useState(false)
  const [showSituation,setshowSituation]=useState(false)
  const Navigate = useNavigate();
  const [userinf, setuserinf] = useState({});
  const[id_pv_pro,setid_pv_pro]=useState("")
  const[detailpv,setdetailpv]=useState(false)
  
  locale('fr');
  addLocale('fr', { "startsWith": "Commence par","contains": "Contient","notContains": "Ne contient pas","endsWith": "Se termine par","equals": "Égal à", "notEquals": "Différent de","noFilter": "Aucun filtre","filter": "Filtre", "lt": "Inférieur à", "apply":"Appliquer","clear":"Annuler", "No results found":"Aucun resultat trouvée"});
  
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
    fetch(getEtudePaiment, {
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
    
  function  getSituation() {
    fetch(getSituationEtude, {
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
        setlistSit(data);
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
      severity: severity,
      summary: severity,
      detail: msg,
      life: 5000,
    });
  };

  const toastTopLeft = useRef(null);
  const _addsituation = (e) => {
    if (selectedetude.length === 0) {
      showMessage(e, toastTopLeft, "Erreur","Selectionner une ou plusieurs études!");
    } else {
      fetch(addSituation, {
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
           showMessage(e, toastTopLeft, "succès","Situation a été ajouté avec succès");
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
      <div> <Button icon="pi pi-arrow-left"  label="Retour"onClick={()=>{Navigate(`/admin/ComposantEtude/${idprog}`)}} style={{  marginRight: '5px',marginBottom:'5px' , background:'var(--red-400)', borderColor:'var(--red-400)'}} raised /></div> 
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
                getEtudes();getSituation();
            }}>Afficher</Button>
        </div>
      </>
    );
  };
  const prepareRowSpanData = (data) => {
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.id_sit]) {
            acc[item.id_sit] = [];
        }
        acc[item.id_sit].push(item);
        return acc;
    }, {});
    
    return Object.values(groupedData).flat();
};
const preparedData = prepareRowSpanData(listSit);

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
      {showDecompt && <Decompt id_sit={idSit} IDMarche={marcheid} showDecompt={showDecompt} setshowDecompt={setshowDecompt}/>}
      {showSituation && <DetailSituation id_sit={idSit} IDMarche={marcheid} showSituation={showSituation} setshowSituation={setshowSituation} />}
      <p style={{ fontSize: '20px' }}>Procedure de paiment</p>
      <Toolbar className="mb-2 mt-3 p-2" left={rightToolbarTemplate()}></Toolbar>
      <Accordion multiple activeIndex={[0,1]} style={{ color: "#fff", marginTop: "1rem" }}>
        <AccordionTab style={{ backgroundColor:'var(--green-400)' }} header="La liste des études réalisées">
       
          <div className="col-12 p-0">
            <Button
              label="Procedure de paiment"
              icon="pi pi-check"
              style={{ backgroundColor:'var(--green-400)',borderColor: 'var(--green-400)', borderRadius: 'var(--border-radius)' ,marginBottom:'10px'}}
              onClick={() => {
                _addsituation()
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
              <Column  field="action" header="ACTION"></Column>
              <Column  header="Etude" body={EtudeFunction}></Column>
              <Column  field="wilaya_name_ascii" header="Wilaya" />
              <Column  field="commune_name_ascii" header="Commune"></Column>
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
    emptyMessage="Aucune situation trouvée"
    paginator
    rows={10}
    size="small"
    dataKey="id_sit"
    filters={filters} filterDisplay="row" globalFilterFields={[ 'action', 'wilaya_name_ascii','commune_name_ascii','bv_entreprise_realisation']} showGridlines
>
    {/* Column for ACTION with row-span handling */}
    <Column filter
        field="action"
        header="ACTION"
      
      
    />

    {/* Column for Wilaya with row-span handling */}
    <Column filter
        field="wilaya_name_ascii"
        header="Wilaya"
    />

    {/* Column for Commune / Localités */}
    <Column
        header="Commune / Localités"
        body={(rowData) => (
            <>
                {rowData.liste.map((item, index) => (
                    <div key={`commune-${index}`}>
                        <p style={{ display: 'inline-block', marginRight: '5px' }}>
                            {item.commune_name_ascii}:
                        </p>
                        {item.LOCALITES.map((locality, locIndex) => (
                            <span key={`locality-${index}-${locIndex}`} style={{ display: 'inline-block', marginRight: '5px' }}>
                                {locality},
                            </span>
                        ))}
                        <br />
                    </div>
                ))}
            </>
        )}
    />

    {/* Column for Action Buttons */}
    <Column
        header="Decompt"
        body={(rowData) => (
            <>
                <button
                    onClick={() => { setidSit(rowData.id_sit); setshowDecompt(true); }}
                    style={{ fontSize: '1.1rem', margin: "3px", backgroundColor: 'var(--purple-400)', color: "#fff", borderRadius: "40%", border: "none" }}
                >
                    <i className="pi pi-eye" style={{ fontSize: '1rem' }}></i>
                </button>
              
            </>
        )}
    />
        <Column
        header="Situation"
        body={(rowData) => (
            <>
              
                <button
                    onClick={() => {setidSit(rowData.id_sit); setshowSituation(true); }}
                    style={{ fontSize: '1.1rem', backgroundColor: 'var(--red-600)', color: "#fff", borderRadius: "40%", border: "none" }}
                >
                    <i className="pi pi-eye" style={{ fontSize: '1rem' }}></i>
                </button>
            </>
        )}
    />
</DataTable>

        </AccordionTab>
       
    
      </Accordion>
      <Toast ref={toastTopLeft} position="top-center"  />
    </div>
  );
}
export default DecomptSituation;
