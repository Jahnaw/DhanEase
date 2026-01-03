import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./HealthScoreCard.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function HealthScoreCard({
  score = 0,
  stats = {},
  expenses = [],
}) {
  const [range, setRange] = useState(6);

  // -------- BALANCE & PERCENTAGE CALCULATION --------
  const income = stats.income || 0;
  const totalExpenses = stats.totalExpenses || 0;

  const currentBalance = income - totalExpenses;

  const percentage =
    income > 0 ? ((currentBalance / income) * 100).toFixed(2) : 0;
  // -------------------------------------------------

  /* -------- SAME STYLE LOGIC AS ChartMonthly -------- */
  const monthlyMap = {};

  expenses.forEach((e) => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + Number(e.amount || 0);
  });

  const months = Object.keys(monthlyMap).sort();
  const slicedMonths = months.slice(-range);

  let runningBalance = stats.income || 0;

  const balanceData = slicedMonths.map((m) => {
    runningBalance -= monthlyMap[m];
    return runningBalance;
  });

  const chartData = {
    labels: slicedMonths,
    datasets: [
      {
        label: "Balance",
        data: balanceData,
        fill: "start",
        borderColor: "#ff9f43",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,

        // 🔥 THIS IS THE KEY FIX
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;

          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0, "rgba(255,159,67,0.65)");
          gradient.addColorStop(0.6, "rgba(255,159,67,0.25)");
          gradient.addColorStop(1, "rgba(0,0,0,0)");

          return gradient;
        },
      },
    ],
  };

  /* -------------------------------------------------- */

  return (
    <div className="health-card">
      {/* HEADER */}
      <div className="health-top">
        <div>
          <span className="health-label">Total Balance</span>
          <h2 className="health-balance">₹{currentBalance.toLocaleString()}</h2>
          <span className="health-change positive">↑ {percentage}%</span>
        </div>

        {/* RANGE TOGGLE */}
        <div className="health-range">
          <button
            className={range === 12 ? "active" : ""}
            onClick={() => setRange(12)}
          >
            1 year
          </button>

          <button
            className={range === 6 ? "active" : ""}
            onClick={() => setRange(6)}
          >
            6 month
          </button>

          <button
            className={range === 3 ? "active" : ""}
            onClick={() => setRange(3)}
          >
            3 month
          </button>

          <button
            className={range === 1 ? "active" : ""}
            onClick={() => setRange(1)}
          >
            1 month
          </button>
        </div>
      </div>

      {/* REAL GRAPH */}
      <div className="health-graph">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                grace: "15%",
                ticks: {
                  color: "#aaa",
                },
                grid: {
                  color: "rgba(255,255,255,0.05)",
                },
              },
              x: {
                offset: true,
                ticks: {
                  color: "#888",
                },
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>

      {/* FOOTER */}
      <div className="health-footer">
        <div>
          <span className="dot orange"></span>Actual balance
        </div>
        <div>
          <span className="dot green"></span>Monthly balance
        </div>
      </div>
    </div>
  );
}
