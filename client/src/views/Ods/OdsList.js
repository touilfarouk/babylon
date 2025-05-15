import React, { useState, useEffect } from "react";
import { getListOds, AddPhase } from "../../utils/APIRoutes";
import { useParams } from "react-router-dom";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from "primereact/button";
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Toolbar } from "primereact/toolbar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
function OdsList(props) {
const token = localStorage.getItem("token");
const [odslist,setodslist]=useState({})
const [layout, setLayout] = useState('grid');
  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
      <Button style={{backgroundColor: 'var(--orange-700)',borderColor:'var(--orange-700)'}} label="NOUVEAU ODS D'ARRET" icon="pi pi-plus"/>
  </div>
    );
  };
  function getAllOds() {
    fetch(getListOds, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id_tache:props.idtache})
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        setodslist(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  useEffect(() => {
    getAllOds();
  }, []);

  const getSeverity = (ods) => {
    switch (ods.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};
  const listItem = (ods) => {
    return (
        <div className="col-12">
            <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{ods.name}</div>
                        <Rating value={ods.rating} readOnly cancel={false}></Rating>
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-tag"></i>
                                <span className="font-semibold">{ods.category}</span>
                            </span>
                            <Tag value={ods.inventoryStatus} severity={getSeverity(ods)}></Tag>
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">${ods.price}</span>
                        <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={ods.inventoryStatus === 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
const gridItem = (ods) => {
    return (
        <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
            <div className="p-4 border-1 surface-border surface-card border-round">
                <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag"></i>
                        <span className="font-semibold">REF ODS : {ods.ref}</span>
                    </div>
                    <Tag style={{backgroundColor: 'var(--orange-700)'}} ></Tag>
                    <div className="flex align-items-center gap-2">
                    <i className="pi pi-calendar"></i>
                        <span className="font-semibold">Date début ODS : {ods.ref}</span>
                    </div>
                    <div className="flex align-items-center gap-2">
                    <i className="pi pi-calendar"></i>
                        <span className="font-semibold">Date fin ODS: {ods.ref}</span>
                    </div>
                   
                </div>
                <div className="flex flex-column align-items-center gap-3 py-3">
                
                    <div>
                    <div className="text-2xl font-bold">Détail </div>
                    <p>  &nbsp; &nbsp; {ods.motif_ods}</p>
                    </div>
                   
                    {/* <Rating value={ods.rating} readOnly cancel={false}></Rating> */}
                </div>
              
            </div>
        </div>
    );
};
const header = () => {
    return (
        <div className="flex justify-content-end">
            
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );
};
  const itemTemplate = (ods, layout) => {
    if (!ods) {
        return;
    }

    if (layout === 'list') return listItem(ods);
    else if (layout === 'grid') return gridItem(ods);
};
  return (
    <>
 <div className="content" >
 <div className="card">
 <Toolbar className="mb-4" left={rightToolbarTemplate()}></Toolbar>
            <DataView value={odslist} itemTemplate={itemTemplate} layout={layout} />
        </div>
</div>
    </>
  );
}

export default OdsList;
