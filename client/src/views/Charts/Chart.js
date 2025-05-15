import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import styles from "./Chart.module.css";

const Chart = ({ chartType }) => {
  const lineChartData = {
    labels: ["July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        data: [1638870, 3621245, 6225763, 8137119, 9431691, 10266674],
        label: "Infected",
        borderColor: "#3333ff",
        fill: true,
        lineTension: 0.5,
      },
      {
        data: [35747, 64469, 97497, 121641, 137139, 147738],
        label: "Deaths",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        fill: true,
        lineTension: 0.5,
      },
    ],
  };
  const barChartData = {
    labels: ["July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        data: [1638870, 3621245, 6225763, 8137119, 9431691, 10266674],
        label: "Infected People",
        borderColor: "#3333ff",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        fill: true,
      },
      {
        data: [35747, 64469, 97497, 121641, 137139, 147738],
        label: "Deaths People",
        borderColor: "#ff3333",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        fill: true,
      },
    ],
  };
  const pieChartData = {
    labels: ["July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        data: [1638870, 3621245, 6225763, 8137119, 9431691, 10266674],
        label: "Infected People",
        backgroundColor: [
          "#B21F00",
          "#C9DE00",
          "#2FDE00",
          "#00A6B4",
          "#6800B4",
          "#ff6600",
        ],
        hoverBackgroundColor: [
          "#501800",
          "#4B5000",
          "#175000",
          "#003350",
          "#35014F",
          "#993d00",
        ],
      },
    ],
  };

  const lineChart = (
    <Line
      type="line"
      width={160}
      height={60}
      options={{
        title: {
          display: true,
          text: "COVID-19 Cases of Last 6 Months",
          fontSize: 20,
        },
        legend: {
          display: true,
          position: "top",
        },
      }}
      data={lineChartData}
    ></Line>
  );

  const barChart = (
    <Bar
      type="bar"
      width={130}
      height={50}
      options={{
        title: {
          display: true,
          text: "COVID-19 Cases of Last 6 Months",
          fontSize: 20,
        },
        legend: {
          display: true,
          position: "top",
        },
      }}
      data={barChartData}
    ></Bar>
  );

  const pieChart = (
    <Pie
      type="pie"
      width={130}
      height={50}
      options={{
        title: {
          display: true,
          text: "COVID-19 Cases of Last 6 Months",
          fontSize: 20,
        },
        legend: {
          display: true,
          position: "right",
        },
      }}
      data={pieChartData}
    ></Pie>
  );

  return (
    <div className={styles.container}>
      {chartType === 1 && lineChart}
      {chartType === 2 && barChart}
      {chartType === 3 && pieChart}
    </div>
  );
};

export default Chart;
