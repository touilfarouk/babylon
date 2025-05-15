import React, { useState, useEffect,useRef } from "react";
import {Card, CardBody,Col,Row} from "reactstrap";
import { Button } from 'primereact/button';
import { useNavigate  } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog';
import {getAllProgramme,addProgramme} from "../../utils/APIRoutes" 
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';import BannerDGF from './image/BannerDGF.png'
import image1 from './image/image1.png'
import image2 from './image/image2.png'
import image3 from './image/image3.png'
import image4 from './image/image4.png'
import imgpro from "./image/tranche.png"
import img from "./image/OIP.jpg"
import img1 from "./image/BannerDGF.png"
import img2 from "./image/image3.png"
import img3 from "./image/image4.png"
import ProgrammeCarousel from "./ProgrammeCarousel";
import { Dialog } from "primereact/dialog";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Toast } from 'primereact/toast';
export default function Programme() {
    const Navigate  = useNavigate ();
    const [submitted, setSubmitted] = useState(false);
    const [addDialog, setaddDialog] = useState(false);
    const [newprog,setnewprog]=useState({date_debut:"",date_fin:""})
    const token = localStorage.getItem('token');
    const [layout, setLayout] = useState('grid');
    const [data,setdata] = useState([]);

  const toast = useRef(null);
  const accept = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmé', detail: 'Programme ajouté avec succès', life: 3000 });
}
    useEffect(() => {
      getAllProg()
    }, [])
    function getAllProg() {
      fetch(getAllProgramme, {
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
   
         setdata(data)
         })
        .catch((error) => {
          console.log("Error:", error);
          if(error==`SyntaxError: Unexpected token 'F', "Forbidden" is not valid JSON`)
            {
              localStorage.clear();
            }
        });
    }
    const gridItem = (product) => {
      return (
          <div className="col-12 sm:col-6 lg:col-12 xl:col-3 p-1" key={product.IDProgramme}>
              <div className="p-1 border-1 surface-border surface-card border-round">
              <div className="flex flex-column align-items-center gap-1 p-0">
  <img 
    className="w-9 shadow-2 border-round"
    src={imgpro} 
    alt={product.name} 
    style={{ transition: 'transform 0.9s ease-in-out' }} 
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
  />
  <div className="text-xl font-bold">{new Date(product.debut).getFullYear()} </div>
</div>
                  <div className="flex align-items-center justify-content-between">
                      <span className="text-2xl font-semibold"></span>
                      <Button style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)', borderRadius: 'var(--border-radius)'}} raised onClick={()=>{Navigate(`/admin/ComposantProgramme/${product.IDProgramme}`);}} className="m-2">Consulter</Button>
                  </div>
              </div>
          </div>
      );
  };
    /***************************** */
    const confirm2 = () => {
      confirmDialog({
          message: "L'adresse de début ne peut être supérieure à l'adresse de fin.",
          header: 'Attention',
          icon: 'pi pi-times-circle',
          acceptClassName: 'p-button-danger',
          footer: (props) => {
              const { accept, reject } = props;
    
              const handlereject = () => {
          
              };
    
              return (
                  <>
                      <Button style={{ color: 'var(--red-400)', borderRadius: 'var(--border-radius)'}} label="ok" icon="pi pi-times" className="p-button-text" onClick={handlereject} />
                  </>
              );
          },
      });
    };

    /*********************** */
    function addNewProg() {
      if(!newprog.date_debut || !newprog.date_fin)
      {
        setSubmitted(true)
      }
      else{
        if(newprog.date_fin<newprog.date_debut)
        confirm2()
      else
        fetch(addProgramme, {
          method: "POST",
          credentials: 'include',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Initialize 'token' before using it
          },
          body: JSON.stringify(newprog),
        })
          .then((reponse) => reponse.json())
          .then((data) => {
            if(data="true")
            {
              getAllProg()
              setaddDialog(false)
              accept()
            }
           })
          .catch((error) => {
            console.log("Error:", error);
          });
      }

    }

    /**************************** */
    const onInputChange = (e, name) => {
      const val = (e.target && e.target.value) || '';
      let _prog = { ... newprog };

      const originalDate = new Date(val);
      if (!isNaN(originalDate.getTime())) {
        // Ajoutez un jour à la date originale
        const newDate = new Date(originalDate);
        newDate.setDate(newDate.getDate() + 1);
  
        _prog[`${name}`] = newDate.toISOString().slice(0, 10);
        setnewprog(_prog);
    };
  }
