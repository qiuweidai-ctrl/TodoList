import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Button, Container } from "react-bootstrap";

import TodoDataService from "../services/todos";

// 新增任务页
const AddTodo = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  const saveTodo = (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { title: title, memo: memo, is_completed: false };

    TodoDataService.create(data, props.token)
      .then(() => navigate("/"))
      .catch((err) => {
        console.log(err);
        alert(
          "Failed to add task: " +
            (err?.response?.data?.title || err?.response?.data?.detail || err.message)
        );
      })
      .finally(() => setSaving(false));
  };

  return (
    <Container style={{ maxWidth: "600px" }}>
      <Card className="p-4 mt-4">
        <h3 className="mb-3">Add Todo</h3>
        <Form onSubmit={saveTodo}>
          <Form.Group className="mb-3" controlId="addTodoTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="addTodoMemo">
            <Form.Label>Memo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Optional details"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="me-2" disabled={saving}>
            {saving ? "Saving..." : "Add To-do"}
          </Button>
          <Link to="/">
            <Button variant="secondary">Back</Button>
          </Link>
        </Form>
      </Card>
    </Container>
  );
};

export default AddTodo;
