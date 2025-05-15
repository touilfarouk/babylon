import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styles from "./Chart.module.css";

const LineChart = () => {
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
  const calculatePercentages = (value, total) => {
    if (total > 0) {
      return ((value / total) * 100).toFixed(2);
    }
    return 0;
  };

  const lineChartData = {
    labels: ["July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        data: [
          calculatePercentages(apiData?.etat_pre_c || 0, apiData?.total || 1),
          calculatePercentages(apiData?.etat_exc_c || 0, apiData?.total || 1),
          calculatePercentages(apiData?.etat_fais_c || 0, apiData?.total || 1),
        ],
        label: "Status 'en cours' (Percentage)",
        borderColor: "#3333ff",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: [
          calculatePercentages(apiData?.etat_pre || 0, apiData?.total || 1),
          calculatePercentages(apiData?.etat_exc || 0, apiData?.total || 1),
          calculatePercentages(apiData?.etat_fais || 0, apiData?.total || 1),
        ],
        label: "Status 'levée' (Percentage)",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        fill: true,
        lineTension: 0.5,
      },
    ],
  };

  const lineChart = (
    <Line
      type="line"
      width={160}
      height={40}
      options={{
        title: {
          display: true,
          text: "COVID-19 Cases of Last 6 Months (Percentage)",
          fontSize: 20,
        },
        legend: {
          display: true,
          position: "top",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          ],
        },
      }}
      data={lineChartData}
    ></Line>
  );

  return <div className={styles.container}>{lineChart}</div>;
};

export default LineChart;
