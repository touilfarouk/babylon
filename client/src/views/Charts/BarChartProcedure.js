import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale, // Import the CategoryScale
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "../../General.module.css";

// Register the necessary components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = (props) => {
  const [apiData, setApiData] = useState(props.procedureConsultationWilaya);

  const barChartData = {
    labels: apiData?.map((item) => item.wilaya_name_ascii) || [],
    datasets: [
      {
        label: "Nombre des cahier des charges",
        backgroundColor: "#288DFF",
        data: apiData?.map((item) => item.cahiercharge) || [],
      },
      {
        label: "Nombre des appeles d'offres",
        backgroundColor: "#44BF48",
        data: apiData?.map((item) => item.appeloffre) || [],
      },
      {
        label: "Nombre des attributions",
        backgroundColor: "#FF9B04",
        data: apiData?.map((item) => item.attribution) || [],
      },
      {
        label: "Nombre des contrats",
        backgroundColor: "#F8FF04",
        data: apiData?.map((item) => item.contrat) || [],
      },
    ],
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: "Status des études (en pourcentage)",
        font: { size: 14 },
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
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}`,
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer} style={{ height: 320, width:1300}}>
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default BarChart;
