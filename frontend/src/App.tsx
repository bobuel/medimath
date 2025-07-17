import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CreateCharacter from './CreateCharacter';
import World from './World';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3001/api/character', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (res.ok) {
          window.location.href = '/world';
        } else {
          window.location.href = '/create-character';
        }
      });
    }
  }, []);
  const handleLogin = async () => {
    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      const check = await fetch('http://localhost:3001/api/character', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (check.ok) {
        window.location.href = '/world';
      } else {
        window.location.href = '/create-character';
      }
    } else {
      alert(data.error);
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
export { Login };

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignup = async () => {
    const res = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Account created');
      window.location.href = '/';
    } else {
      alert(data.error);
    }
  };
  return (
    <div>
      <h2>Sign Up</h2>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

function Protected({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-character" element={<Protected><CreateCharacter /></Protected>} />
        <Route path="/world" element={<Protected><World /></Protected>} />
      </Routes>
    </Router>
  );
}

export default App;
