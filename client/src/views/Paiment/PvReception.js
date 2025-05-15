import React , {useState,useEffect} from "react"
import { Row, Col,CardGroup,Card,CardImg,CardBody ,CardTitle,CardSubtitle,CardText} from "reactstrap";
import { Button } from 'primereact/button';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from 'primereact/utils';
import {getActionPv,getMarche} from "../../utils/APIRoutes"
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useNavigate,useParams} from 'react-router-dom'; 
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from 'primereact/dropdown';
export default function PvReception() {
  const Navigate  = useNavigate ();
  const [SelectedAtt, setSelectedAtt] = useState([]);
  const [listPv, setlistPv] = useState([]);
  const [search, setsearch] = useState({});
  const [listeAction, setlisteAction] = useState([]);
  const [marche, setmarche] = useState([]); 
  const [submitted, setsubmitted] = useState(false);
  const idProgramme  = useParams().idprog;
  const token = localStorage.getItem("token");

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
      body: JSON.stringify({ fillter: "yes", idprog: idProgramme, type_marche: "Réalisation" })
    })
      .then((response) => response.json())
      .then((data) => {
        setmarche(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  const getActionsPv = () => {
    fetch(getActionPv, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        IDMarche:search.IDMarche
      }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        //setlisteAction(data);
      });
  };
 
  useEffect(() => {
    getmarche()
  }, []);

  const onInputChangeSearch = (e, name) => {
    let _search = {...search };
    const val = (e.target && e.target.value) || '';
    _search[`${name}`] = val;
    setsearch(_search);
    };

  const rightToolbarTemplate = (data) => {
    return (
      <>
      <div> <Button icon="pi pi-arrow-left" onClick={()=>{Navigate(`/admin/Composantrealisation/${idProgramme}`)}} style={{  marginRight: '5px',marginBottom:'5px' ,borderRadius:"50%" , background:'var(--indigo-300)', borderColor:'var(--indigo-300)'}} raised /></div> 
        <div className="mr-1">
          <Dropdown
            placeholder="Sélectionner le marché"
            options={marche}
            value={search.IDMarche}
            onChange={(e) => { onInputChangeSearch({ target: { value: e.value } }, 'IDMarche') }}
            className={`w-full md:w-12rem ${classNames({ 'p-invalid': submitted && !search.IDMarche })}`}
          />
          {submitted && !search.IDMarche && <small className="p-error">Champ obligatoire !</small>}
        </div>
        <div className="">
          <Button
            style={{ backgroundColor: 'var(--indigo-300)', borderColor: 'var(--indigo-300)', borderRadius: 'var(--border-radius)', marginLeft: '5px' }}
            raised rounded onClick={() => {
              getActionsPv();
          
            }}>Afficher</Button>
        </div>
      </>
    );
  };
    return(
    <>
     <div className="content mt-2">
     <p style={{fontSize:"22px"}}>Procès-verbal de Réception des Travaux</p>
     <Toolbar className="mb-2 mt-3 p-2" left={rightToolbarTemplate()}></Toolbar>
     <Accordion multiple activeIndex={[0,1]} style={{ color: "#fff", marginTop: "1rem" }}>
     <AccordionTab style={{ backgroundColor: 'var(--indigo-300)' }} header="La liste des actions terminées">
        <DataTable
                 emptyMessage="Aucunne action trouvée"
                 paginator
                 showGridlines
                 rows={10}
                 size={'small'}
                 value={listeAction}
                 selection={SelectedAtt}
                 onSelectionChange={(e) => setSelectedAtt(e.value)}
                 dataKey="id_action_impactee"
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
   
        </DataTable>
     </AccordionTab>
     <AccordionTab style={{ backgroundColor: 'var(--indigo-300)' }} header="La liste des procès-verbaux de réception">
      <DataTable
                 emptyMessage="Aucun procès-verbal trouvé"
                 paginator
                 showGridlines
                 rows={10}
                 size={'small'}
                 value={listeAction}
                 dataKey="id_pv"
                 style={{ padding:'10px' ,fontSize: '0.8rem'}}
               >
        <Column
             field="action"   headerStyle={{ width: "1rem" }}
             header="Action"></Column>   
                      <Column
                        field="num_attachement"
                        header="Numero"
                        headerStyle={{ width: "1rem" }}
                      ></Column>
           
                      <Column
                        field="wilaya_name_ascii"
                        header="wilaya"   headerStyle={{ width: "1rem" }}
                      ></Column>
   
               </DataTable>
     </AccordionTab>
     
      </Accordion>
</div>
    </>)
}