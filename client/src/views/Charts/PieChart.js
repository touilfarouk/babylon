import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import styles from "./Chart.module.css";
import { PieCharte } from "../../utils/APIRoutes";
import { Row, Col } from "reactstrap";
const PieCharts = (props) => {
  const [apiData, setApiData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (props.selectedLieuDit) {
      fetch(PieCharte, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedImpact: props.selectedLieuDit,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data received:", data);
          const labelsArray = data.map((item) => item.Intituler);
          const dataArray = data.map((item) => item.volumeTotal);
          setLabels(labelsArray);
          setData(dataArray);
          setApiData(data);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          // Handle errors here (e.g., setApiData([]) to clear previous data)
        });
    }
  }, [props.selectedLieuDit, token]);
  return (
    <div className={styles.container}>
      <Row>
        {labels.map((label, index) => (
          <Col key={index} md={label.length > 20 ? 8 : 4}>
            <div
              style={{
                fontSize: "12px",
                marginLeft: "5px",
                marginTop: "12px",
              }}
            >
              <strong>
                {label}:{" "}
                <span style={{ color: "#4caf50" }}>{data[index] + " %"}</span>
              </strong>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PieCharts;
