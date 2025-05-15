import React, { useState, useEffect, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import { useReactToPrint } from "react-to-print";
import { Toolbar } from "primereact/toolbar";
import {setsituationEtude,getDetailDecompte} from "../../utils/APIRoutes";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function DetailDecompt (props)
{
  const [loading,setloading]=useState(false)
  const [detaildecompt,setdetaildecompt]=useState([])
  const [infodecompt,setinfodecompt]=useState([])
  const componentRef = useRef();
  const token = localStorage.getItem("token");
  const toastTopLeft = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `@media print { @page { size: landscape; } }`,
  });
  const headerRight=()=>{
    return( 
      <>
      <Button  label="Imprimer" raised style={{backgroundColor: 'var(--orange-600)',borderColor:'var(--orange-600)'}}  onClick={() => {  handlePrint()  }} className="mr-2" />
      <Button  label="vallider" raised style={{backgroundColor: 'var(--green-600)',borderColor:'var(--green-600)'}}  onClick={() => { setloading(true); setDetailAsf()  }} className="mr-2" />
      </>  )
  }
  const getDecomptDetail = () => {
    fetch(getDetailDecompte, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        IDMarche:props.IDMarche,
        id_sit: props.id_sit,
      }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setdetaildecompt(data)
   
      });
  };

  const setDetailAsf = () => {
    fetch(setsituationEtude, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        detail:detaildecompt,
        IDMarche:props.IDMarche,
        id_sit: props.id_sit
      }),
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        if(data=="true")
          {
            setloading(false)
            toastTopLeft.current.show({
              severity: 'success',
              summary: "Succées",
              detail: "Validation avec succées",
              life: 4000,
            });
          }
 
      });
  };
  useEffect(() => {
    getDecomptDetail();
  }, []);

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

    return(    
    <Dialog  headerStyle={{ backgroundColor: 'var(--green-400)',color:'#fff',borderRadius:'20px', height:"4rem",marginBottom:'5px'}} header="Décompte" visible={props.showDecompt} style={{ width: '80vw' }} onHide={() => props.setshowDecompt(false)}>
                  {loading &&
    
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.1)", display: "flex",justifyContent: "center",  alignItems: "center",pointerEvents: "none",zIndex: "999"}}

    >
<ProgressSpinner   style={{

height: "3rem",

width: "3rem",

}} /> </div>} 
         <Toast ref={toastTopLeft} />
        <Toolbar className="mb-2 mt-1" left={headerRight}></Toolbar>
         <div ref={componentRef} className="m-5" >
         <div className="col-12   text-center square  mb-8 ">
            <center>
              <p>
                <u>
                  REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</u>
                  <br/>
                  <u>
                   Ministère de
                  l’Agriculture et de Développement Rural</u>
                  <br/>
                  {infodecompt.INSTITUTION_PILOTE=="FORETS" && (
                      <>
                      <u>
                        Conservation des Forêts de la Wilaya de{" "}
                        {infodecompt.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infodecompt.INSTITUTION_PILOTE=="DSA" && (
                      <>
                      <u>
                      Direction  des Services Agricoles de la Wilaya de {" "}
                        {infodecompt.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
                  {infodecompt.INSTITUTION_PILOTE=="HCDS" && (
                      <>
                      <u>
                      Haut-Commissariat au Développement de la Steppe de la Wilaya de 
 {" "}
                        {infodecompt.wilaya_name_ascii}.
                      </u>
                    </>
                  ) }
               
              </p>
              <br/>
          
            </center>
         
         
            <div className="table-container-att mt-6">
  <table style={{ border: '1px solid #000', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th>Wilaya</th>
        <th>Type d'étude</th>
        <th>Action</th>
        <th>Organisme</th>
        <th>Unité</th>
        <th>Volume prévu</th>
        <th>Volume Réalisé</th>
        <th>Prix unitaire</th>
        <th>Montant Total prévu HT</th>
        <th>Montant Total réalisé HT</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(detaildecompt).map(([wilaya, types]) => {
        return types.map((type, index) => {
          const montantTotalPrevu = type.cout * type.volumeTotal;
          const montantTotalRealise = type.cout * type.volumeRealise;

          return (
            <tr key={`${wilaya}-${type.type_etude}-${index}`}>
              {index === 0 && (
                <td rowSpan={types.length} style={{ fontWeight: 'bold' }}>{wilaya}</td>
              )}
              <td>{EtudeFunction(type)}</td>
              <td>{type.action}</td>
              <td>{type.INSTITUTION_PILOTE}</td>
              <td>{type.UNITE}</td>
              <td>{type.volumeTotal}</td>
              <td>{type.volumeRealise}</td>
              <td>{type.cout}</td>
              <td>{montantTotalPrevu.toFixed(2)}</td>
              <td>{montantTotalRealise.toFixed(2)}</td>
            </tr>
          );
        });
      })}

      {/* Totaux globaux */}
      <tr>
        <td colSpan={8} style={{ fontWeight: 'bold' }}>Total Global</td>
   
    
        <td>
          {Object.values(detaildecompt).reduce((sum, types) => 
            sum + types.reduce((tSum, type) => tSum + (type.cout * type.volumeTotal), 0), 0).toFixed(2)
          }
        </td>
        <td>
          {Object.values(detaildecompt).reduce((sum, types) => 
            sum + types.reduce((tSum, type) => tSum + (type.cout * type.volumeRealise), 0), 0).toFixed(2)
          }
        </td>
      </tr>
      {/* Ligne TVA */}
      <tr>
        <td colSpan={8} style={{ fontWeight: 'bold' }}>TVA (19%)</td>
   <td></td>
        <td>
          {(
            Object.values(detaildecompt).reduce((sum, types) => 
              sum + types.reduce((tSum, type) => tSum + (type.cout * type.volumeRealise), 0), 0) * 0.19
            ).toFixed(2)
          }
        </td>
      </tr>
      {/* Ligne Total TTC */}
      <tr>
        <td colSpan={8} style={{ fontWeight: 'bold' }}>TOTAL TTC</td>
        <td>
     
        </td>
        <td>
          {(
            Object.values(detaildecompt).reduce((sum, types) => 
              sum + types.reduce((tSum, type) => tSum + (type.cout * type.volumeRealise), 0), 0) * 1.19
            ).toFixed(2)
          }
        </td>
      </tr>
    </tbody>
  </table>
</div>




         </div>  
      
      
         </div>
         
</Dialog>)
}