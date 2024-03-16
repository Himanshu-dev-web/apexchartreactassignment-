import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const ChartComponent = () => {
  // Simplified state initialization
  const [options, setOptions] = useState({
    chart: { id: "basic-bar" },
    xaxis: { categories: [] },
  });
  const [series, setSeries] = useState([{ name: "requests", data: [] }]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://checkinn.co/api/v1/int/requests")
      .then((response) => {
        const { requests } = response.data;
        if (!requests) {
          console.log("No data available");
          return;
        }
        // Directly process data here inside the promise resolution.
        const processedData = processChartData(requests);
        updateChart(processedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
      });
  }, []); // Empty dependency array ensures this effect runs once after initial render

  const processChartData = (data) => {
    const requestCounts = {};
    data.forEach((request) => {
      const hotelName = request.hotel.name;
      requestCounts[hotelName] = (requestCounts[hotelName] || 0) + 1;
    });

    const categories = Object.keys(requestCounts);
    const counts = Object.values(requestCounts);

    return { categories, counts };
  };

  const updateChart = ({ categories, counts }) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: { categories },
    }));

    setSeries([{ name: "Requests", data: counts }]);
  };

  if (error) return <div>Error loading chart data</div>;

  return (
    <div className="chart-app">
      <div className="chart-row">
      <h1>Requests Per Hotels</h1>
        <div className="mixed-chart">
          <Chart options={options} series={series} type="line" width="1000" />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
