
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import styles from "./Chart.module.css";
import { DoughnutChartDataProg } from "../../utils/APIRoutes";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const DoughnutChart = (props) => {
  const [ChartData, setChartData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    
      fetch(DoughnutChartDataProg, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idprog: props.idprog,
          buttonType:props.buttonType,
          type_marche:props.type_marche
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setChartData(data)
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    
  }, [props.detailMarche, token,props.buttonType]);

  const chartData = {
    labels: [
      
      props.buttonType?`${props.type_marche === "Etude" ? 'Taux des études terminées' : 'Taux des travaux terminés'}`:`${props.detailMarche.type_marche === "Etude" ? 'Taux des études payées' : 'Taux des travaux payés'}`,
      props.buttonType && `${props.type_marche === "Etude" ? 'Taux des études en cours' : 'Taux des travaux en cours'}`,
      props.buttonType? `${props.type_marche === "Etude" ? 'Taux des études non entamées' : 'Taux des travaux non entamés'}`:`${props.detailMarche.type_marche === "Etude" ? 'Taux des études non payées' : 'Taux des travaux non payés'}`,

  ].filter(Boolean), // Filtre pour ne pas ajouter d'étiquettes vides
  
    datasets:
    props.buttonType? [
      {
        label: 'Static Data',
        data: ChartData,
        backgroundColor: [
          'rgb(0, 128, 0,0.8)',
          'rgb(255, 150, 0,0.8)',
          'rgb(255, 0, 0,0.8)'
       
        ],
        borderColor: [
          'rgb(0, 128, 0,0.8)',
          'rgb(255, 165, 0)',
         'rgb(255, 0, 0)'
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ]: [
      {
        label: 'Static Data',
        data: ChartData,
        backgroundColor: [
          'rgb(0, 128, 0,0.8)',
          
          'rgb(255, 0, 0,0.8)'
       
        ],
        borderColor: [
          'rgb(0, 128, 0,0.8)',
           
          'rgb(255, 0, 0)'
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div style={{ position: "relative", height: "300px", width: "100%" }}>
    <Doughnut
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            bottom: 20,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              padding: 10,
              boxWidth: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return ` ${tooltipItem.raw}%`;
              },
            },
          },
        },
      }}
    />
  </div>
       
      
  );
};

export default DoughnutChart;
