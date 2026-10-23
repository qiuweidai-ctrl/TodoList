import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Button, Alert } from "react-bootstrap";
import moment from "moment";

import TodoDataService from "../services/todos";
import Seo from "./seo";
import { slugify } from "../utils/slug";

const TodosList = (props) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (props.token) {
      retrieveTodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.token]);

  const retrieveTodos = () => {
    TodoDataService.getAll(props.token)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteTodo = (todoId) => {
    TodoDataService.deleteTodo(todoId, props.token)
      .then(() => retrieveTodos())
      .catch((e) => {
        console.log(e);
      });
  };

  const completeTodo = (todoId) => {
    TodoDataService.completeTodo(todoId, props.token)
      .then(() => retrieveTodos())
      .catch((e) => {
        console.log(e);
      });
  };

  if (!props.token) {
    return (
      <>
        <Seo
          title="Sign in to your todo list"
          description="Log in to Todo App to manage your tasks: add, complete and delete todos from any browser."
          path="/"
        />
        <Alert variant="warning">
          You are not logged in. Please <Link to="/login">login</Link> to see your
          todos.
        </Alert>
      </>
    );
  }

  return (
    <Container>
      <Seo
        title="My tasks"
        description="Your personal task list: everything you added, with memo, creation date and completion status."
        path="/"
      />

      <Link to="/add">
        <Button variant="outline-info" className="mb-3">
          Add To-do
        </Button>
      </Link>

      {todos.length === 0 && (
        <Alert variant="secondary">No tasks yet. Click “Add To-do” to start.</Alert>
      )}

      {todos.map((todo) => (
        <Card key={todo.id} className="mb-3">
          <Card.Body>
            {/* 后端字段是 is_completed */}
            <div style={todo.is_completed ? { textDecoration: "line-through" } : {}}>
              <Card.Title>{todo.title}</Card.Title>
              <Card.Text>
                <b>Memo:</b> {todo.memo}
              </Card.Text>
              <Card.Text>
                Date created: {moment(todo.created_time).format("Do MMMM YYYY")}
              </Card.Text>
            </div>

            {!todo.is_completed && (
              /* Practical 18, Step 3: readable URL with a slug, e.g.
                 /todos/12/buy-oat-milk instead of /todos/12 */
              <Link to={`/todos/${todo.id}/${slugify(todo.title)}`}>
                <Button variant="outline-info" className="me-2">
                  Edit
                </Button>
              </Link>
            )}

            <Button
              variant="outline-danger"
              className="me-2"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </Button>

            <Button variant="outline-success" onClick={() => completeTodo(todo.id)}>
              {todo.is_completed ? "Undo" : "Complete"}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default TodosList;
