import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Container, Alert } from "react-bootstrap";

import TodoDataService from "../services/todos";
import Seo from "./seo";

// 编辑页：直接用 URL 里的 id 去后端取数据，刷新页面也不会丢。
// Practical 18, Step 3: the URL may also carry a slug (/todos/12/buy-oat-milk);
// the slug is cosmetic, we only query by id.
const Todo = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    TodoDataService.get(id, props.token)
      .then((response) => {
        setTodo(response.data);
        setTitle(response.data.title);
        setMemo(response.data.memo);
        setIsCompleted(response.data.is_completed);
      })
      .catch((e) => {
        console.log(e);
        setError("This todo does not exist or does not belong to you.");
      });
  }, [id, props.token]);

  const updateTodo = () => {
    const data = { title: title, memo: memo, is_completed: isCompleted };
    TodoDataService.update(id, data, props.token)
      .then(() => navigate("/"))
      .catch((e) => console.log("Update failed:", e));
  };

  const removeTodo = () => {
    if (!window.confirm("Delete this task?")) return;
    TodoDataService.delete(id, props.token)
      .then(() => navigate("/"))
      .catch((e) => console.log("Delete failed:", e));
  };

  if (error) {
    return (
      <>
        <Seo title="Task not found" path={`/todos/${id}`} noIndex />
        <Alert variant="danger">{error}</Alert>
      </>
    );
  }

  if (!todo) {
    return (
      <>
        <Seo title="Loading task…" path={`/todos/${id}`} noIndex />
        <p>Loading...</p>
      </>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      {/* Step 4: the title is generated from the task itself */}
      <Seo
        title={todo.title}
        description={`Edit “${todo.title}” in Todo App: update the memo or mark it as completed.`}
        path={`/todos/${todo.id}`}
        type="article"
        noIndex
      />
      <Card>
        <Card.Body>
          <h4 className="mb-3">Edit Todo</h4>

          <Form.Group className="mb-3" controlId="todoTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="todoMemo">
            <Form.Label>Memo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            id="todoCompleted"
            label="Completed"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="mb-3"
          />

          <Button variant="success" onClick={updateTodo} className="me-2">
            Save changes
          </Button>
          <Button variant="danger" onClick={removeTodo} className="me-2">
            Delete
          </Button>
          <Link to="/">
            <Button variant="secondary">Cancel</Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Todo;
