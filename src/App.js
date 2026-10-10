 
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = "http://localhost:5000/api/expenses";

  // GET: Fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      setError("");

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        "Cannot connect to the backend. Check that server.js is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // POST: Add a new expense
  const addExpense = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          category,
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add expense.");
      }

      // Add the saved expense to the screen
      setExpenses((previous) => [...previous, data]);

      // Clear the form
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate("");
    } catch (err) {
      console.error("Add expense error:", err);
      setError(err.message || "Failed to add expense.");
    }
  };

  // Calculate total expenses
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track your spending and manage your money.</p>
      </header>

      <section className="total-card">
        <h2>Total Expenses</h2>
        <div className="total-amount">
          ₹{total.toFixed(2)}
        </div>
        <p>{expenses.length} expense(s) recorded</p>
      </section>

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button
            type="button"
            className="retry-button"
            onClick={fetchExpenses}
          >
            Retry
          </button>
        </div>
      )}

      <section>
        <h2>Add New Expense</h2>

        <form className="expense-form" onSubmit={addExpense}>
          <input
            type="text"
            placeholder="Expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />

          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <button type="submit">Add Expense</button>
        </form>
      </section>

      <section>
        <div className="history-header">
          <h2>Expense History</h2>
          <button
            type="button"
            className="refresh-button"
            onClick={fetchExpenses}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="empty-message">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="empty-message">
            No expenses found. Add your first expense!
          </p>
        ) : (
          <div className="expense-list">
            {expenses.map((expense) => (
              <article className="expense-card" key={expense.id}>
                <h3>{expense.title}</h3>

                <p className="expense-amount">
                  ₹{Number(expense.amount).toFixed(2)}
                </p>

                <p className="expense-details">
                  Category: {expense.category || "Other"}
                </p>

                <p className="expense-details">
                  Date: {String(expense.date || "").slice(0, 10)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
