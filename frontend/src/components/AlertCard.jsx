import React from "react";
import "./AlertCard.css";

export default function AlertCard({ stats = {} }) {
  const alerts = [];

  // WARNING: Low savings
  if (stats.savingsPercent < 10) {
    alerts.push({
      type: "warning",
      message: "Savings are under 10% of income. Consider reducing expenses."
    });
  }

  // DANGER: High spending increase
  if (stats.monthOverMonthIncrease > 20) {
    alerts.push({
      type: "danger",
      message: "Spending increased by more than 20% compared to last month."
    });
  }

  // INFO: No alerts
  if (alerts.length === 0) {
    alerts.push({
      type: "info",
      message: "No alerts — your finances look healthy."
    });
  }

  return (
    <div className="alert-card-wrapper">
      <h3 className="alert-title">Smart Alerts</h3>

      <div className="alert-list">
        {alerts.map((alert, index) => (
          <div key={index} className={`alert-item ${alert.type}`}>
            <span className="alert-icon">
              {alert.type === "info" && "✓"}
              {alert.type === "warning" && "⚠"}
              {alert.type === "danger" && "⛔"}
            </span>
            <span className="alert-text">{alert.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
