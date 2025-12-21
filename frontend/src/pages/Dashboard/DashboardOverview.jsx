import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getExpenses } from "../../api/expenseApi";
import { getGoals } from "../../api/goalApi";
import ChartMonthly from "../../components/ChartMonthly";
import ChartCategory from "../../components/ChartCategory";
import HealthScoreCard from "../../components/HealthScoreCard";
import AlertCard from "../../components/AlertCard";
import Loader from "../../components/Loader";
import {
  calculateStats,
  calculateHealthScore,
} from "../../utils/calculateStats";

export default function DashboardOverview() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const e = await getExpenses({ limit: 500 });
        setExpenses(e.data.data || e.data);
        const g = await getGoals();
        setGoals(g.data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;

  const stats = calculateStats(expenses, user?.income);
  const score = calculateHealthScore(stats);

  return (
    <div className="overview">
      <div className="left-col">
        <HealthScoreCard score={score} stats={stats} expenses={expenses} />
        <AlertCard stats={stats} />
      </div>
      <div className="right-col">
        <div className="dashboard-charts-row">
          <ChartMonthly expenses={expenses} />
          <ChartCategory expenses={expenses} />
        </div>
      </div>
    </div>
  );
}
