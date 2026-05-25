import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function App() {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');

  const register = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setPage('dashboard');
      loadTransactions(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setPage('dashboard');
      loadTransactions(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const loadTransactions = async (t) => {
    const res = await axios.get(`${API}/transactions`, {
      headers: { Authorization: `Bearer ${t}` }
    });
    setTransactions(res.data);
  };

  const addTransaction = async () => {
    await axios.post(`${API}/transactions`,
      { amount: parseFloat(amount), type, category, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAmount(''); setDescription('');
    loadTransactions(token);
  };

  const deleteTransaction = async (id) => {
    await axios.delete(`${API}/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    loadTransactions(token);
  };

  const balance = transactions.reduce((acc, t) =>
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0);

  if (page === 'login') return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 FinTrack</h1>
      <div style={styles.card}>
        <h2>Login</h2>
        <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={login}>Login</button>
        <p onClick={() => setPage('register')} style={styles.link}>No account? Register</p>
      </div>
    </div>
  );

  if (page === 'register') return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 FinTrack</h1>
      <div style={styles.card}>
        <h2>Register</h2>
        <input style={styles.input} placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={register}>Register</button>
        <p onClick={() => setPage('login')} style={styles.link}>Have account? Login</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 FinTrack — Welcome {user?.name}</h1>
      <div style={styles.balanceCard}>
        <h2>Balance: ₹{balance.toFixed(2)}</h2>
      </div>
      <div style={styles.card}>
        <h3>Add Transaction</h3>
        <input style={styles.input} placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <select style={styles.input} value={type} onChange={e => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select style={styles.input} value={category} onChange={e => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Salary</option>
          <option>Other</option>
        </select>
        <input style={styles.input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button style={styles.btn} onClick={addTransaction}>Add</button>
      </div>
      <div style={styles.card}>
        <h3>Transactions</h3>
        {transactions.map(t => (
          <div key={t.id} style={styles.txItem}>
            <span>{t.category} — ₹{t.amount} ({t.type})</span>
            <button onClick={() => deleteTransaction(t.id)} style={styles.deleteBtn}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', color: 'white', padding: '20px', fontFamily: 'Arial' },
  title: { textAlign: 'center', color: '#38bdf8', fontSize: '2rem' },
  card: { background: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '20px', maxWidth: '500px', margin: '20px auto' },
  balanceCard: { background: '#166534', padding: '20px', borderRadius: '12px', textAlign: 'center', maxWidth: '500px', margin: '20px auto' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#334155', color: 'white', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#38bdf8', border: 'none', borderRadius: '8px', color: 'black', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' },
  link: { textAlign: 'center', color: '#38bdf8', cursor: 'pointer', marginTop: '10px' },
  txItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#334155', borderRadius: '8px', marginBottom: '8px' },
  deleteBtn: { background: '#ef4444', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px' }
};