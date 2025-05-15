import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import styles from "../../General.module.css";

const RadarChart = () => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost/bv/api_dashboard.php")
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Calculate percentages relative to the total 'resultats1'
  const calculatePercentages = (value) => {
    if (apiData && apiData.total > 0) {
      return ((value / apiData.total) * 100).toFixed(2);
    }
    return 0;
  };

  const radarChartData = {
    labels: ["Preparation", "Execution", "Fesabilité"],
    datasets: [
      {
        label: "Status 'en cours' (Percentage)",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderColor: "rgba(0, 0, 255, 1)",
        pointBackgroundColor: "rgba(0, 0, 255, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(0, 0, 255, 1)",
        data: [
          calculatePercentages(apiData?.etat_pre_c || 0),
          calculatePercentages(apiData?.etat_exc_c || 0),
          calculatePercentages(apiData?.etat_fais_c || 0),
        ],
      },
      {
        label: "Status 'levée' (Percentage)",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderColor: "rgba(255, 0, 0, 1)",
        pointBackgroundColor: "rgba(255, 0, 0, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 0, 0, 1)",
        data: [
          calculatePercentages(apiData?.etat_pre || 0),
          calculatePercentages(apiData?.etat_exc || 0),
          calculatePercentages(apiData?.etat_fais || 0),
        ],
      },
    ],
  };

  const radarChart = (
    <Radar
      type="radar"
      width={130}
      height={50}
      options={{
        title: {
          display: true,
          text: "Status of Etudes (Percentage)",
          fontSize: 20,
        },
        legend: {
          display: true,
          position: "top",
        },
        scale: {
          ticks: {
            beginAtZero: true,
          },
        },
      }}
      data={radarChartData}
    ></Radar>
  );

  return <div className={styles.container}>{radarChart}</div>;
};

export default RadarChart;
