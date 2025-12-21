import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./ChartCard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartCategory({ expenses = [] }) {
  const map = {};
  expenses.forEach(
    (e) => (map[e.category] = (map[e.category] || 0) + Number(e.amount || 0))
  );

  const labels = Object.keys(map).slice(0, 8);

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((l) => map[l]),
        backgroundColor: labels.map((_, i) => `hsl(${i * 40}, 75%, 55%)`),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#aaa",
          boxWidth: 10,
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="dashboard-chart-card">
      <h3 className="chart-title">Spending by Category</h3>
      <div className="chart-area">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
