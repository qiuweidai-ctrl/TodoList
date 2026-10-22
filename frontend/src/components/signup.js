import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

// 注册页面组件：使用React-Bootstrap表单
const Signup = props => {
  // 路由跳转
  const navigate = useNavigate();
  // 用户名输入框状态
  const [username, setUsername] = useState("");
  // 密码输入框状态
  const [password, setPassword] = useState("");

  // 用户名输入变化时更新状态
  const onChangeUsername = e => {
    const username = e.target.value;
    setUsername(username);
  }

  // 密码输入变化时更新状态
  const onChangePassword = e => {
    const password = e.target.value;
    setPassword(password);
  }

  // 注册按钮点击：调用父组件传入的signup函数
  const signup = () => {
    props.signup({ username: username, password: password });
    // 注册成功后跳转到首页
    navigate('/');
  }

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={onChangeUsername}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={onChangePassword}
          />
        </Form.Group>

        <Button variant="primary" onClick={signup}>
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}

export default Signup;