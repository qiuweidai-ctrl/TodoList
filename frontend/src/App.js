import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import TodosList from './components/todos-list';
import AddTodo from './components/add-todo';

const API_URL = 'http://127.0.0.1:8000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const [loginUser, setLoginUser] = useState('');
  const [loginPwd, setLoginPwd] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPwd })
      });
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', loginUser);
      setToken(data.token);
      setUsername(loginUser);
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  const LoginPage = () => (
    <Container className="mt-4" style={{ maxWidth: "500px" }}>
      <Card className="p-4">
        <h2>Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control value={loginUser} onChange={e => setLoginUser(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} />
          </Form.Group>
          <Button type="submit" variant="primary">Login</Button>
        </Form>
      </Card>
    </Container>
  );

  const NavBar = () => (
    <div className="bg-primary p-3 mb-4 text-white d-flex gap-4 align-items-center">
      <h4 className="mb-0 text-white">TodosApp</h4>
      <Link to="/todos" className="text-white">Todos</Link>
      {token ?
        <Button variant="light" size="sm" onClick={handleLogout}>Logout({username})</Button>
        : <Link to="/login" className="text-white">Login</Link>
      }
    </div>
  );

  return (
    <Router>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/todos" /> : <LoginPage />} />
          <Route path="/todos" element={<TodosList token={token} />} />
          <Route path="/todos/create" element={<AddTodo token={token} />} />
          <Route path="/todos/:id" element={<AddTodo token={token} />} />
          <Route path="*" element={<Navigate to="/todos" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;