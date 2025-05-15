import React, { useState,useEffect } from "react";
import {getCpt,updateCpt} from '../../utils/APIRoutes';
import AddCpt from "./AddCpt";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { CustomInput } from "reactstrap";
import { IoIosBrush, IoIosCut,IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';
import { InputNumber } from 'primereact/inputnumber';
const DetailCpt = (props) => {

    const [isEditedCpt, setIsEditedCpt] = useState(false);
    const [editedCpt, setEditedCpt] = useState(null);
    const [editedData, setEditedData] = useState({});
    const token = localStorage.getItem("token");
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };
    const editCpt = (taskId) => {
        setIsEditedCpt(true);
        setEditedCpt(taskId);
        const taskToEdit = props.cpt.taches.find(item => item.id_tache === taskId);
        setEditedData({...taskToEdit });
    };

    const cancelEdit = () => {
        setIsEditedCpt(false);
        setEditedCpt(null);
        setEditedData({});
    };

    const UpdateCpt = () => {
        fetch(updateCpt, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Initialize 'token' before using it
            },
            body: JSON.stringify(editedData)})
            .then((reponse) => reponse.json())
            .then((data) => {
                if(data.rep ==="true")
              {
                props.getAllCpt()
                setIsEditedCpt(false);
                setEditedCpt(null);
                setEditedData({});
                props.setCpt((prevCpt) => ({
                    ...prevCpt,
                    taches: prevCpt.taches.map((tache) =>
                        tache.id_tache === data.cpt.id_tache ? data.cpt : tache
                    ),
                }));
          
           
             }
           
            })
            .catch((error) => {
              console.log("Error:", error);
            });
      
    };
    const DialogFooter = (
        <React.Fragment>
        <Button
          label="Retour" raised
          icon="pi pi-replay"
          onClick={()=>{props.setshowCpt(false)}}
          outlined
          style={{ color: 'var(--red-400)',borderColor:'var(--red-400)'}}
        />
      
      </React.Fragment>
    );
    return (
        <>
            <Dialog  footer={DialogFooter}
             headerStyle={{ backgroundColor: 'var(--green-200)', height:"4rem",borderRadius:'20px',color:'#fff',marginBottom:'7px'}}
            header="Cahier de prescriptions techniques" visible={props.showCpt} style={{ width: '52vw' }} onHide={() => props.setshowCpt(false)}>
                <div className="col-12 sm:col-12 lg:col-12 xl:col-12 p-2">
                    <div className="p-2 border-3 surface-border surface-card border-round">
                        <div className="flex flex-column align-items-center justify-center gap-1 py-2">
                         
                            <div>
                                <center className="text-2xl" style={{ backgroundColor: 'var(--orange-50)', borderRadius: 'var(--border-radius)' }}> Ministère del’Agriculture et de Développement Rural </center>
                                <br />
                                <center className="text-2xl p-1 text-center" style={{ backgroundColor:'var(--primary-50)', borderRadius: 'var(--border-radius)' }}>
                                    Cahier de prescriptions techniques de <span style={{ fontSize: '20px' }}><i>{props.cpt.action[0].action}</i></span>
                                </center>
                                <div className="text-xl p-2">
                                <div className="text-xl p-2">
                                <b>WILAYA : </b> {props.cpt.Wilaya} <br/>  
    <b>COMMUNES /LOCALITES : </b> <br/>
    {props.cpt.LocalitesGroup.split(', ').map((commune, index) => (
        <span key={index}>
            <b>{commune.split(': ')[0]}</b>: {commune.split(': ')[1]}
            {index < props.cpt.LocalitesGroup.split(', ').length - 1 && ', '}
        </span>
    ))}
</div>


                                    <div>
                                        
                                        <br />
                                        <p><u>BORDEREAU DES PRIX UNITAIRES DES TRAVAUX</u></p>
                                       
                                        <table className="table table-bordered" style={{ fontSize: '14px', border: '1px solid #ddd' }}>
                                            <thead style={{ backgroundColor: 'var(--green-100)', borderRadius: 'var(--border-radius)' }}>
                                                <tr>
                                                    <th style={{ padding: '8px' }}>Phase</th>
                                                    <th style={{ padding: '8px' }}>Désignation des ouvrages</th>
                                                    <th style={{ padding: '8px' }}>Unité</th>
                                                    <th style={{ padding: '8px' }}>Prix unitaire</th>
                                                    <th style={{ padding: '8px' }}>  &nbsp; Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.cpt.taches.map((item, index) => {
                                                    const isEdited = editedCpt && item.id_tache === editedCpt.id_tache;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.num_phase}</td>
                                                            <td>
                                                                {isEdited ? (
                                                                    <InputText
                                                                        type="text"
                                                                        name="intitule_tache"
                                                                        value={editedData.intitule_tache || ''}
                                                                        onChange={(e)=>handleInputChange(e)}
                                                                    />
                                                                ) : (
                                                                    item.intitule_tache
                                                                )}
                                                            </td>
                                                            <td>
                                                                {isEdited ? (
                                                                    <CustomInput
                                                                        style={{ border: 'none', backgroundColor: 'aliceblue' }}
                                                                        id="roles"
                                                                        name="unite_tache"
                                                                        type="select"
                                                                        value={editedData.unite_tache || ''}
                                                                        onChange={(e)=>handleInputChange(e)}
                                                                    >
                                                                        <option value="" disabled>--Sélectionner--</option>
                                                                        <option value="U">U</option>
                                                                        <option value="HA">HA</option>
                                                                        <option value="KM">KM</option>
                                                                        <option value="M3">M3</option>
                                                                        <option value="MI">MI</option>
                                                                    </CustomInput>
                                                                ) : (
                                                                    item.unite_tache
                                                                )}
                                                            </td>        
                                                            <td>
                                                                {isEdited ? (
                                                                    <InputNumber mode="decimal" minFractionDigits={2}
                                                                        type="text"
                                                                        name="prix_ht_tache"
                                                                        value={editedData.prix_ht_tache || ''}
                                                                        onValueChange={(e)=>handleInputChange(e)}
                                                                    />
                                                                ) : (
                                                                    item.prix_ht_tache
                                                                )}
                                                            </td>
                                                            <td className="text-right">
                                                                {isEdited ? (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="btn-round"
                                                                            style={{ padding: '6px 7px', fontSize: '12px', background: '#2A9D8F', cursor: 'pointer', border: 'none', color: 'white' }}
                                                                            onClick={()=>UpdateCpt(item)}
                                                                        >
                                                                            <IoIosCheckmarkCircle />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn-round"
                                                                            style={{ padding: '6px 7px', fontSize: '12px', background: '#DE2E4B', cursor: 'pointer', border: 'none', color: 'white' }}
                                                                            onClick={cancelEdit}
                                                                        >
                                                                            <IoIosCloseCircle />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="btn-round"
                                                                            style={{ padding: '6px 7px', fontSize: '12px', backgroundColor: 'var(--primary-300)',marginRight:'5px', cursor: 'pointer', border: 'none', color: 'white' }}
                                                                            onClick={() => {editCpt(item);setEditedData(item)}}
                                                                        >
                                                                            <IoIosBrush />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn-round"
                                                                            style={{ padding: '6px 7px', fontSize: '12px', background: '#DE2E4B', cursor: 'pointer', border: 'none', color: 'white' }}
                                                                        >
                                                                            <IoIosCut />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>

        </>
    );
};

export default DetailCpt;