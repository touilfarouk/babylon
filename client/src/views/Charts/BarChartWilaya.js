import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import styles from "./Chart.module.css";
import { realiationBarChartwilaya } from "../../utils/APIRoutes";

const BarChartWilaya = (props) => {
  const [apiData, setApiData] = useState(null);
  const token = localStorage.getItem("token");
  //..
  useEffect(() => {
    fetch(realiationBarChartwilaya, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        selectedwilaya: props.selectedwilaya,
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
  }, [ props.selectedwilaya,props.detailMarche,props.buttonType]);
  //..
  const barChartData = {
    labels: apiData?.map((item) => item.wilaya) || [],
    datasets: [
      {
        label: "Taux de réalisation des actions dans la wilaya selectionnée sélectionnée %",
        backgroundColor: "#008000",
        data: apiData?.map((item) => item.volumeTotal) || [],
      },
    ],
  };
  const barChartOptions = {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "Status des études (en pourcentage)",
      fontSize: 14,
    },
    legend: {
      display: true,
      position: "top",
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
  const barChart = (
    <div className={styles.chartContainer} style={{ height: 280, width: 750 }}>
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
  return <div className={styles.container}>{barChart}</div>;
};

export default BarChartWilaya;
