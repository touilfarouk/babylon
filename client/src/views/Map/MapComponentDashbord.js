import React, { Component,useRef } from 'react';
import L from 'leaflet';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import {
  Row,
  Col
} from "reactstrap";
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers';
import green from './green.jpg';
import red from './red.jpg';
import orange from './orange.jpg';
import _ from 'lodash'; 
import { readGeoJson, getRealisationsDet, getPathGeo,getWilaya,getActionMarche,getCommune,getLieuDit } from '../../utils/APIRoutes';
import { Toast } from 'primereact/toast';

// Helper function for retrieving the token
const getToken = () => localStorage.getItem('token');

class MapComponent extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      wilaya: [],
      intAction: [],
      commune: [],
      localites: [],
      selectionFillter:[],
      selectedLieuDit: null,
      selectedCommune: null,
      selectedAction: null,
      selectedWilayaDash: null,
      wilayaliste: [],
      pathData: [],  // pathData is now part of the state
      loading: false, // For loading state
    };
    this.toast = React.createRef()
    this.fetchGeoAction = this.fetchGeoAction.bind(this);
  }

  // This lifecycle method runs when the component is first mounted
  async componentDidMount() {
    try {
      const { selectedMarche, struc } = this.props;
  
      if (selectedMarche) {
        const postBody = { selectedMarche };
        const pathData = await this.fetchAndSetGeoData(postBody);
        await this.fetchWilayas();
        await this.fetchActions(selectedMarche);
  
        if (!["DGF", "BNEDER", "MINISTRE", "SG", "DGPA"].includes(struc)) {
          await this.fetchCommune();
        }
  
        this.setState({ pathData }, () => {
          this.initializeMap(); // Initialize the map only after state is set
          this.fetchGeoAction();
          //this.addLegend();
        });
      } else {
        this.toast.current.show({
          severity: 'warn',
          summary: 'Aucun marché sélectionné',
          detail: 'Veuillez sélectionner un marché avant de continuer.',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error in componentDidMount:', error);
    }
  }
  

  // This lifecycle method is triggered when props or state are updated
  async componentDidUpdate(prevProps, prevState) {
    const { selectedMarche } = this.props;
    const jsonCompare = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  
    if (this.state.selectionFillter.length>0 && !jsonCompare(prevState.selectionFillter, this.state.selectionFillter)) {
      const postBody = { selectedMarche, selectionFilter: this.state.selectionFillter };
  
      // Fetch new data
      const pathData = await this.fetchAndSetGeoData(postBody);
      this.setState({ pathData }, () => {
        this.initializeMap(); // Reinitialize the map if selectedMarche changes
        this.fetchGeoAction();
      });

      if(this.state.selectedWilayaDash)
      {
        this.fetchGeoWilaya(this.state.selectedWilayaDash)
      }
      if(this.state.selectedCommune)
        {
          this.fetchGeoCommune(this.state.selectedCommune)
        }
    }
  
    // Handle changes in selectedMarche (but avoid unnecessary state updates)
    if (selectedMarche && selectedMarche !== prevProps.selectedMarche) {
      console.log('Selected Marche has changed, fetching path GeoJSON');
      const postBody = { selectedMarche };
      const pathData = await this.fetchAndSetGeoData(postBody);
  
      // Only set state if pathData has actually changed
      if (!_.isEqual(pathData, prevState.pathData)) {
        this.setState({ pathData }, () => {
          this.initializeMap(); // Reinitialize the map if selectedMarche changes
          this.fetchGeoAction();
        });
      }
    }
  }
  

  componentWillUnmount() {
    if (this.map) {
      this.map.remove(); // Remove the map instance to avoid memory leaks
      this.map = null; // Reset the map reference
    }
  }
  
  
//****************************************** */
// fillters
async fetchWilayas() {
  try {
    const { struc } = this.props; // Assuming struc is passed as a prop
    if (["DGF", "BNEDER", "MINISTRE", "SG", "DGPA"].includes(struc)) {
      const response = await fetch(getWilaya, {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const wilayaList = await response.json();
        this.setState({ wilaya: wilayaList.map((item) => ({ label: item.label, value: item.value })) });
      } else {
        console.error("Failed to fetch wilaya data:", response.status);
      }
    }
  } catch (error) {
    console.error("Error fetching wilaya data:", error);
  }
}


async fetchActions(selectedMarche) {
  try {

   
      const response = await fetch(getActionMarche, {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({idmarche:selectedMarche}),
      });

      if (response.ok) {
        const action = await response.json();
        this.setState({intAction:action});
      } else {
        console.error("Failed to fetch wilaya data:", response.status);
      }
    
  } catch (error) {
    console.error("Error fetching wilaya data:", error);
  }
}


async fetchCommune(wilaya) {
  try {
      const response = await fetch(getCommune, {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({wilaya_code:wilaya}),
      });

      if (response.ok) {
        const commune = await response.json();
        this.setState({commune:commune});
      } else {
        console.error("Failed to fetch wilaya data:", response.status);
      }
    
  } catch (error) {
    console.error("Error fetching wilaya data:", error);
  }
}

async fetchLocalites(commune) {
  try {
      const response = await fetch(getLieuDit, {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({map:true,selectedCommune:commune}),
      });

      if (response.ok) {
        const localites = await response.json();
        this.setState({localites:localites});
      } else {
        console.error("Failed to fetch wilaya data:", response.status);
      }
    
  } catch (error) {
    console.error("Error fetching wilaya data:", error);
  }
}



  // Helper method for fetching and updating the state with GeoJSON data
  async fetchAndSetGeoData(postBody) {
    try {
      const pathData = await this.fetchData(getPathGeo, 'POST', postBody);
      this.setState({ pathData });
      return pathData; // Return the fetched data
    } catch (error) {
      console.error('Error fetching path GeoJSON:', error);
    }
  }

  // Fetch data helper method
  async fetchData(url, method = 'GET', body = null) {
    const options = {
      method,
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Initialize the map with default settings and layers
  initializeMap() {
    if (this.map) {
      this.map.off();    // Remove all event listeners
      this.map.remove(); // Remove the map instance
      this.map = null;   // Reset the map reference
    }


    const map = L.map('map').setView([31.0099157, -2.1188163], 5);
    this.map = map;

    const googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    const googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });

    const baseMaps = {
      Terrain: googleTerrain,
      Satellite: googleSat,
    };
    L.control.layers(baseMaps).addTo(map);

    this.addBarrageVertLayer();
  }

  // Add the Barrage Vert GeoJSON layer to the map
  addBarrageVertLayer() {
    this.fetchData(readGeoJson, 'POST', { namefile: 'Barrage_vert.geojson' })
      .then((data) => {
        const geoJsonStyle = {
          color: '#83f34f',
          fillOpacity: 0.2,
        };

        // Add GeoJSON layer and fit to bounds
        const geoJsonLayer = L.geoJSON(data, { style: geoJsonStyle }).addTo(this.map);
        this.map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
        this.addLegend()
      })
      .catch((error) => {
        console.error('Error fetching Barrage Vert:', error);
      });
  }
  async fetchGeoAction() {
    const { pathData } = this.state;
  
    if (!pathData || pathData.length === 0) {
      console.log("No pathData to process.");
      return;
    }
  
    let combinedBounds = null;
  
    const redd = L.icon({
      iconUrl: red, // Remplacez par le chemin de votre icône
      iconSize: [25, 41], // Taille de l'icône
      iconAnchor: [12, 41], // Point d'ancrage de l'icône
      popupAnchor: [0, -41], // Position du popup par rapport à l'icône
    });
    const greenn = L.icon({
      iconUrl: green, // Remplacez par le chemin de votre icône
      iconSize: [25, 41], // Taille de l'icône
      iconAnchor: [12, 41], // Point d'ancrage de l'icône
      popupAnchor: [0, -41], // Position du popup par rapport à l'icône
    });
    const orangee = L.icon({
      iconUrl: orange, // Remplacez par le chemin de votre icône
      iconSize: [25, 41], // Taille de l'icône
      iconAnchor: [12, 41], // Point d'ancrage de l'icône
      popupAnchor: [0, -41], // Position du popup par rapport à l'icône
    });
    try {
      for (const value of pathData) {
        // Fetch Realisations Data
        let count = 0; // Valeur par défaut
        try {
          const response = await fetch(getRealisationsDet, {
            method: "POST",
            credentials: "include",
            cache: "no-cache",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ id_action_impactee: value.id_action_impactee }),
          });
          const data = await response.json();
          count = data; // Mettre à jour `count` à partir de la réponse API
        } catch (error) {
          console.error("Error fetching realisations:", error);
        }
  
        // Fetch and Process GeoJSON
        try {
          const geoJsonResponse = await fetch(readGeoJson, {
            method: "POST",
            credentials: "include",
            cache: "no-cache",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ namefile: value.chemin }),
          });
  
          const geoJsonData = await geoJsonResponse.json();
  
          if (
            [
              "REHABILITATION DE POINTS D'EAU PASTORAUX: MARES",
              "AMENAGEMENT DE SOURCE",
              "REALISATION DE MARE",
              "REHABILITATION DE POINTS D'EAU PASTORAUX: PUITS PASTORAUX",
              "EQUIPEMENT DE POINT D'EAU:FORAGE",
              "REALISATION DE POINTS D'EAU PASTORAUX: FORAGES PASTORAUX",
              "REHABILITATION DE POINTS D'EAU PASTORAUX: CEDS",
              "EQUIPEMENT DE POINT D'EAU",
              "REALISATION DE BASSIN (100 m3)",
              "TRAVAUX DE CONSERVATION DES EAUX ET DES SOLS",
            ].includes(value.action.trim())
          ) {
          
            geoJsonData.features.forEach((feature) => {
          
              if (feature.geometry.type === "Point") {
                const coordinates = feature.geometry.coordinates;
                let icon;

                if (count == 100) {
                    icon = greenn;
                } else if (count < 100 && count>0) {
                    icon = orangee;
                } else {
                    icon = redd;
                }
                // Ajouter un marqueur standard Leaflet
                L.marker([coordinates[1], coordinates[0]], { icon: icon })
                  .addTo(this.map)
                  .bindPopup(`
                    <strong>Wilaya:</strong> ${value.wilaya_name_ascii} <br/>
                    <strong>Commune:</strong> ${value.commune_name_ascii}<br/>
                    <strong>Localité:</strong> ${value.LOCALITES}
                    <strong>Action:</strong> ${value.action} <br/>
                    <strong>Taux d'avancement:</strong> ${count==null?0:count} %<br/>
                  `)
                  .openPopup();
              }
            });
          } else {
            // Définir le style GeoJSON en fonction de `count`
            let geoJsonStyle;
            if (count == 0 || count == null) {
              geoJsonStyle = { color: "#FF0000 ", fillOpacity: 0.6,   weight: 6  };
            } else if (count > 0 && count < 100) {
              geoJsonStyle = { color: "#FF8000", fillOpacity: 0.6 ,   weight: 6 };
            } else if (count == 100) {
              geoJsonStyle = { color: "#008000", fillOpacity: 0.6 ,   weight: 6};
            }
  
            const geoJsonLayer = L.geoJSON(geoJsonData, {
              style: geoJsonStyle,
            }).addTo(this.map);
  
            // Ajouter une popup au GeoJSON layer
            geoJsonLayer.bindPopup(`
              <strong>Wilaya:</strong> ${value.wilaya_name_ascii} <br/>
              <strong>Commune:</strong> ${value.commune_name_ascii}<br/>
              <strong>Localité:</strong> ${value.LOCALITES}
              <strong>Action:</strong> ${value.action} <br/>
              <strong>Taux d'avancement:</strong> ${count==null?0:count} %<br/>
            `);
  
            // Afficher automatiquement la popup
            geoJsonLayer.openPopup();
  
            // Étendre les bounds pour inclure cette couche
            const layerBounds = geoJsonLayer.getBounds();
            combinedBounds = combinedBounds
              ? combinedBounds.extend(layerBounds)
              : layerBounds;
          }
        } catch (geoJsonError) {
          console.error("Error fetching GeoJSON:", geoJsonError);
        }
      }
  
      // Ajuster la vue pour inclure toutes les couches
      if (combinedBounds) {
        this.map.fitBounds(combinedBounds, { padding: [20, 20] });
      }
    } catch (error) {
      console.error("Error processing wilaya data:", error);
    }
  }
  /*********************************fetch geo wilaya commne**************************** */
  async fetchGeoWilaya(wilaya_code) {
    this.fetchData(readGeoJson, 'POST', { namefile: `${wilaya_code}.geojson` })
    .then((data) => {
      const geoJsonStyle = {
        color: '#fddf3f',
        fillOpacity: 0.3,
      
      };

      // Add GeoJSON layer and fit to bounds
      const geoJsonLayer = L.geoJSON(data, { style: geoJsonStyle }).addTo(this.map);
      const geoJsonCenter = geoJsonLayer.getBounds().getCenter();
      this.map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
      this.map.setView(geoJsonCenter, this.map.getZoom() + 3);
   //   this.addLegend()
    })
    .catch((error) => {
      console.error('Error fetching Barrage Vert:', error);
    });
  }
 
  async fetchGeoCommune(value) {
    const {  commune } = this.state;
    console.log(commune)
    if (!commune || !Array.isArray(commune)) {
      console.error('commune is not defined or is not an array');
      return;
    }
  
    const result = commune.find(item => item.value === value);
  
    if (!result) {
      console.error(`No result found for value: ${value}`);
      return;
    }
  
    try {
      const data = await this.fetchData(readGeoJson, 'POST', { namefile: `${result.code}.geojson` });
  
      const geoJsonStyle = {
        color: '#004C99',
        fillOpacity: 0.3,
      };
  
      const geoJsonLayer = L.geoJSON(data, { style: geoJsonStyle }).addTo(this.map);
      const geoJsonCenter = geoJsonLayer.getBounds().getCenter();
      this.map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
      this.map.setView(geoJsonCenter, this.map.getZoom() +1);
     // this.addLegend();
    } catch (error) {
      console.error('Error fetching Barrage Vert:', error);
    }
  }
  

  /************************ */
  addLegend() {
    const legend = L.control({ position: 'bottomright' });
    const { type } = this.props;

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'rgba(112, 136, 137, 0.8)';
      div.style.padding = '5px';
      div.style.boxShadow = '5px 5px 8px rgba(0, 0, 0, 0.3)';
      div.style.borderRadius = '10px';
      div.style.color = '#fff';

      const legendContent = `
          <h5>Légende</h5>
            <p><span class="legend-color" style="background:#fddf3f; display: inline-block; height: 10px; width: 20px;"></span> Wilaya</p>
          <p><span class="legend-color" style="background:#004C99; display: inline-block; height: 10px; width: 20px;"></span> Commune</p>
          <p><span class="legend-color" style="background:red; display: inline-block; height: 10px; width: 20px;"></span> Réalisations non commencées</p>
          <p><span class="legend-color" style="background:#FF8000; display: inline-block; height: 10px; width: 20px;"></span>  En cours des réalisations</p>
          <p><span class="legend-color" style="background:#008000; display: inline-block; height: 10px; width: 20px;"></span>  Réalisations terminées</p>
        `
    

      div.innerHTML = legendContent;
      return div;
    };

    legend.addTo(this.map);
  }
