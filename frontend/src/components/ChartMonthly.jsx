import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./ChartCard.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartMonthly({ expenses = [] }) {
  const map = {};
  expenses.forEach((e) => {
    const d = new Date(e.date);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[m] = (map[m] || 0) + Number(e.amount || 0);
  });

  const labels = Object.keys(map).slice(-6);

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Spend",
        data: labels.map((l) => map[l] || 0),
        backgroundColor: "rgba(245, 215, 110, 0.7)",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#aaa", font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#aaa", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
    },
  };

  return (
    <div className="dashboard-chart-card">
      <h3 className="chart-title">Monthly Spending</h3>
      <div className="chart-area">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
