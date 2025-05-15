
import React, { Component, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import 'leaflet.awesome-markers';
import { readGeoJson,getRealisationsDet} from '../../utils/APIRoutes';

class MapComponent extends Component {
  async componentDidMount() {
    const token = localStorage.getItem('token');
    // Fetch Realisations Data
    try {
      const response = await fetch(getRealisationsDet, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_action_impactee: `${this.props.data.id_action_impactee}` }),
      });
      const data = await response.json();
      this.setState({ count: data }, () => {
        // After setting count, initialize the map
        this.initializeMap();
      });
    } catch (error) {
      console.log('Error fetching realisations:', error);
    }
  }
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      count: null
    };
  }
  initializeMap() {
    const token = localStorage.getItem('token');
    

    const map = L.map('map').setView([31.0099157, -2.1188163], 5);
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    const googleTerrain = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );
    googleTerrain.addTo(map);

    // Satelite Layer
    const googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    });

    const baseMaps = {
      OpenStreetMap: googleTerrain,
      Satilite: googleSat,
    };
    L.control.layers(baseMaps).addTo(map);
    /*********************************************** */
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      
      // Set the background color
      div.style.backgroundColor = 'rgb(112,136,137 , 80%)'; // replace 'your_desired_color' with the color you want
      div.style.padding  = '5px';
      div.style.boxShadow = '5px 5px 8px rgba(0, 0, 0, 0.3)';
      div.style.borderRadius = '10px';
      div.style.color = '#fff'; 
      // Add legend content here
      if(this.props.type==="updateR" || this.props.type==="real")
        {  
       div.innerHTML = `
      <h5> Légende </h5>
     
      <p><span class="legend-color" style="background:#004C99; display: inline-block; height: 10px; width: 20px;"></span><span>   Commune</span></p>
      <p><span class="legend-color" style="background:red ; display: inline-block; height: 10px; width: 20px;"></span><span>  Localité de l'action (Réalisations non commencées)</span></p>
      <p><span class="legend-color" style="background:#FF8000 ; display: inline-block; height: 10px; width: 20px;"></span><span>  Localité de l'action (En cours des réalisations)</span></p>
      <p><span class="legend-color" style="background:#008000 ; display: inline-block; height: 10px; width: 20px;"></span><span>  Localité de l'action (Réalisations terminées)</span></p>
    `;}
    else 
    {
      div.innerHTML = `
      <h5> Légende </h5>
      <p><span class="legend-color" style="background:#004C99; display: inline-block; height: 10px; width: 20px;"></span><span>   Commune</span></p>
      <p><span class="legend-color" style="background:red ; display: inline-block; height: 10px; width: 20px;"></span><span>  Localité de l'action (Les études non commencées)</span></p>
      <p><span class="legend-color" style="background:#FF8000 ; display: inline-block; height: 10px; width: 20px;"></span><span>  Localité de l'action (Études en cours)</span></p>
      <p><span class="legend-color" style="background:#008000 ; display: inline-block; height: 10px; width: 20px;"></span><span>  Localité de l'action (Études terminées et validées)</span></p>
    `;
    }
 
    
/** <p ><span class="legend-color" style="background: #00FF00; display: inline-block; height: 10px; width: 20px;></span><span>  Barrage vert</span></p> */
    
      return div;
    };
    legend.addTo(map);
  
    /************************************************* */
    