/********************************************************** */



/********************************************************* */
  render() {
    const { loading } = this.state;
    const { visiblemap, setVisiblemap } = this.props;
    const { wilaya, intAction, commune, localites, selectedwilayaDash,selectedCommune, selectedAction, selectedLieuDit } = this.state;
    const footerContent = (
      <div>
        <Button
          icon="pi pi-arrow-left"
          label="Retour"
          onClick={() => setVisiblemap(false)}
          style={{ background: "var(--red-500)", borderColor: "var(--red-500)" }}
        />
      </div>
    );
    const headerMap = (
      <Row>
   
    
        <Col md="3">
          <Dropdown
     onChange={(e) => {
      this.setState((prevState) => {
        // Remove all items with the key 'action'
        const newSelectionFilter = prevState.selectionFillter.filter(
          (item) => !item.hasOwnProperty('action') // Remove all items with the key 'action'
        );
  
        // Add the new action to the array
        newSelectionFilter.push({ action: e.value });
  
        return {
          selectedAction: e.value,
          selectionFillter: newSelectionFilter, // Update the state with the new array
        };
      });
    }}
          value={this.state.selectedAction}
            invalid
           
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
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow
            }}
            className="w-100"
          />
        </Col>
    
        <Col md="3">
          <Dropdown
            invalid
            options={wilaya}
            optionLabel="label"
            value={this.state.selectedWilayaDash}
            onChange={(e) =>
              this.setState(
                (prevState) => {
                  // Filter out all items that have the key 'wilaya'
                  const newSelectionFilter = prevState.selectionFillter.filter(
                    (item) => !item.hasOwnProperty('wilaya') // Remove all items with the key 'wilaya'
                  );
            
                  // Add the new wilaya to the array
                  newSelectionFilter.push({ wilaya: e.value });
            
                  return {
                    selectedWilayaDash: e.value,
                    selectionFillter: newSelectionFilter, // Update the state with the new array
                  };
                },
                () =>{ this.fetchCommune(e.value);this.fetchGeoWilaya(e.value) }// Callback after state update
               
              )
            }
            
            
            placeholder={
              wilaya && wilaya.length === 0
                ? "Aucune wilaya disponible"
                : "Sélectionner la wilaya"
            }
            style={{
              borderWidth: "0px",
              borderColor: "black",
              color: "black",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow
            }}
            className="w-100"
          />
        </Col>

        <Col md="3">
          <Dropdown
            invalid
            options={
              commune
            }
            onChange={(e) =>
              this.setState(
                (prevState) => {
                  // Remove all items with the key 'commune'
                  const newSelectionFilter = prevState.selectionFillter.filter(
                    (item) => !item.hasOwnProperty('commune') // Remove all items with the key 'commune'
                  );
          
                  // Add the new commune to the array
                  newSelectionFilter.push({ commune: e.value });
          
                  return {
                    selectedCommune: e.value,
                    selectionFillter: newSelectionFilter, // Update the state with the new array
                  };
                },
                () => {this.fetchLocalites(e.value);this.fetchGeoCommune(e.value)} // Callback after state update
              )
            }
            optionLabel="label"
            value={selectedCommune}
            placeholder={
              commune.communes && commune.communes.length === 0
                ? "Aucune commune disponible"
                : "Sélectionnez la commune"
            }
            style={{
              borderWidth: "0px",
              borderColor: "black",
              color: "black",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow
            }}
            className="w-100"
          />
        </Col>
    
        <Col md="3">
          <Dropdown
            invalid
            options={
              localites.lieuDit && localites.lieuDit.length > 0
                ? localites.lieuDit.map((lieuditItem) => ({
                    label: lieuditItem.LOCALITES,
                    value: lieuditItem.LOCALITES,
                  }))
                : []
            }
            optionLabel="label"
            value={selectedLieuDit}
            onChange={(e) =>
              this.setState(
                (prevState) => {
                  // Remove all items with the key 'localite'
                  const newSelectionFilter = prevState.selectionFillter.filter(
                    (item) => !item.hasOwnProperty('localite') // Remove all items with the key 'localite'
                  );
          
                  // Add the new localite to the array
                  newSelectionFilter.push({ localite: e.value });
          
                  return {
                    selectedLieuDit: e.value,
                    selectionFillter: newSelectionFilter, // Update the state with the new array
                  };
                }
              )
            }
            placeholder={
              localites.lieuDit && localites.lieuDit.length === 0
                ? "Aucune localité disponible"
                : "Sélectionnez la localité"
            }
            style={{
              borderWidth: "0px",
              borderColor: "black",
              color: "black",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Shadow
            }}
            className="w-100"
          />
        </Col>
      </Row>
    );
    return (
      <div>
          
      <Dialog
      header={headerMap}
      footer={footerContent}
      visible={visiblemap}
      style={{ width: "70vw" }}
      onHide={() => setVisiblemap(false)}
      >  
         <Toast ref={this.toast} />
        <div>
   
          {loading ? <div>Chargement...</div> : <div id="map" style={{ height: "600px" }} />}
        </div>
      </Dialog>
      </div>
 
    );
  }
}

export default MapComponent;
