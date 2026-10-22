import React, { useState, useEffect } from 'react';
import TodoDataService from '../services/todos';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Button, Container } from 'react-bootstrap';

const AddTodo = (props) => {
  let navigate = useNavigate();
  const location = useLocation();

  // 拿到编辑传过来的todo数据
  const currentTodo = location.state?.currentTodo;

  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");

  // 如果是编辑模式，回填原有内容
  useEffect(() => {
    if (currentTodo) {
      setTitle(currentTodo.title);
      setMemo(currentTodo.memo);
    }
  }, [currentTodo]);

  const saveTodo = (e) => {
    e.preventDefault();
    let data = {
      title: title,
      memo: memo
    };

    // 判断新增 / 更新
    if (currentTodo) {
      TodoDataService.updateTodo(currentTodo.id, data, props.token)
        .then(() => {
          navigate("/todos");
        })
        .catch(e => console.log(e));
    } else {
      TodoDataService.createTodo(data, props.token)
        .then(() => {
          navigate("/todos");
        })
        .catch(e => console.log(e));
    }
  };

  return (
    <Container style={{maxWidth:"600px"}}>
      <Card className="p-4 mt-4">
        <h3>{currentTodo ? "Edit Todo" : "Add Todo"}</h3>
        <Form onSubmit={saveTodo}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Memo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="me-2">
            {currentTodo ? "Edit To-do" : "Add To-do"}
          </Button>
          <Link to="/todos">
            <Button variant="secondary">Back</Button>
          </Link>
        </Form>
      </Card>
    </Container>
  );
};

export default AddTodo;