/*********************************************************/
      fetch(readGeoJson, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ namefile: "Barrage_vert.geojson" }),
      })
        .then((response) => response.json())
        .then((data) => {
          const geoJsonStyle = {
            color: '#00FF00',
            fillOpacity: 0.1,
          };
          const geoJsonLayer = L.geoJSON(data, {
            style: geoJsonStyle,
          }).addTo(map); 
  
        })
        .catch((error) => {
          console.log('Error:', error);
        });
        /****************************************************************************************** */
        fetch(readGeoJson, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ namefile:`${this.props.data.commune_code}.geojson`} ),
        })
          .then((response) => response.json())
          .then((data) => {
            const geoJsonStyle = {
              color: '#004C99',
              fillOpacity: 0.08,
            };
            const geoJsonLayer = L.geoJSON(data, {
              style: geoJsonStyle,
            }).addTo(map);
            const geoJsonCenter = geoJsonLayer.getBounds().getCenter();
            // Fit the map bounds to the extent of the GeoJSON layer
            map.fitBounds(geoJsonLayer.getBounds());
          //  map.setView(geoJsonCenter, map.getZoom() - 2.5);
          })
          .catch((error) => {
            console.log('Error:', error);
          });
  
     // /***************************************************************************************** */
     if( this.props.data.chemin)  
    {  fetch(readGeoJson, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ namefile: this.props.data.chemin }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (this.props.data.action === `REHABILITATION DE POINTS D'EAU PASTORAUX: MARES`||this.props.data.action === `AMENAGEMENT DE SOURCE`||this.props.data.action === `REALISATION DE MARE`||this.props.data.action === `REHABILITATION DE POINTS D'EAU PASTORAUX: PUITS PASTORAUX` || this.props.data.action === `EQUIPEMENT DE POINT D'EAU:FORAGE` || this.props.data.action === `REALISATION DE POINTS D'EAU PASTORAUX: FORAGES PASTORAUX`|| this.props.data.action === `REHABILITATION DE POINTS D'EAU PASTORAUX: CEDS` || this.props.data.action === `	
          EQUIPEMENT DE POINT D'EAU` || this.props.data.action === `REALISATION DE BASSIN (100 m3)` || this.props.data.action === `TRAVAUX DE CONSERVATION DES EAUX ET DES SOLS`) {
            data.features.forEach((feature) => {
              const coordinates = feature.geometry.coordinates;
          
              var redMarker = L.AwesomeMarkers.icon({
                  markerColor: 'blue'
              });
          
              // Add the marker to the map
              L.marker([coordinates[1],coordinates[0]], {icon: redMarker}, {alt: 'Kyiv'}).addTo(map).bindPopup(this.props.data.action );;
          
          });
          } else {
            // Add a GeoJSON layer to the map
            let   geoJsonStyle ; 
            if(this.props.type==="updateR" || this.props.type=="real")
              {
                if( this.state.count===0 || this.state.count === null) {
                  geoJsonStyle = {
                   color: 'red',
                   fillOpacity: 0.6,
                 };
               }
               if( this.state.count > 0 && this.state.count < 100 ) {
                 geoJsonStyle = {
                  color: '#FF8000',
                  fillOpacity: 0.6,
                };
              }
              if( this.state.count === 100 ) {
               geoJsonStyle = {
                color: '#008000',
                fillOpacity: 0.6,
              };
               }
              }
             else{
             
               if((this.props.etude).length === 0)
                {
                  geoJsonStyle = {
                    color: 'red',
                    fillOpacity: 0.6,
                  };
                }
                else if( this.props.etude.length > 0 ) {
                  const exist = this.props.etude.every(item => item.date_validation);
                  if(exist) {
                    geoJsonStyle = {
                      color: '#008000',
                      fillOpacity: 0.6,
                    };
                   }
                   else{ 
                    geoJsonStyle = {
                    color: '#FF8000',
                   fillOpacity: 0.6,
                   };
                  }
                  
                     }
              }
              const geoJsonLayer = L.geoJSON(data, {
                style: geoJsonStyle,
              }).addTo(map);
              map.fitBounds(geoJsonLayer.getBounds());
               map.setZoom(map.getZoom() - 3);
          }
        })
        .catch((error) => {
          console.log('Error:', error);
        });}

  }

  render() {
    return <div id="map" style={{ height: '600px' }}></div>;
  }
}

export default MapComponent;






