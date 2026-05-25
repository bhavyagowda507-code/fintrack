import { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const API = 'http://localhost:5000/api';
const COLORS = ['#38bdf8', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];

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
  const [alert, setAlert] = useState('');

  const register = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setPage('dashboard');
      loadTransactions(res.data.token);
    } catch (err) {
      showAlert(err.response?.data?.message || 'Error', 'error');
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
      showAlert(err.response?.data?.message || 'Error', 'error');
    }
  };

  const loadTransactions = async (t) => {
    const res = await axios.get(`${API}/transactions`, {
      headers: { Authorization: `Bearer ${t}` }
    });
    setTransactions(res.data);
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(''), 3000);
  };

  const addTransaction = async () => {
    if (!amount) return;
    const avg = transactions.length > 0
      ? transactions.reduce((a, t) => a + t.amount, 0) / transactions.length : 0;
    if (parseFloat(amount) > avg * 3 && avg > 0) {
      showAlert('⚠️ FRAUD ALERT: This transaction is unusually large!', 'warning');
    }
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

  const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  const categoryData = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    const existing = acc.find(a => a.name === t.category);
    if (existing) existing.value += t.amount;
    else acc.push({ name: t.category, value: t.amount });
    return acc;
  }, []);

  const barData = [
    { name: 'Income', amount: income },
    { name: 'Expense', amount: expense },
    { name: 'Balance', amount: balance }
  ];

  if (page === 'login') return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 FinTrack</h1>
      <p style={styles.subtitle}>AI-Powered Personal Finance Manager</p>
      {alert && <div style={alert.type === 'error' ? styles.alertError : styles.alertWarn}>{alert.msg}</div>}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Login</h2>
        <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={login}>Login</button>
        <p onClick={() => setPage('register')} style={styles.link}>No account? Register here</p>
      </div>
    </div>
  );

  if (page === 'register') return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 FinTrack</h1>
      <p style={styles.subtitle}>AI-Powered Personal Finance Manager</p>
      {alert && <div style={styles.alertError}>{alert.msg}</div>}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Create Account</h2>
        <input style={styles.input} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={register}>Create Account</button>
        <p onClick={() => setPage('login')} style={styles.link}>Already have account? Login</p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>💰 FinTrack</h1>
        <p style={styles.welcome}>Welcome, {user?.name} 👋</p>
      </div>

      {alert && <div style={alert.type === 'warning' ? styles.alertWarn : styles.alertError}>{alert.msg}</div>}

      <div style={styles.statsRow}>
        <div style={{...styles.statCard, background: '#166534'}}>
          <p style={styles.statLabel}>💰 Balance</p>
          <h2 style={styles.statValue}>₹{balance.toFixed(2)}</h2>
        </div>
        <div style={{...styles.statCard, background: '#1e3a5f'}}>
          <p style={styles.statLabel}>📈 Income</p>
          <h2 style={styles.statValue}>₹{income.toFixed(2)}</h2>
        </div>
        <div style={{...styles.statCard, background: '#7f1d1d'}}>
          <p style={styles.statLabel}>📉 Expense</p>
          <h2 style={styles.statValue}>₹{expense.toFixed(2)}</h2>
        </div>
      </div>

      <div style={styles.chartsRow}>
        {categoryData.length > 0 && (
          <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>Spending by Category</h3>
            <PieChart width={300} height={220}>
              <Pie data={categoryData} cx={150} cy={100} outerRadius={80} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${v}`} />
              <Legend />
            </PieChart>
          </div>
        )}
        <div style={styles.chartCard}>
          <h3 style={styles.cardTitle}>Income vs Expense</h3>
          <BarChart width={300} height={220} data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip formatter={(v) => `₹${v}`} />
            <Bar dataKey="amount" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>➕ Add Transaction</h3>
        <input style={styles.input} placeholder="Amount (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <select style={styles.input} value={type} onChange={e => setType(e.target.value)}>
          <option value="income">💚 Income</option>
          <option value="expense">🔴 Expense</option>
        </select>
        <select style={styles.input} value={category} onChange={e => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Salary</option>
          <option>Healthcare</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
        <input style={styles.input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button style={styles.btn} onClick={addTransaction}>Add Transaction</button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📋 Transaction History</h3>
        {transactions.length === 0 && <p style={{color:'#94a3b8', textAlign:'center'}}>No transactions yet</p>}
        {transactions.map(t => (
          <div key={t.id} style={styles.txItem}>
            <div>
              <span style={{color: t.type === 'income' ? '#22c55e' : '#ef4444', fontWeight:'bold'}}>
                {t.type === 'income' ? '▲' : '▼'} ₹{t.amount}
              </span>
              <span style={{color:'#94a3b8', marginLeft:'10px'}}>{t.category}</span>
              {t.description && <span style={{color:'#64748b', marginLeft:'8px'}}>— {t.description}</span>}
            </div>
            <button onClick={() => deleteTransaction(t.id)} style={styles.deleteBtn}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#0f172a', color: 'white', padding: '20px', fontFamily: 'Arial' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#38bdf8', fontSize: '2rem', margin: 0 },
  subtitle: { color: '#94a3b8', textAlign: 'center', marginTop: '-10px', marginBottom: '20px' },
  welcome: { color: '#94a3b8', margin: 0 },
  card: { background: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '20px' },
  chartCard: { background: '#697d9d', padding: '20px', borderRadius: '12px', marginBottom: '20px', flex: 1 },
  chartsRow: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '0' },
  cardTitle: { color: '#1297d0', marginTop: 0, marginBottom: '15px' },
  statsRow: { display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' },
  statCard: { flex: 1, padding: '15px', borderRadius: '12px', textAlign: 'center', minWidth: '120px' },
  statLabel: { color: '#94a3b8', margin: '0 0 5px 0', fontSize: '0.9rem' },
  statValue: { color: 'white', margin: 0, fontSize: '1.4rem' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: 'none', background: '#334155', color: 'white', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#38bdf8', border: 'none', borderRadius: '8px', color: 'black', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' },
  link: { textAlign: 'center', color: '#38bdf8', cursor: 'pointer', marginTop: '10px' },
  txItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#334155', borderRadius: '8px', marginBottom: '8px' },
  deleteBtn: { background: '#ef4444', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', padding: '6px 10px' },
  alertError: { background: '#7f1d1d', padding: '12px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center' },
  alertWarn: { background: '#78350f', padding: '12px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '1.1rem' },
};