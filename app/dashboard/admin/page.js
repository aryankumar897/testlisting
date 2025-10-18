//  "use client";

// import Analytics from  "./Analytics"

// import DoughnutChart  from "./DoughnutChart"

// export default function AdminDashboard() {
//   return (

// <>
// <Analytics/>
// <DoughnutChart/>
// </>


//   )
// }


"use client"

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Box  
} from "@mui/material";
import { Line } from "react-chartjs-2";

import DoughnutChart from './DoughnutChart';
//import AllOrder from "./AllOrder";
import Analytics from "./Analytics";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ Dummy data
  const [data] = useState({
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 2200, 1800, 2500, 3200, 4000, 3700, 4200, 3100, 2800, 3500, 4500],
        fill: true,
        borderColor: "#FFD700", // gold line
        backgroundColor: "rgba(255, 215, 0, 0.2)", // soft gold fill
        tension: 0.3, // smooth curve
        pointBackgroundColor: "#FF4500", // orange points
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#FFD700',
        },
      },
      tooltip: {
        backgroundColor: '#00BFFF',
        titleColor: '#FFF',
        bodyColor: '#000',
        borderColor: '#FFD700',
        borderWidth: 1,
        callbacks: {
          label: (context) => `$${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          color: '#32CD32',
        },
        ticks: {
          color: '#32CD32',
        },
        grid: {
          color: 'rgba(50, 205, 50, 0.2)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Earnings ($)',
          color: '#FFA500',
        },
        beginAtZero: true,
        ticks: {
          color: '#FFA500',
          stepSize: 1000,
          min: 0,
          max: 5000,
        },
        grid: {
          color: 'rgba(255, 165, 0, 0.2)',
        },
      },
    },
  };

  return (
    <>
      <Card
        style={{
          marginTop: isMobile ? "0" : "0",
          marginBottom: isMobile ? "0" : "0",
          marginLeft: isMobile ? "0" : "70px",
          marginRight: isMobile ? "0" : "0",
          padding: '10px',
          backgroundColor: '#000000',
          color: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            style={{
              marginBottom: '20px',
              color: '#00FF7F',
              textAlign: 'center',
              textShadow: '1px 1px 4px rgba(255, 255, 255, 0.7)',
            }}
          >
            Revenue Report (Last 12 Months)
          </Typography>
          <div style={{ height: '400px' }}>
            <Line data={data} options={options} />
          </div>
        </CardContent>
      </Card>

    <Box   
    
     sx={{
      m:7
     }}
    >


        {/* Other components */}
      <DoughnutChart />
      {/* <AllOrder /> */}
      <Analytics />
    </Box>
    </>
  );
};

export default RevenueChart;




