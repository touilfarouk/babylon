import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import styles from "../../General.module.css";
import { Barcharts } from "../../utils/APIRoutes";

const BarChart = (props) => {
  const [apiData, setApiData] = useState(null);
  const token = localStorage.getItem("token");
  //..

  useEffect(() => {
    
    fetch(Barcharts, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        selectedMarche: props.detailMarche,
        buttonType: props.buttonType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setApiData(data);
        } else {
          setApiData(null);
          console.log("ApiData", apiData);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [props.detailMarche, token, props.buttonType]);
  //..
  const barChartData = {
    labels: apiData?.map((item) => item.wilaya) || [],
    datasets: props.buttonType
      ? [
          {
            label: "Taux des travaux terminés %",
            backgroundColor: "#008000",
            data: apiData?.map((item) => item.tauxTermine) || [],
          },
          {
            label: "Taux des travaux non entamés %",
            backgroundColor: "red",
            data: apiData?.map((item) => item.tauxNonCom) || [],
          },
          {
            label: "Taux des travaux en cour %",
            backgroundColor: 'rgb(255, 165, 0)',
            data: apiData?.map((item) => item.tauxEnCour) || [],
          },
        ]
      : [
          {
            label: "Taux des travaux payés %",
            backgroundColor: "#008000",
            data: apiData?.map((item) => item.tauxDebut) || [],
          },
          {
            label: "Taux des travaux non payés %",
            backgroundColor: "red",
            data: apiData?.map((item) => item.tauxFin) || [],
          }
        ],
  };
  
  //..
  const barChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: "Status des études (en pourcentage)",
        fontSize: 14,
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        max: 100, // Y-axis goes up to 100
        ticks: {
          stepSize: 20, // Set step size to 20
          callback: function (value) {
            return value + "%"; // Add '%' symbol to the labels
          },
        },
      },
    },
  };
  
  
  //..
  const barChart = (
    <div className={styles.chartContainer} style={{ height: 300, width: 500 }}>
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
  return <div className={styles.container}>{barChart}</div>;
};

export default BarChart;
