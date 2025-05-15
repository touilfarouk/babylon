import React, { useState, useEffect } from "react";
import { Row, Col,CardGroup,Card,CardImg,CardBody ,CardTitle,CardSubtitle,CardText} from "reactstrap";
import tb from "./image/tb.png"
import asf from "./image/asf.jpg"
import attach from './image/attach.png'
import suivi from './image/suivi.jpg'
import decompte from './image/decompte.png'
import facture from'./image/factures.jpg'
import pv from'./image/pv.jpg'
import { Button } from 'primereact/button';
import { useNavigate,useParams} from 'react-router-dom'; 
export default function ComposantRealisation() { 
    const Navigate  = useNavigate ();
    const idProgramme  = useParams().idprog;
return(
<div className="content mt-3">
<p style={{  fontSize: '20px'}} > Détail des réalisations du programme { idProgramme}</p>
<Button icon="pi pi-arrow-left" label="Retour" onClick={()=>Navigate(`/admin/ComposantProgramme/${idProgramme}`)}
 style={{  marginRight: '10px' , background:'var(--red-500)', borderColor:'var(--red-500)'}} raised />
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
        <CardTitle tag="h5">Suivi des réalisations</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h5"></CardSubtitle>
        <Button style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)', borderRadius: 'var(--border-radius)'}}
         raised onClick={() => Navigate(`/admin/ActionImp/${idProgramme}/realisation`)}>Consulter</Button>
      </CardBody>
    </Card>
  </Col>
  <Col className="col-md-3 d-flex">
    <Card className="ml-2 w-100" style={{ height:"300px"}}>
      <CardImg
        alt="Card image cap"
        src={attach}
        top
        style={{ height: "60%" }}
      />
      <CardBody>
        <CardTitle tag="h5">Attachements</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h5"></CardSubtitle>
        <Button  onClick={() => Navigate(`/admin/attachement/${idProgramme}/Réalisation`)}
        style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)', borderRadius: 'var(--border-radius)'}} raised >Consulter</Button>
      </CardBody>
    </Card>
  </Col>
  {/* <Col className="col-md-3 d-flex">
    <Card className="ml-2 w-100" style={{ height:"300px"}}>
      <CardImg
        alt="Card image cap"
        src={pv}
        top
        style={{ height: "50%" }}
      />
      <CardBody>
        <CardTitle tag="h5">Procès-verbal de réception</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h5"></CardSubtitle>
        <Button onClick={() => Navigate(`/admin/PvReception/${idProgramme}`)}
        style={{ backgroundColor: 'var(--bluegray-500)', color: 'var(--primary-color-text)',borderColor:'var(--bluegray-400)', borderRadius: 'var(--border-radius)'}} 
        raised >Consulter</Button>
      </CardBody>
    </Card>
  </Col> */}
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
        <Button onClick={() => Navigate(`/admin/asf/${idProgramme}/Réalisation`)} style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)', borderRadius: 'var(--border-radius)'}} raised >Consulter</Button>
       </CardBody>
    </Card>
  </Col>
  {/* <Col className="col-md-3 d-flex">
    <Card className="ml-2 w-100" style={{ height:"300px"}}>
      <CardImg
        alt="Card image cap"
        src={decompte}
        top
        style={{ objectFit: "cover", height: "60%" }}
      />
      <CardBody>
        <CardTitle tag="h5">Décompte global</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h5"></CardSubtitle>
        <Button style={{ backgroundColor: 'var(--bluegray-500)', color: 'var(--primary-color-text)',borderColor:'var(--bluegray-400)', borderRadius: 'var(--border-radius)'}} raised >Consulter</Button>
      </CardBody>
    </Card>
  </Col> */}

</Row>
</div>
)
}