import React, { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../api/expenseApi";
import Loader from "../../components/Loader";
import "./DashboardExpenses.css";

const CATEGORY_COLORS = {
  food: "#ffb84d",
  shopping: "#5ba0ff",
  travel: "#ba85ff",
  ott: "#f5d76e",
  bills: "#ff6b6b",
  subscriptions: "#4cd964",
};

export default function DashboardExpenses() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    note: "",
    date: "",
  });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getExpenses({ limit: 500 });
      setExpenses(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateExpense(editing, form);
        setEditing(null);
      } else {
        await addExpense(form);
      }
      setForm({ amount: "", category: "", note: "", date: "" });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (exp) => {
    setEditing(exp._id);
    setForm({
      amount: exp.amount,
      category: exp.category,
      note: exp.note,
      date: exp.date?.split("T")[0],
    });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="expenses-page">
      {/* ADD / UPDATE EXPENSE CARD */}
      <div className="expenses-card">
        <h3 className="expenses-title">
          {editing ? "Update Expense" : "Add Expense"}
        </h3>

        <form className="expenses-form" onSubmit={onSubmit}>
          <input
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <input
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <button className="btn-cta" type="submit">
            {editing ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>

      {/* EXPENSE LIST CARD */}
      <div className="expenses-card">
        <h3 className="expenses-title">Your Expenses</h3>

        {expenses.length === 0 && (
          <div className="expenses-empty">No expenses yet</div>
        )}

        <div className="expenses-list">
          {expenses.map((exp) => (
            <div className="expense-item" key={exp._id}>
              <div className="expense-main">
                <span
                  className="expense-category"
                  style={{
                    backgroundColor:
                      (CATEGORY_COLORS[exp.category.toLowerCase()] || "#555") +
                      "20",
                    color:
                      CATEGORY_COLORS[exp.category.toLowerCase()] || "#ccc",
                  }}
                >
                  {exp.category}
                </span>

                <span className="expense-note">{exp.note || "—"}</span>
              </div>

              <div className="expense-meta">
                <span className="expense-date">
                  {new Date(exp.date).toLocaleDateString()}
                </span>
                <span className="expense-amount">₹{exp.amount}</span>
              </div>

              <div className="expense-actions">
                <button className="btn-link" onClick={() => onEdit(exp)}>
                  Edit
                </button>
                <button className="btn-ghost" onClick={() => onDelete(exp._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