// const MapComponent = (props) => {
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const mapContainer = document.getElementById('map');
//     if (mapContainer && !mapContainer._leaflet_id) {
//      var map = L.map('map').setView([31.0099157, -2.1188163], 5);
//       const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     });
//     const googleTerrain = L.tileLayer(
//       "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
//       {
//         maxZoom: 20,
//         subdomains: ["mt0", "mt1", "mt2", "mt3"],
//       }
//     );
//     googleTerrain.addTo(map);
//     // Satelite Layer
//     var googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
//       maxZoom: 20,
//       subdomains: ["mt0", "mt1", "mt2", "mt3"],
//     });
//     const baseMaps = {
//       OpenStreetMap_France: googleTerrain,
//       Satilite: googleSat,
//     };
//     L.control.layers(baseMaps).addTo(map);
//     /******************************************* */
//     const legend = L.control({ position: 'topleft' });
//     legend.onAdd = function () {
//       const div = L.DomUtil.create('div', 'info legend');
//       // Add legend content here
//       div.innerHTML = '<p>Legend Content Here</p>';
//       return div;
//     };
//     legend.addTo(map);
//     /************************************************************** */
//     fetch(readGeoJson, {
//       method: 'POST',
//       credentials: 'include',
//       cache: 'no-cache',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ namefile:`algerie.geojson`} ),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         const geoJsonStyle = {
//           color: '#E2E9C0',
//           fillOpacity: 0.2,
//         };
      
//         const geoJsonLayer = L.geoJSON(data, {
//           style: geoJsonStyle,
//         }).addTo(map);
//         const geoJsonCenter = geoJsonLayer.getBounds().getCenter();
//         map.fitBounds(geoJsonLayer.getBounds());
//        map.setView(geoJsonCenter, map.getZoom() + 2.5);
//       })
//       .catch((error) => {
//         console.log('Error:', error);
//       });
//       /******************************************************************************** */
//       fetch(readGeoJson, {
//         method: 'POST',
//         credentials: 'include',
//         cache: 'no-cache',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ namefile: "Barrage_vert.geojson" }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           const geoJsonStyle = {
//             color: 'green',
//             fillOpacity: 0.3,
//           };
//           const geoJsonLayer = L.geoJSON(data, {
//             style: geoJsonStyle,
//           }).addTo(map); 
  
//         })
//         .catch((error) => {
//           console.log('Error:', error);
//         });
//         /****************************************************************************************** */
//         fetch(readGeoJson, {
//           method: 'POST',
//           credentials: 'include',
//           cache: 'no-cache',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ namefile:`${props.data.wilaya_code}.geojson`} ),
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             const geoJsonStyle = {
//               color: 'red',
//               fillOpacity: 0.2,
//             };
  
          
//             const geoJsonLayer = L.geoJSON(data, {
//               style: geoJsonStyle,
//             }).addTo(map);
//             const geoJsonCenter = geoJsonLayer.getBounds().getCenter();
//             // Fit the map bounds to the extent of the GeoJSON layer
//             map.fitBounds(geoJsonLayer.getBounds());
//             map.setView(geoJsonCenter, map.getZoom() + 2.5);
//           })
//           .catch((error) => {
//             console.log('Error:', error);
//           });
  
//      // /***************************************************************************************** */
      
//       fetch(readGeoJson, {
//         method: 'POST',
//         credentials: 'include',
//         cache: 'no-cache',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ namefile: props.data.chemin }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           // Assuming "map" is your Leaflet map instance
      
//           if (props.data.action === `EQUIPEMENT DE POINT D'EAU:FORAGE`) {
//             const coordinates = data.features[0].geometry.coordinates[0][0]; // Assuming MultiLineString, adjust if needed

//             const marker = L.marker(coordinates).addTo(map);
//           } else {
//             // Add a GeoJSON layer to the map
//             const geoJsonStyle = {
//               color: 'red',
//               fillOpacity: 0.5,
//             };
//             const geoJsonLayer = L.geoJSON(data, {
//               style: geoJsonStyle,
//             }).addTo(map);
      
//             // Fit the map bounds to the extent of the GeoJSON layer
//             map.fitBounds(geoJsonLayer.getBounds());
//              map.setZoom(map.getZoom() - 3);
//           }
//         })
//         .catch((error) => {
//           console.log('Error:', error);
//         });
//         /********************************************************************************************* */


//     }
//   }, [token, props.data]);

//   return <div id="map" style={{ height: '600px' }}></div>;
// };

// export default MapComponent;
