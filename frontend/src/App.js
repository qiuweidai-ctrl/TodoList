import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";

import TodoDataService from "./services/todos";
import Login from "./components/login";
import Signup from "./components/signup";
import TodosList from "./components/todos-list";
import AddTodo from "./components/add-todo";
import Todo from "./components/todo";

function App() {
  // token 存在 localStorage，刷新页面不会掉登录
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const login = async (user, password) => {
    try {
      const response = await TodoDataService.login(user, password);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username || user);
      setToken(response.data.token);
      setUsername(response.data.username || user);
      return true;
    } catch (err) {
      const msg = err?.response?.data?.non_field_errors?.[0];
      alert("Login failed: " + (msg || "wrong username or password"));
      return false;
    }
  };

  const signup = async (user, password) => {
    try {
      await TodoDataService.signup(user, password);
    } catch (err) {
      alert("Sign up failed: " + (err?.response?.data?.error || err.message));
      return false;
    }
    // 注册成功直接登录
    return login(user, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Todo App
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center">
              {token ? (
                <>
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/add">Add Task</Nav.Link>
                  <Navbar.Text className="mx-3">{username}</Navbar.Text>
                  <Button variant="outline-light" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/signup">Sign up</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <Login login={login} />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/" replace /> : <Signup signup={signup} />}
          />
          <Route path="/" element={<TodosList token={token} />} />
          <Route
            path="/add"
            element={token ? <AddTodo token={token} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/todos/:id"
            element={token ? <Todo token={token} /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
