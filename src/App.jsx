
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch expenses
  useEffect(() => {
    fetch("http://localhost:5000/api/expenses")
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.log(err));
  }, []);

  // Add expense
  function addExpense(e) {
    e.preventDefault();

    fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: name,
        amount: Number(amount),
        category: "Other",
        date: new Date().toISOString().slice(0, 10)
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add expense");
        return res.json();
      })
      .then(data => {
        setExpenses(prev => [...prev, data]);
        setName("");
        setAmount("");
      })
      .catch(err => alert(err.message));
  }

  // Calculate total
  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount), 0
  );

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <form onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Expense name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <button type="submit">Add Expense</button>
      </form>

      <h2>Total Expenses: ₹{total.toFixed(2)}</h2>

      <h2>Expense List</h2>

      {expenses.map(item => (
        <p key={item.id}>
          {item.title} - ₹{item.amount}
        </p>
      ))}
    </div>
  );
}

export default App;
