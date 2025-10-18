import React, { useState } from "react";
import { Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";
import { Card, CardContent, Typography, Grid } from "@mui/material";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

const ChartDashboard = () => {
  // ✅ Dummy data
  const [chartData] = useState({
    categoryCount: 12,
    subCategoryCount: 25,
    userCount: 150,
    adminCount: 5,
    orderCount: 320,
  });

  // Data for Doughnut Chart
  const doughnutData = {
    labels: ["Categories", "Subcategories", "Users", "Admins", "Orders"],
    datasets: [
      {
        label: "Counts",
        data: [
          chartData.categoryCount,
          chartData.subCategoryCount,
          chartData.userCount,
          chartData.adminCount,
          chartData.orderCount,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: ["rgba(255, 255, 255, 1)"],
        borderWidth: 2,
      },
    ],
  };

  // Data for Polar Area Chart
  const polarData = {
    labels: ["Categories", "Subcategories", "Users", "Admins", "Orders"],
    datasets: [
      {
        label: "Counts",
        data: [
          chartData.categoryCount,
          chartData.subCategoryCount,
          chartData.userCount,
          chartData.adminCount,
          chartData.orderCount,
        ],
        backgroundColor: [
          "rgba(255, 105, 180, 0.8)",
          "rgba(0, 255, 255, 0.8)",
          "rgba(50, 205, 50, 0.8)",
          "rgba(255, 191, 0, 0.8)",
          "rgba(75, 0, 130, 0.8)",
        ],
        borderColor: ["rgba(255, 255, 255, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "white" },
      },
    },
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        height: "100vh",
      //  backgroundColor: "#000000",
        padding: 4,
        color: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Left Side - Doughnut Chart */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            backgroundColor: "black",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: "white" }}>
              🌟 Dummy Doughnut Chart 🌟
            </Typography>
            <div style={{ height: "600px" }}>
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Side - Polar Area Chart */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            backgroundColor: "black",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom sx={{ color: "white" }}>
              🌟 Dummy Polar Area Chart 🌟
            </Typography>
            <div style={{ height: "600px" }}>
              <PolarArea data={polarData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChartDashboard;