const items = [
    {
      src: image1 ,
      altText: '',
      caption: ''
    },
    {
      src: image2,
      altText: '',
      caption: ''
    },
    {
      src: image3,
      altText: '',
      caption: ''
    },
    {
      src: image4 ,
      altText: '',
      caption: ''
    }
  ];

  const items2 = [
    {
      src: img1 ,
      altText: '',
      caption: ''
    },
    {
      src: img1,
      altText: '',
      caption: ''
    },
    {
      src: img1,
      altText: '',
      caption: ''
    },
    {
      src: img1 ,
      altText: '',
      caption: ''
    }
  ];


const ProgrammeDialogFooter = (
  <React.Fragment>
     <Button  icon="pi pi-times" style={{ color: '#fff',marginRight:"5px",backgroundColor: 'var(--red-400)', borderColor: 'var(--red-400)'}} label='Annuler'onClick={()=>{  setaddDialog(false);setnewprog({date_debut:"",date_fin:""})

setSubmitted(false);
}}/>
     <Button icon="pi pi-check" style={{ color: '#fff',backgroundColor: 'var(--green-400)', borderColor: 'var(--green-400)'}} label='Ajouter'onClick={()=>addNewProg()}/>
  </React.Fragment>
);
const hideDialog = () => {
  setaddDialog(false);setnewprog({date_debut:"",date_fin:""})

 setSubmitted(false);

};
const itemTemplate = (marche, layout) => {
  if (!marche) {
      return;
  }

  if (layout === 'list') return null;
  else if (layout === 'grid') return gridItem(marche);
};

return (
    <div className="content responsive mt-7" >
           <Toast ref={toast} />
        {/* <Card >   <img style={{height:'75px',display: 'flex'}}  src={BannerDGF}  /></Card> */}

        <Card style={{ height: "120px", width: "100%" }}>
      <ProgrammeCarousel items={items2} />
    </Card>

   <Card style={{ height: "40%" , width:'100%'}}>  
   <div className="flex flex-wrap gap-2 ">
      <Button raised label="Nouvelle tranche" style={{ backgroundColor: 'var(--green-400)', color: 'var(--primary-color-text)',borderColor:'var(--green-400)', borderRadius: 'var(--border-radius)',margin:'10px',marginLeft:'10px'}} icon="pi pi-plus" onClick={()=>setaddDialog(true)}/>
    </div>
   <DataView value={data} itemTemplate={itemTemplate} layout={layout} paginator rows={4}/> 
   </Card>
   <Card style={{ height: "100px", width: "100%" }}>
      <ProgrammeCarousel items={items} />
    </Card>

    <Dialog visible={addDialog} headerStyle={{ backgroundColor: 'var(--green-400)', height:"2rem",borderRadius:'20px',color:'#fff',marginBottom:'7px'}} style={{ width: '30rem'}} header='Ajouter un nouveau programme' footer={ProgrammeDialogFooter} breakpoints={{ '960px': '75vw', '641px': '90vw' }} onHide={hideDialog}>       
    <ConfirmDialog group="headless"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center pr-2 pl-2 pt-6 pb-3 surface-overlay border-round">
                        <div className="border-circle inline-flex justify-content-center align-items-center h-5rem w-5rem -mt-8" style={{ backgroundColor: 'var(--red-600)',color: 'var(--primary-color-text)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}>
                            <i className="pi pi-times-circle text-5xl" ></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-2" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-" ref={footerRef}>
                            <Button
                            style={{ backgroundColor: 'var(--green-500)',borderColor:'var(--green-400)' , borderRadius: 'var(--border-radius)'}}
                             
                                onClick={(event) => {
                                    hide(event);
                                    
                                }}
                                
                                className="w-8rem"
                            >ok</Button>
                       
                      
                        </div>
                    </div>
                )} />
              <Row>

              <Col>
      <label  htmlFor="dateD">Date début</label>
      <Calendar  
  id="datev"
  showIcon 
  dateFormat="yy"  // Afficher uniquement l'année
  view="year"  // Mode année
  yearNavigator  // Activer le sélecteur d'années
  yearRange="2020:2080"  // Définir une plage d'années
  className={classNames({ 'p-invalid': submitted && !newprog.date_debut })}
  onChange={(e) => onInputChange(e, 'date_debut')}
/>

       {submitted && !newprog.date_debut && <small className="p-error">Champ obligatoire !</small>}
      </Col>
      <Col>
      <label  htmlFor="datef">Date fin</label>
      <Calendar  
      dateFormat="dd/mm/yy"  id="datef" showIcon className={classNames({ 'p-invalid': submitted && !newprog.date_fin })} 
      onChange={(e) => onInputChange(e, 'date_fin')}/>
       {submitted && !newprog.date_fin && <small className="p-error">Champ obligatoire !</small>}
      </Col>
             
              
              </Row>
           
   
      </Dialog>
    </div>
)
}
