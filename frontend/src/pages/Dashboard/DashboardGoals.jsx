import React, { useEffect, useState } from "react";
import { getGoals, addGoal, updateGoal, deleteGoal } from "../../api/goalApi";
import Loader from "../../components/Loader";
import "./DashboardGoals.css";

function getDaysLeft(deadline) {
  if (!deadline) return null;

  const today = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

  return diff;
}

function getGoalStatus(progress, daysLeft) {
  if (progress >= 100) return "completed";
  if (daysLeft !== null && daysLeft < 0) return "overdue";
  if (progress >= 50) return "ontrack";
  return "behind";
}

export default function DashboardGoals() {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: "",
  });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getGoals();
      setGoals(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateGoal(editing, form);
        setEditing(null);
      } else {
        await addGoal(form);
      }
      setForm({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        description: "",
      });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (g) => {
    setEditing(g._id);
    setForm({
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      deadline: g.deadline?.split("T")[0],
      description: g.description,
    });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this goal?")) return;
    await deleteGoal(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="goals-page">
      {/* ADD GOAL CARD */}
      <div className="goals-card">
        <h3 className="goals-title">{editing ? "Update Goal" : "Add Goal"}</h3>

        <form className="goals-form" onSubmit={submit}>
          <input
            placeholder="Goal name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="Target Amount (₹)"
            value={form.targetAmount}
            onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
            required
          />

          <input
            placeholder="Current Amount (₹)"
            value={form.currentAmount}
            onChange={(e) =>
              setForm({ ...form, currentAmount: e.target.value })
            }
          />

          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button className="btn-cta" type="submit">
            {editing ? "Update Goal" : "Add Goal"}
          </button>
        </form>
      </div>

      {/* GOALS LIST CARD */}
      <div className="goals-card">
        <h3 className="goals-title">Your Goals</h3>

        {goals.length === 0 && <div className="goals-empty">No goals yet</div>}

        <div className="goals-list">
          {goals.map((g) => {
            const progress = Math.min(
              100,
              Math.round((g.currentAmount / g.targetAmount) * 100 || 0)
            );

            const remaining = Math.max(0, g.targetAmount - g.currentAmount);

            const daysLeft = getDaysLeft(g.deadline);
            const status = getGoalStatus(progress, daysLeft);

            return (
              <div className="goal-item" key={g._id}>
                {/* TOP SECTION */}
                <div className="goal-top">
                  {/* LEFT */}
                  <div className="goal-left">
                    <h4 className="goal-name">{g.name}</h4>

                    <p className="goal-desc">{g.description || "—"}</p>

                    {daysLeft !== null && (
                      <p className="goal-deadline">
                        {daysLeft >= 0
                          ? `${daysLeft} days left`
                          : `${Math.abs(daysLeft)} days overdue`}
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="goal-right">
                    <span className={`goal-status ${status}`}>
                      {status === "completed" && "Completed"}
                      {status === "ontrack" && "On Track"}
                      {status === "behind" && "Behind"}
                      {status === "overdue" && "Overdue"}
                    </span>

                    <div className="goal-meta">
                      <span>Saved: ₹{g.currentAmount}</span>
                      <span>Left: ₹{remaining}</span>
                      <span>Target: ₹{g.targetAmount}</span>
                    </div>

                    <div className="goal-actions">
                      <button className="btn-link" onClick={() => onEdit(g)}>
                        Edit
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => onDelete(g._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="goal-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
