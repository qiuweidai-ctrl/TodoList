import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/todos";

const TodoDataService = {
  getAll(token) {
    return axios.get(API_URL, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
  },

  get(id, token) {
    return axios.get(`${API_URL}/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    });
  },

  create(data, token) {
    return axios.post(API_URL, data, {
      headers: { Authorization: `Token ${token}` }
    });
  },

  createTodo(data, token) {
    return this.create(data, token);
  },

  update(id, data, token) {
    return axios.put(`${API_URL}/${id}/`, data, {
      headers: { Authorization: `Token ${token}` }
    });
  },

  updateTodo(id, data, token) {
    return this.update(id, data, token);
  },

  delete(id, token) {
    return axios.delete(`${API_URL}/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    });
  },

  deleteTodo(id, token) {
    return this.delete(id, token);
  },

  // P12 标记完成接口，路径 /todos/{id}/complete/
  completeTodo(id, token) {
    return axios.patch(`${API_URL}/${id}/complete/`, {}, {
      headers: { Authorization: `Token ${token}` }
    });
  }
};

export default TodoDataService;