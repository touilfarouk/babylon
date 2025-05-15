import React, { useState, useEffect } from "react";
import { Row, Col,Card,CardImg,CardBody ,CardTitle,CardSubtitle} from "reactstrap";
import suivi from './image/suivi.jpg'
import facture from'./image/factures.jpg'
import { Button } from 'primereact/button';
import { useNavigate,useParams} from 'react-router-dom'; 
import pv from'./image/pv.jpg'
export default function ComposantEtude() { 
const Navigate  = useNavigate ();
const idProgramme  = useParams().idprog;
return(
<div className="content mt-3">
<p style={{  fontSize: '20px'}} > Détail des réalisations du programme { idProgramme}</p>
<Button icon="pi pi-arrow-left" label="Retour" onClick={()=>Navigate(`/admin/ComposantProgramme/${idProgramme}`)}
 style={{  marginRight: '10px', background:'var(--red-500)', borderColor:'var(--red-500)'}} raised />
<Row className="mb-0" >
  <Col className="col-md-3 d-flex">
    <Card className="ml-2 w-100" style={{ height:"300px"}}>
      <CardImg
        alt="Card image cap"
        src={suivi}
        top
        style={{ objectFit: "cover", height: "60%" }}
      />
      <CardBody>
        <CardTitle tag="h5">Suivi des études</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h5"></CardSubtitle>
        <Button style={{ backgroundColor: 'var(--bluegray-500)', color: 'var(--primary-color-text)',borderColor:'var(--bluegray-400)', borderRadius: 'var(--border-radius)'}}
         raised onClick={() => Navigate(`/admin/ActionImp/${idProgramme}/etude`)}>Consulter</Button>
      </CardBody>
    </Card>
  </Col>



  <Col className="col-md-3 d-flex">
    <Card className="ml-2 w-100" style={{ height:"300px"}}>
      <CardImg
        alt="Card image cap"
        src={pv}
        top
        style={{height: "60%" }}
      />
       <CardBody>
        <CardTitle tag="h5">Pv de réception</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h5"></CardSubtitle>
        <Button onClick={() => Navigate(`/admin/ProcesVerbalpro/${idProgramme}/Etude`)} style={{ backgroundColor: 'var(--bluegray-500)', color: 'var(--primary-color-text)',borderColor:'var(--bluegray-400)', borderRadius: 'var(--border-radius)'}} raised >Consulter</Button>
       </CardBody>
    </Card>
  </Col>

  <Col className="col-md-3 d-flex">
    <Card className="ml-2 w-100" style={{ height:"300px"}}>
      <CardImg
        alt="Card image cap"
        src={facture}
        top
        style={{height: "60%" }}
      />
       <CardBody>
        <CardTitle tag="h5">Procedure de paiment</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h5"></CardSubtitle>
        <Button onClick={() => Navigate(`/admin/DecomptSituation/${idProgramme}/Etude`)} style={{ backgroundColor: 'var(--bluegray-500)', color: 'var(--primary-color-text)',borderColor:'var(--bluegray-400)', borderRadius: 'var(--border-radius)'}} raised >Consulter</Button>
       </CardBody>
    </Card>
  </Col>

</Row>
</div>
)
}