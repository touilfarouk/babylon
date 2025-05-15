import React, { useState, useEffect,useRef } from "react";
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useParams} from 'react-router-dom'; 
import UpdateTache from "./UpdateTache";
import RealisationsList from "../Realisation/realisationList";
import ListOds from"../Ods/OdsList" 
export default function DetailTach (props){
     
    const  idTache = useParams().idtach;
    return(
           
      <div className="content mt-7">
      
             <Accordion multiple activeIndex={[0] } style={{color:"#fff"}}>
                <AccordionTab  style={{backgroundColor: 'var(--blue-500)'}} header="DETAIL ">
               < UpdateTache idtache={idTache} />
                </AccordionTab>
                <AccordionTab  style={{backgroundColor: 'var(--cyan-800)'}} header="SUIVI DES REALISATION"  >
                < RealisationsList idtache={idTache}/>
                </AccordionTab>
                <AccordionTab style={{backgroundColor: 'var(--orange-700)'}} header="ODS D'ARRET"  >
               < ListOds idtache={idTache}/>
                </AccordionTab>
          
            </Accordion>

      </div>
   
    )
}