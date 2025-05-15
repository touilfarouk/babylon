import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap";
import { Button } from "primereact/button";
import DoughnutChart from "views/Charts/DoughnutChart";
import { Column } from 'primereact/column';
import BarChart from "./Charts/BarChart";
import PieCharts from "./Charts/PieChart";
import BarChartProcedure from "./Charts/BarChartProcedure"
import BarChartAct from "./Charts/BarChartAct";
import BarChartWilaya from"./Charts/BarChartWilaya";
import { DataTable } from 'primereact/datatable';
import { useNavigate  } from 'react-router-dom';
import { Dropdown } from "primereact/dropdown";
import MapComponentDashbord from "./Map/MapComponentDashbord";
import DoughnutChartProgramme from"./Charts/DoughnutChartProgramme"
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import {
  getUserInf,PlanAction,
  Sou_traitance,
  GetMarches,
  getActionMarche,
  GetCommune,
  getLieuDit,getWilaya,cardPrecCons
} from "../utils/APIRoutes";
import { useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { MdQueryStats } from "react-icons/md";
import { FilterMatchMode} from 'primereact/api';
import { locale, addLocale } from 'primereact/api';
import "../assets/css/Buttons.css"; // Importez votre fichier CSS pour le style du bouton
//..
function Dashboard() {
  //..
  locale('fr');
  addLocale('fr', { "startsWith": "Commence par","contains": "Contient","notContains": "Ne contient pas","endsWith": "Se termine par","equals": "Égal à", "notEquals": "Différent de","noFilter": "Aucun filtre","filter": "Filtre", "lt": "Inférieur à", "apply":"Appliquer","clear":"Annuler", "No results found":"Aucun resultat trouvée"});
  const [filters, setFilters] = useState({
    LOCALITES: { value: null, matchMode: FilterMatchMode.CONTAINS},
    wilaya_name_ascii:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    composante_mdr:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    action:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    commune_name_ascii:{ value: null, matchMode: FilterMatchMode.CONTAINS},
    AXE:{ value: null, matchMode: FilterMatchMode.CONTAINS},
});
  const Navigate  = useNavigate ();
  const token = localStorage.getItem("token");
  const idprog = useParams().idprog;
  const [chartType] = useState(1);
  const [visiblemap, setVisiblemap] = useState(false);
  const [visibldetail, setVisibldetail] = useState(false);
  const [marcher, setMarcher] = useState([]);
  const [commune, setcommune] = useState([]);
  const [localite, setlocalite] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [cardData2, setCardData2] = useState(null);
  const [procedureConsultationWilaya, setprocedureConsultationWilaya] = useState([]);
  const [intAction, setintAction] = useState([]);
  const [wilaya, setwilaya] = useState([]);
  const [struc, setstruc] = useState("");
  const [userInf, setuserInf] = useState([]);
  const [selectedwilaya,setselectedwilaya]=useState(null)
  const [selectedwilayaProcedure,setselectedwilayaProcedure]=useState(null)
  const [selectedInstProcedure,setselectedInstProcedure]=useState(null)
  //..
  const [selectedMarche, setSelectedMarche] = useState(null);
  const [detailMarche, setdetailMarche] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [selectedLieuDit, setSelectedLieuDit] = useState(null);
  const [actionImpactee, setactionImpactee] = useState([]);
  const [PlanActionTranche, setPlanActionTranche] = useState([]);
  const [typeButtonSelectedMarcher, setTypeButtonSelectedMarcher] =
    useState(true);
  const [typeButtonSelectedAction, setTypeButtonSelectedAction] =
    useState(true);

    const [typeButtonprogramme, settypeButtonprogramme] =
    useState(true);

    const [typeButtonSelectedwilaya, setTypeButtonSelectedwilaya] =
    useState(true);
    const [typeButtonSelectedActionDun, settypeButtonSelectedActionDun] =
    useState(true);
  //..
  const handleMarcheChange = (e) => {
    const selectedOption = marcher.find(march => march.id === e.value);
    if (selectedOption) {
      setSelectedMarche(e.value);
      setdetailMarche(selectedOption); // Get echelle from the matched option
      Card_Data(selectedOption);
    
    }
  };
  const handleActionChange = (e) => {
    setSelectedAction(e.value);
    getListCommune(e.value);
  };
  const handleCommuneChange = (e) => {
    setSelectedCommune(e.value);
    getListLocalites(selectedAction, e.value);
  };
  const handleLieuDitChange = (e) => {
    setSelectedLieuDit(e.value);
  };

  const handletypeButtonSelectedAction = (e) => {
    setTypeButtonSelectedAction(!typeButtonSelectedAction);
  };
  //..
  /****************filter*************************** */
  function getIntAction(selectedMarche) {
   
    fetch(getActionMarche, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idmarche: selectedMarche,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setintAction(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  function getListCommune(selectedAction) {
    fetch(GetCommune, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        selectedAction: selectedAction,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setcommune(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  function getListWilaya() {
   
      fetch(getWilaya, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        setwilaya(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  function getListLocalites(selectedAction, selectedCommune) {
    fetch(getLieuDit, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        selectedAction: selectedAction,
        selectedCommune: selectedCommune,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setlocalite(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  const Card_Data = (selectedMarche) => {
     if (
      (struc === "DGF" || struc === "BNEDER" || struc === "SG" || struc === "MINISTRE") || 
      (detailMarche?.echelle === "Régional" && 
        (detailMarche?.contractant === struc || struc === "FORETS" || struc === "WALI") && 
        userInf?.wilaya === detailMarche?.wilaya)
    ) 
    {
      fetch(Sou_traitance, {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedMarche: selectedMarche.id,
          type:selectedMarche.type_marche,
          selectedwilaya:selectedwilaya
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setCardData(data);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };
  const Card_Data_marche = (selectedwilayaProcedure,selectedInstProcedure) => {
  //   if (
  //    (struc === "DGF" || struc === "BNEDER" || struc === "SG" || struc === "MINISTRE") || 
  //    (detailMarche?.echelle === "Régional" && 
  //      (detailMarche?.contractant === struc || struc === "FORETS" || struc === "WALI") && 
  //      userInf?.wilaya === detailMarche?.wilaya)
  //  ) 
   {
     fetch(cardPrecCons, {
       method: "POST",
       credentials: "include",
       cache: "no-cache",
       withCredentials: true,
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
       body: JSON.stringify({
         selectedwilaya:selectedwilayaProcedure,
         selectedInstProcedure:selectedInstProcedure,
         idprog:idprog
       }),
     })
       .then((response) => response.json())
       .then((data) => {
         setCardData2(data.procedureConsult);
         if(data.procedureConsultWilaya)
         {setprocedureConsultationWilaya(data.procedureConsultWilaya)}
       })
       .catch((error) => {
         console.log("Error:", error);
       });
   }
 };
  //..
  useEffect(() => {
    fetch(getUserInf, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.userinf.structure != "") {
          setstruc(data.userinf.structure);
          setuserInf(data.userinf);
      
          getListWilaya();
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    /********************************** */
    fetch(PlanAction, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idprog: idprog,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
       
          setPlanActionTranche(data)
       
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  
  }, []);
  useEffect(() => {
    Card_Data_marche()
   
    fetch(GetMarches,{
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idprog: idprog,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //const wil = data.map(wilaya => wilaya.label);
        const mappedData = data.marches.map((march) => ({
          id: march.IDMarche,
          number: march.num_marche,
          echelle: march.echelle,
          wilaya:march.code_wilaya,
          contractant:march.contractant,
          type_marche:march.type_marche

        }));
        setMarcher(mappedData);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    getIntAction(selectedMarche);
  }, [selectedMarche]);

  //..


  const headerdetail = (
    <Row>
   <Col md="3">
          <Dropdown
            invalid
            value={selectedAction}
            onChange={handleActionChange}
            options={
              intAction && intAction.length > 0
                ? intAction.map((Action) => ({
                    label: Action.action,
                    value: Action.id_pro_action_pro,
                  }))
                : []
            }
            optionLabel="label"
            placeholder="Sélectionnez une action"
            style={{
              borderWidth: "0px",
              borderColor: "black",
              color: "black",
              marginBottom: "5px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow here
            }}
            className="w-100"
          />
        </Col>
        {(struc === "DGF" || struc === "BNEDER" || struc === "MINISTRE" || struc === "SG")&&
           <Col md="3">
           <Dropdown
             invalid
             options={
            wilaya
             }
             optionLabel="label"
             value={selectedwilaya}
             onChange={(e)=>{setselectedwilaya(e.target.value)}}
             placeholder={
               wilaya && wilaya.length === 0
                 ? "Aucune wilaya disponible"
                 : "Sélectionner la wilaya"
             }
             style={{
               borderWidth: "0px",
               borderColor: "black",
               color: "black",
               boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow here
             }}
             className="w-100"
           />
         </Col>
         }
       {struc !== "" && detailMarche?.type_marche=="Réalisation" &&
        !(struc === "DGF" || struc === "BNEDER" || struc === "MINISTRE" || struc === "SG") && (
          <>
            <Col md="3">
              <Dropdown
                invalid
                options={
                  commune.communes && commune.communes.length > 0
                    ? commune.communes.map((communeItem) => ({
                        label: communeItem.commune_name_ascii,
                        value: communeItem.id,
                      }))
                    : []
                }
                optionLabel="label"
                value={selectedCommune}
                onChange={handleCommuneChange}
                placeholder={
                  commune.communes && commune.communes.length === 0
                    ? "Aucune commune disponible"
                    : "Sélectionnez la commune"
                }
                style={{
                  borderWidth: "0px",
                  borderColor: "black",
                  color: "black",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow here
                }}
                className="w-100"
              />
            </Col>

            <Col md="3">
              <Dropdown
                invalid
                options={
                  localite.lieuDit && localite.lieuDit.length > 0
                    ? localite.lieuDit.map((lieuditItem) => ({
                        label: lieuditItem.LieuDit,
                        value: lieuditItem.id_action_impactee,
                      }))
                    : []
                }
                optionLabel="label"
                value={selectedLieuDit}
                onChange={handleLieuDitChange}
                placeholder={
                  localite.lieuDit && localite.lieuDit.length === 0
                    ? "Aucune localité disponible"
                    : "Sélectionnez la localité"
                }
                style={{
                  borderWidth: "0px",
                  borderColor: "black",
                  color: "black",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow here
                }}
                className="w-100"
              />
            </Col>
          </>
        )}
  
  </Row>)

const footerContent = (
  <div>
    <Button
      icon="pi pi-arrow-left"
      label="Retour"
      onClick={() =>{setintAction(null);setselectedwilaya(null); setVisibldetail(false)}}
      style={{ background: "var(--red-500)", borderColor: "var(--red-500)" }}
    />
  </div>
);


  return (
    <div className="content mt-1 ">

          {visiblemap && <MapComponentDashbord struc={struc} visiblemap={visiblemap} setVisiblemap={setVisiblemap} selectedMarche={selectedMarche}/>   } 

      <h2>Tableau de bord</h2>
     
      <div className="App ">
      <Col md="1"> 
  <Button icon="pi pi-arrow-left" label="Retour" onClick={()=>{Navigate(`/admin/ComposantProgramme/${idprog}`)}} style={{marginTop:"-20px" ,marginBottom:"5px" , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised/>
 
  </Col>
  <Accordion activeIndex={0}>
  <AccordionTab style={{ backgroundColor: 'var(--green-300)' }} header={`Detail du programme ${idprog}`}>
    

    {struc !== ""  && (
(struc === "DGF" || struc === "BNEDER" || struc === "SG" || struc === "MINISTRE") || 
(detailMarche?.echelle === "Régional" && 
(detailMarche?.contractant == struc || struc === "FORETS" || struc === "WALI") && 
userInf?.wilaya == detailMarche?.wilaya)
) && 
<>

<Row>
<Col md="12">
<h6 >
<b>L'etat d'avancement du programme {idprog}</b>
</h6>
</Col>
<Col md="2" className="d-flex flex-column align-items-left">

<Button
className={`Button_mpg ${
typeButtonprogramme==true ? "clicked" : ""
}`}
name="ava_pm"
value={typeButtonprogramme }
onClick={()=>settypeButtonprogramme(true)}
style={{ fontSize: "18px" ,paddingLeft:'50px',marginTop:'50%'}} 
>
{/* <MdConstruction style={{ fontSize: "19px" }} /> */}
Avancement physique
</Button>

<Button
className={`Button_mfg ${
!typeButtonprogramme ? "clicked" : ""
}`}
name="ava_fm"
value={typeButtonprogramme}
onClick={()=>settypeButtonprogramme(false)}
style={{ fontSize: "18px" ,paddingLeft:'50px', marginTop:'15px'}} 
>
{/* <GiTakeMyMoney style={{ fontSize: "19px" }} /> */}
&nbsp;Avancement financier
</Button>

</Col>
<Col md={5}>
<Row>
<Col md="12">
<Card
style={{
border: "none",
backgroundColor: "var(--green-50)",
color: "var(--highlight-text-color)",
height: "320px",
}}
>
<h6 className="pl-3 mb-1 mt-2">
<b>L'état d'avancement des marchés realisations</b>
</h6>
<Row>
<Col md="12">
<DoughnutChartProgramme

idprog={idprog}
type_marche ={ "Réalisation"} 
buttonType={typeButtonprogramme}
/>
</Col>

</Row>

</Card>
</Col>



</Row>
</Col>
<Col md={5}>
     <Row>
<Col md="12">
<Card
style={{
border: "none",
backgroundColor: "var(--green-50)",
color: "var(--highlight-text-color)",
height: "320px",
}}
>

<h6 className="pl-3 mb-1 mt-2">
<b>L'état d'avancement des marchés etudes</b>
</h6>


<Row>
<Col md="12">
  <DoughnutChartProgramme
  type_marche ={ "Etude"} 
  idprog={idprog}
 buttonType={typeButtonprogramme}
  />
</Col>

</Row>

</Card>
</Col>


    
     </Row>
   </Col>
   </Row>
   <Row>
<Col md="12" style={{marginTop:"-5px"}}>
<h6 >
<b>Plan d'action de la tranche</b>
</h6>
<DataTable value={PlanActionTranche} size={'small'} paginator  rows={8} editMode="row"  showGridlines
emptyMessage="Aucunne action trouvée."filters={filters} filterDisplay="row" globalFilterFields={['AXE', 'composante_mdr', 'action', 'wilaya_name_ascii','commune_name_ascii']}      tableStyle={{  borderCollapse: 'collapse', border: '1px solid #ddd' }} dataKey="" 
>
        <Column field="action" header="ACTION" filter />
        <Column field="nombre" header="NOMBRE"   />
        <Column field="volume"  header="VOLUME"  />
        <Column field="UNITE"  header="Unité"  />
        <Column header="MONTANT GLOBAL" body={(rowData) => (
        <>
          <div>🟢 Étude: {rowData.montant_etude} DA </div>
          <div>🟠 Réalisation: {rowData.montant_realisation} DA</div>
        </>
    )}/>
    


</DataTable>

</Col>

   </Row>
   </>
   
   }



       

</AccordionTab>
    <AccordionTab style={{ backgroundColor: 'var(--green-300)' }} header={`Le nombre des procedure de consultation dans le programme ${idprog}`}>
   <Row>    {(struc === "DGF" || struc === "BNEDER" || struc === "MINISTRE" || struc === "SG" || struc=="DGPA")&&
         <>
         <Col md="3">
           <Dropdown
             invalid
             options={
            wilaya
             }
             optionLabel="label"
             value={selectedwilayaProcedure}
             onChange={(e)=>{setselectedwilayaProcedure(e.target.value); Card_Data_marche(e.target.value,selectedInstProcedure)}}
             placeholder={
               wilaya && wilaya.length === 0
                 ? "Aucune wilaya disponible"
                 : "Sélectionner la wilaya"
             }
             style={{
               borderWidth: "0px",
               marginBottom:"10px",
               borderColor: "black",
               color: "black",
               boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow here
             }}
             className="w-100"
           />
           
         </Col>
  
         </>
         }
          {(struc === "DGF" || struc === "BNEDER" || struc === "MINISTRE" || struc === "SG" || struc=="WALI" || struc=="FORETS" || struc=="DGPA")&&
            <Col md="3">
     <Dropdown
       invalid
       options={[ struc !== "DGPA"&&{label:"FORETS",value:"FORETS"},{label:"DSA",value:"DSA"},{label:"HCDS",value:"HCDS"}]}
       optionLabel="label"
       value={selectedInstProcedure}
       onChange={(e)=>{setselectedInstProcedure(e.target.value);Card_Data_marche(selectedwilayaProcedure,e.target.value)}}
       placeholder={
        "Sélectionner la structure"
       }
       style={{
         borderWidth: "0px",
         marginBottom:"10px",
         borderColor: "black",
         color: "black",
         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow here
       }}
       className="w-100"
     />
     
   </Col>}
         </Row>
{  cardData2 != null &&   <Row>

<Col md="3" className="p-1">
                        <Card
                          className="card-stats"
                          style={{
                            border: "none",       
                            backgroundColor: "#98C7FD",
                            color: "var(--highlight-text-color)",
                          }}
                        >
                          <CardBody>
                            <Row>
                              <Col md="12">
                                <p className="opacity-70 mb-1">
                                  {" "}
                                  <b>Nombre des cahiers des charges visés </b>
                                </p>
                                    <h6
                                      style={{
                                        marginTop: "10px",
                                      }}
                                    >
                                      {cardData2.cahiercharge==null?0:cardData2.cahiercharge}
                                      &nbsp;
                                    </h6>
                                
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
</Col>
<Col md="3" className="p-1">
                        <Card
                          className="card-stats"
                          style={{
                            border: "none", 
                            backgroundColor: "#C0F2C2",
                            color: "var(--highlight-text-color)",
                          }}
                        >
                          <CardBody>
                           
                            <Row>
                              <Col md="12">
                                <p className="opacity-70 mb-1">
                                  {" "}
                                  <b>Nombre d'appels d'offres visés</b>
                                </p>
                            
                                    <h6
                                      style={{
                                        marginTop: "10px",
                                      }}
                                    >
                                      {cardData2.appeloffre==null?0:cardData2.appeloffre}
                                      &nbsp;
                                    </h6>
                                
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
</Col>
<Col md="3" className="p-1">
                        <Card
                          className="card-stats"
                          style={{
                            border: "none", 
                            backgroundColor: "#FFDCA5",
                            color: "var(--highlight-text-color)",
                          }}
                        >
                          <CardBody>
                           
                            <Row>
                              <Col md="12">
                                <p className="opacity-70 mb-1">
                                  {" "}
                                  <b>Nombre d'attributions visées</b>
                                </p>
                              
                                    <h6
                                      style={{
                                        marginTop: "10px",
                                      }}
                                    >
                                      {cardData2.attribution==null?0:cardData2.attribution}
                                      &nbsp;
                                    </h6>
                               
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
</Col>
<Col md="3" className="p-1">
                        <Card
                          className="card-stats"
                          style={{
                            border: "none", 
                            backgroundColor: "#FEFFBA",
                            color: "var(--highlight-text-color)",
                          }}
                        >
                          <CardBody>
                           
                            <Row>
                              <Col md="12">
                                <h7 className="opacity-70 mb-1">
                                  {" "}
                                  <b>Nombre de contrats visés</b>
                                </h7>
                             
                                    <h6
                                      style={{
                                        marginTop: "10px",
                                      }}
                                    >
                                      {cardData2.contrat==null?0:cardData2.contrat}
                                      &nbsp;
                                    </h6>
                                  
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
</Col>


</Row>}

{procedureConsultationWilaya.length >0 &&
<>   <h6 className="pl-2 mb-1 mt-2" style={{ textAlign: "center" }}>
                          <b>Le nombre des procedures de consultation par wilaya</b>
                        </h6>
                        <BarChartProcedure
                              chartType={chartType}
                              procedureConsultationWilaya={procedureConsultationWilaya}
                            />
                        </>
}
    </AccordionTab>
  
     <AccordionTab style={{ backgroundColor: 'var(--green-300)' }} header={`L'etat d'avancement des marchés dans le programme ${idprog}`}>
    <Row>
            <Col md="12">
  <Card
    className="card-stats"
    style={{
      backgroundColor: "var(--yellow-50)",
      height: "80px",
      width: "100%",
      padding:'2px',marginTop:"-10px" 
    }}
  >
    <CardBody> 
      <Row>
        <Col md="3">
          <Dropdown
            invalid
            value={selectedMarche}
            onChange={handleMarcheChange}
            options={
              marcher && marcher.length > 0
                ? marcher.map((march) => ({
                    label: "Marché N° " + march.number,
                    value: march.id,
                    echelle: march.echelle,
                  }))
                : []
            }
            optionLabel="label"
            placeholder="Sélectionnez un marché"
            style={{
              borderWidth: "0px",
              borderColor: "black",
              color: "black",
              marginBottom: "5px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow here
            }}
            className="w-100 h-100"
          />
        </Col>
        <Col md="1"><Button icon="pi pi-map" label="Carte" onClick={()=>{ setVisiblemap(true)}} style={{ background:'var(--orange-500)', borderColor:'var(--orange-500)'}} raised/> </Col>
        <Col md="1"><Button icon="pi pi-chart-bar" label="Détail" onClick={()=>{ setVisibldetail(true)}} style={{ background:'var(--green-600)', borderColor:'var(--green-600)'}} raised/>  </Col>
       

   
      </Row>
    </CardBody>
  </Card>
  </Col>
            {struc !== ""  && (
  (struc === "DGF" || struc === "BNEDER" || struc === "SG" || struc === "MINISTRE") || 
  (detailMarche?.echelle === "Régional" && 
    (detailMarche?.contractant == struc || struc === "FORETS" || struc === "WALI") && 
    userInf?.wilaya == detailMarche?.wilaya)
) && 
  <Col md={4}>
             <Row>
 <Col md="12">
  <Card
    style={{
      border: "none",
      backgroundColor: "var(--green-50)",
      color: "var(--highlight-text-color)",
      height: "400px",
    }}
  >
    
      <h6 className="pl-3 mb-1 mt-2">
        <b>L'état d'avancement du marché</b>
      </h6>


    {selectedMarche !== null  && (
      <Row>
        <Col md="12">
          <DoughnutChart
         detailMarche={detailMarche}
         buttonType={typeButtonSelectedActionDun}
          />
        </Col>
        <Col md="12">
          <div className="row" >
            <Button
              className={`Button_mp ${
                typeButtonSelectedActionDun ? "clicked" : ""
              }`}
              name="ava_pm"
              value={typeButtonSelectedActionDun }
              onClick={()=>settypeButtonSelectedActionDun(true)}
              style={{ fontSize: "14px" ,padding:'2px', marginLeft:'40px',marginTop:'10px'}} 
            >
              {/* <MdConstruction style={{ fontSize: "19px" }} /> */}
            Avancement physique
            </Button>
            <Button
              className={`Button_mf ${
                !typeButtonSelectedActionDun ? "clicked" : ""
              }`}
              name="ava_fm"
              value={typeButtonSelectedActionDun}
              onClick={()=>settypeButtonSelectedActionDun(false)}
              style={{ fontSize: "14px" ,padding:'2px', margin:'10px'}} 
            >
              {/* <GiTakeMyMoney style={{ fontSize: "19px" }} /> */}
              &nbsp;Avancement financier
            </Button>
          </div>
        </Col>
      </Row>
    )}
  </Card>
</Col>
            
             </Row>
           </Col>}
    <Col md={4}>
             
                {/* le graphe */}
                <Row>
                  <Col md="12">
                    <Card
                      style={{
                        border: "none",
                        backgroundColor: "var(--green-50)",
                        color: "var(--highlight-text-color)",
                        height: "400px",
                      }}
                    >
                      {struc !== "DGF" && struc !== "BNEDER" && (
                        <h6 className="pl-3 mb-1 mt-2">
                          <b>L'état des travaux par commune</b>
                        </h6>
                      )}
                      {(struc === "DGF" || struc === "BNEDER" || struc === "MINISTRE" || struc === "SG") && (
                        <h6 className="pl-3 mb-1 mt-2">
                          <b>L'état des travaux par wilaya</b>
                        </h6>
                      )}
                   
                      {selectedMarche !== null && (
                        <Row>
                          <Col md="12">
                            <BarChart
                              chartType={chartType}
                              detailMarche={detailMarche}
                              buttonType={typeButtonSelectedMarcher}
                            />
                               <div className="row">
                              <Button
                                className={`Button_mp ${
                                  typeButtonSelectedMarcher ? "clicked" : ""
                                }`}
                                name="ava_pm"
                                value={typeButtonSelectedMarcher}
                                onClick={()=> setTypeButtonSelectedMarcher(true)}
                                style={{ fontSize: "14px" ,padding:'2px', marginLeft:'50px',marginTop:"-30px" }} 
                              >
                                {/* <MdConstruction style={{ fontSize: "19px" }} /> */}
                                &nbsp; &nbsp; &nbsp; Avancement physique
                              </Button>
                              <Button
                                className={`Button_mf ${
                                  !typeButtonSelectedMarcher ? "clicked" : ""
                                }`}
                                name="ava_fm"
                                value={typeButtonSelectedMarcher}
                                onClick={()=> setTypeButtonSelectedMarcher(false)}
                                style={{ fontSize: "14px" ,padding:'2px', marginLeft:'10px',marginTop:"-30px" }} 
                              >
                                {/* <GiTakeMyMoney style={{ fontSize: "19px" }} /> */}
                                &nbsp; &nbsp; &nbsp;Avancement financier
                              </Button>
                            </div>
                          </Col>
                          <Col md="12">
                         
                          </Col>
                        </Row>
                      )}
                    </Card>
                  </Col>
                </Row>
       </Col>
     <Col md={4}>
    <Row>
                  {struc !== "" && detailMarche !== null && (
  (struc === "DGF" || struc === "BNEDER" || struc === "SG" || struc === "MINISTRE") || 
  (detailMarche?.echelle === "Régional" && 
    (detailMarche?.contractant == struc || struc === "FORETS" || struc === "WALI") && 
    userInf?.wilaya == detailMarche?.wilaya)
)  && (         <>
                  <Col md="12">
                      <Row>
                        <Col md="4" >
                          <Card
                            className="card-stats"
                            style={{
                              border: "none",
                              backgroundColor: "var(--orange-100)",
                              color: "var(--highlight-text-color)",
                            }}
                          >
                            <CardBody>
                           
                              <Row>
                                <Col md="12">
                                  <p className="opacity-70 mb-1">
                                    {" "}
                                    <b>Soutraitance</b>
                                  </p>
                                  {selectedMarche !== null &&
                                    cardData.length > 0 && (
                                      <h6
                                        style={{
                                          marginTop: "10px",
                                        }}
                                      >
                                        {cardData[0].montant_soutraitance}
                                        &nbsp;%
                                      </h6>
                                    )}
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="7">
                          <Card
                            className="card-stats"
                            style={{
                              border: "none",
                              backgroundColor: "var(--green-200)",
                              color: "var(--highlight-text-color)",
                            }}
                          >
                            <CardBody>
                             
                              <Row>
                                <Col md="12">
                                  <p className="opacity-70 mb-1">
                                    {" "}
                                    <b>Nombre d'entreprise soutraité</b>
                                  </p>
                                  {selectedMarche !== null &&
                                    cardData.length > 0 && (
                                      <h6
                                        style={{
                                          marginTop: "10px",
                                        }}
                                      >
                                        {cardData[0].nombre_entr}
                                        &nbsp;
                                      </h6>
                                    )}
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                      
                       </Row> 
                       
                       <Row>
                        <Col md="11">
                          <Card
                            className="card-stats "
                            style={{
                              border: "none",
                              backgroundColor: "var(--green-200)",
                              color: "var(--highlight-text-color)",
                            }}
                          >
                            <CardBody>
                          
                              <Row>
                                <Col md="12">
                                  <p className="opacity-70 mb-1">
                                    <b>Taux de remboursement de l'avance forfaitaire</b>
                                  </p>
                                  {selectedMarche !== null &&
                                    cardData.length > 0 && (
                                      <h6
                                        style={{
                                          marginTop: "10px",
                                        }}
                                      >
                                        {
                                          cardData[0]
                                            .sum_avance_for
                                        }
                                        &nbsp;%
                                      </h6>
                                    )}
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                     
                        { struc!="MINISTRE" && <Col md="8">
                          <Card
                            className="card-stats"
                            style={{
                              border: "none",
                              backgroundColor: "var(--orange-100)",
                              color: "var(--highlight-text-color)",
                            }}
                          >
                            <CardBody>
                              <Row>
                                <Col md="12">
                                  <p className="opacity-70 mb-1">
                                    {" "}
                                    <b>Taux de remboursement de l'avance d'approvisionement</b>
                                  </p>
                                  {selectedMarche !== null &&
                                    cardData.length > 0 && (
                                      <h6 style={{ marginTop: "10px" }}>
                                        {
                                          cardData[0]
                                            .sum_avance_appro
                                        }
                                        &nbsp;%
                                      </h6>
                                    )}
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>}
                      
                     
                      </Row>
                    </Col>
                    <Col md="12">
                      <Row style={{ height: "193px" }}>
                       
                    {struc!="MINISTRE" && 
                     <Col md="10" className="p-1">
                     <Card
                       className="card-stats"
                       style={{
                         border: "none",
                         backgroundColor: "var(--green-200)",
                         color: "var(--highlight-text-color)",
                       }}
                     >
                       <CardBody>
                       
                         <Row>
                           <Col md="12">
                             <p className="opacity-70 mb-1">
                               {" "}
                               <b>Taux de remboursement de retenu de garanti</b>
                             </p>
                             {selectedMarche !== null &&
                               cardData.length > 0 && (
                                 <h6 style={{ marginTop: "10px" }}>
                                 
                                     {cardData[0].pourc_retenu_granti_round}
                                   
                                   &nbsp;%
                                 </h6>
                               )}
                           </Col>
                       
                         </Row>
                       </CardBody>
                     </Card>
                   </Col>
                   }
                       
                      </Row>
                    </Col>
                  </>  
                    
                  )}
            
    </Row>
             
    </Col>
    <Col md="12" style={{marginTop:"-70px"}}>
    <h6 >
        <b>La liste des actions qui ont depassé le delais dans le marché selectionné</b>
      </h6>
    <DataTable value={actionImpactee} size={'small'} paginator  rows={8} editMode="row"  showGridlines
     emptyMessage="Aucunne action trouvée."filters={filters} filterDisplay="row" globalFilterFields={['AXE', 'composante_mdr', 'action', 'wilaya_name_ascii','commune_name_ascii']}      tableStyle={{  borderCollapse: 'collapse', border: '1px solid #ddd' }} dataKey="id_action_impactee" 
    >
 
 <Column field="AXE" header="AXE" filter  />
                <Column field="composante_mdr" filter header="COMPOSANTE"  />
                <Column field="action" header="ACTION" filter />
             {struc==='DGF' &&   <Column field="wilaya_name_ascii" filter header="WILAYA" />} 
                <Column field="commune_name_ascii" filter header="COMMUNE"/>
                <Column field="LOCALITES" filter header="LOCALITES"/>
                <Column field="retard"  header="RETARD"/>

     
</DataTable>

  </Col>
    <Dialog
      header={headerdetail}
        footer={footerContent}
        visible={visibldetail}
        style={{ width: "70vw" ,height:'70%'}}
        onHide={() => setVisiblemap(false)}
      >
        <Row>
    <Col md="4">
 <Card
                      style={{
                        border: "none",
                        backgroundColor: "var(--green-50)",
                        color: "var(--highlight-text-color)",
                        height: "340px"
                      }}
                    >
                      <Row>
                        <Col md={10}>
                          <h6 className="pl-3 mb-1 mt-2">
                            <b>L'etat d'avancement de l'action</b>
                          </h6>
                        </Col>
                      </Row>
                      {selectedAction !== null && (
                        <Row>
                          <Col md="12">
                            <BarChartAct
                              selectedAction={selectedAction}
                              detailMarche={detailMarche}
                              buttonType={typeButtonSelectedAction}
                            />
                          </Col>
                          {/* <Col md="12">
                            <div className="row" style={{ margin: "10px" }}>
                              <Button
                                className={`Button_ap ${
                                  typeButtonSelectedAction ? "clicked" : ""
                                }`}
                                name="avancement physique"
                                value={typeButtonSelectedAction}
                                onClick={handletypeButtonSelectedAction}
                                style={{ fontSize: "11px" ,padding:'2px', marginLeft:'50px'}}
                              >
                             
                                &nbsp;Avancement physique
                              </Button>
                              <Button
                                className={`Button_af ${
                                  !typeButtonSelectedAction ? "clicked" : ""
                                }`}
                                name="avancement financier"
                                value={typeButtonSelectedAction}
                                onClick={handletypeButtonSelectedAction}
                                style={{ fontSize: "11px" ,padding:'2px', marginLeft:'20px'}}
                              >
                           
                                &nbsp;Avancement financier
                              </Button>
                            </div>
                          </Col> */}
                        </Row>
                      )}
                    </Card>
   </Col>
{struc !== "" && detailMarche?.type_marche=="Réalisation"&& (struc === "DGF" || struc === "BNEDER" || struc === "MINISTRE"|| struc === "SG" || struc === "WALI") && <Col md="7">
 <Card
                      style={{
                        border: "none",
                        backgroundColor: "var(--green-50)",
                        color: "var(--highlight-text-color)",
                        height: "340px"
                      }}
                    >
                      <Row>
                        <Col md={10}>
                          <h6 className="pl-3 mb-1 mt-2">
                            <b>L'etat d'avancement des actions dans la wilaya {selectedwilaya}</b>
                          </h6>
                        </Col>
                      </Row>
                      
                        <Row>
                          <Col md="12">
                        { selectedwilaya && <BarChartWilaya
                              selectedwilaya={selectedwilaya}
                              detailMarche={detailMarche}
                              buttonType={typeButtonSelectedwilaya}
                            />}
                          </Col>
                          {/* <Col md="12">
                            <div className="row" style={{ margin: "10px" }}>
                              <Button
                                className={`Button_ap ${
                                  typeButtonSelectedAction ? "clicked" : ""
                                }`}
                                name="avancement physique"
                                value={typeButtonSelectedAction}
                                onClick={handletypeButtonSelectedAction}
                                style={{ fontSize: "11px" ,padding:'2px', marginLeft:'50px'}}
                              >
                             
                                &nbsp;Avancement physique
                              </Button>
                              <Button
                                className={`Button_af ${
                                  !typeButtonSelectedAction ? "clicked" : ""
                                }`}
                                name="avancement financier"
                                value={typeButtonSelectedAction}
                                onClick={handletypeButtonSelectedAction}
                                style={{ fontSize: "11px" ,padding:'2px', marginLeft:'20px'}}
                              >
                           
                                &nbsp;Avancement financier
                              </Button>
                            </div>
                          </Col> */}
                        </Row>
                      
                    </Card>
                  </Col>}

                  {struc !== "" && detailMarche?.type_marche=="Réalisation"&& !(struc === "DGF" || struc === "BNEDER" || struc === "MINISTRE"|| struc === "SG" || struc === "WALI") && (
                    <Col md="4">
                      <Card
                        style={{
                          border: "none",
                          backgroundColor: "var(--teal-50)",
                          color: "var(--highlight-text-color)",
                          height: "200px",
                        }}
                      >
                        <h6 className="pl-2 mb-1 mt-2">
                          <b>L'état d'avancement de l'impact</b>
                        </h6>
                        {selectedLieuDit != null && (
                          <>
                            <PieCharts
                              chartType={chartType}
                              selectedLieuDit={selectedLieuDit}
                            />
                          </>
                        )}
                      </Card>
                    </Col>
                  )}
                     </Row>
   </Dialog>               
    </Row>
    
    </AccordionTab>
    
</Accordion>


    
  
      </div>
    </div>
  );
}
export default Dashboard;
