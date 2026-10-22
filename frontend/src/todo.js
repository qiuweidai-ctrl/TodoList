import React, { useState, useEffect } from 'react';
import TodoDataService from './services/todos';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Button, Container } from 'react-bootstrap';

const Todo = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  // 删除 setCurrentTodo，因为没有用到
  const [currentTodo] = useState(location.state?.currentTodo);
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (currentTodo) {
      setTitle(currentTodo.title);
      setMemo(currentTodo.memo);
      setIsCompleted(currentTodo.is_completed);
    }
  }, [currentTodo]);

  const updateTodo = () => {
    const data = {
      title: title,
      memo: memo,
      is_completed: isCompleted
    };
    TodoDataService.update(currentTodo.id, data, props.token)
      .then(() => {
        navigate("/todos");
      })
      .catch((e) => {
        console.log("更新失败：", e);
      });
  };

  const removeTodo = () => {
    TodoDataService.delete(currentTodo.id, props.token)
      .then(() => {
        navigate("/todos");
      })
      .catch((e) => {
        console.log("删除失败：", e);
      });
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <Card>
        <Card.Body>
          {currentTodo ? (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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

              <Form.Check
                type="checkbox"
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
              <Link to="/todos">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          ) : (
            <h4>No todo selected</h4>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Todo;