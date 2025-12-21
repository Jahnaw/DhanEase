import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getExpenses } from "../../api/expenseApi";
import "./DashboardReports.css";

const filterByDateRange = (expenses, from, to) => {
  if (!from && !to) return expenses;

  return expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;

    if (fromD && expenseDate < fromD) return false;
    if (toD && expenseDate > toD) return false;

    return true;
  });
};

export default function DashboardReports() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleExportCSV = async () => {
    try {
      const res = await getExpenses({ limit: 1000 });
      let expenses = res?.data?.data || res?.data || [];

      expenses = filterByDateRange(expenses, fromDate, toDate);

      if (expenses.length === 0) {
        alert("No expenses found for selected date range");
        return;
      }

      const headers = ["Date", "Category", "Amount", "Note"];
      const rows = expenses.map((e) => [
        new Date(e.date).toLocaleDateString(),
        e.category,
        e.amount,
        e.note || "",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "expenses-report.csv";
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export CSV");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await getExpenses({ limit: 1000 });
      let expenses = res?.data?.data || res?.data || [];

      expenses = filterByDateRange(expenses, fromDate, toDate);

      if (expenses.length === 0) {
        alert("No expenses found for selected date range");
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("FinGold – Expense Report", 14, 20);

      doc.setFontSize(11);
      doc.setTextColor(120);
      doc.text(`Period: ${fromDate || "Start"} → ${toDate || "Today"}`, 14, 28);

      const tableRows = expenses.map((e) => [
        new Date(e.date).toLocaleDateString(),
        e.category,
        `₹${e.amount}`,
        e.note || "-",
      ]);

      autoTable(doc, {
        startY: 35,
        head: [["Date", "Category", "Amount", "Note"]],
        body: tableRows,
        theme: "grid",
        headStyles: {
          fillColor: [245, 215, 110],
          textColor: 0,
        },
        styles: {
          fontSize: 10,
        },
      });

      doc.save("FinGold-Expense-Report.pdf");
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    }
  };

  return (
    <div className="reports-page">
      {/* HEADER */}
      <div className="reports-header">
        <h2>Reports</h2>
        <p>
          Download monthly reports, export your data, and keep track of your
          financial history.
        </p>
      </div>

      <div className="report-filters">
        <div className="date-group">
          <label>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="date-group">
          <label>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* REPORT CARDS */}
      <div className="reports-grid">
        <div className="report-card">
          <h4>Export CSV</h4>
          <p>
            Download all your expenses in CSV format for Excel or Google Sheets.
          </p>
          <button className="btn-cta" onClick={handleExportCSV}>
            Export CSV
          </button>
        </div>

        <div className="report-card">
          <h4>Download PDF</h4>
          <p>
            Generate a clean PDF summary of your expenses and overall finances.
          </p>
          <button className="btn-cta" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
