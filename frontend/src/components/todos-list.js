import React, { useState, useEffect } from 'react';
import TodoDataService from '../services/todos';
import { Link } from 'react-router-dom';
import { Card, Container, Button, Alert } from 'react-bootstrap';
import moment from 'moment';

const TodosList = (props) => {
  const [todos, setTodos] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    retrieveTodos();
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
      .then(() => {
        retrieveTodos();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // P12 标记完成/取消完成
  const completeTodo = (todoId) => {
    TodoDataService.completeTodo(todoId, props.token)
      .then(() => {
        retrieveTodos();
        console.log("completeTodo", todoId);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container>
      {
        (props.token === null || props.token === "") ? (
          <Alert variant="warning">
            You are not logged in. Please <Link to={"/login"}>login</Link> to see your todos.
          </Alert>
        ) : (
          <div>
            <Link to={"/todos/create"}>
              <Button variant="outline-info" className="mb-3">
                Add To‑do
              </Button>
            </Link>

            {
              todos.map((todo) => {
                return (
                  <Card key={todo.id} className="mb-3">
                    <Card.Body>
                      {/* 使用 is_completed 做删除线，和后端字段保持一致 */}
                      <div style={todo.is_completed ? {textDecoration:"line-through"} : {}}>
                        <Card.Title>{todo.title}</Card.Title>
                        <Card.Text><b>Memo:</b> {todo.memo}</Card.Text>
                        <Card.Text>Date created: {moment(todo.created_time).format('Do MMMM YYYY')}</Card.Text>
                      </div>

                      {/* is_completed为false才显示Edit按钮 */}
                      { !todo.is_completed &&
                        <Link to={{
                          pathname: "/todos/" + todo.id,
                          state: {
                            currentTodo: todo
                          }
                        }}>
                          <Button variant="outline-info" className="me-2">
                            Edit
                          </Button>
                        </Link>
                      }

                      <Button variant="outline-danger" className="me-2" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </Button>

                      <Button variant="outline-success" onClick={() => completeTodo(todo.id)}>
                        Complete
                      </Button>
                    </Card.Body>
                  </Card>
                )
              })
            }
          </div>
        )
      }
    </Container>
  );
};

export default TodosList;