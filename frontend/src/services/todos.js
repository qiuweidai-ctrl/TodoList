import axios from "axios";

// 后端地址：本地开发就是 127.0.0.1:8000
const API_URL = "http://127.0.0.1:8000/api";

// 带 token 的请求头
const authConfig = (token) => ({
  headers: { Authorization: `Token ${token}` },
});

class TodoDataService {
  // 注册新用户
  signup(username, password) {
    return axios.post(`${API_URL}/signup/`, { username, password });
  }

  // 登录：拿 token
  login(username, password) {
    return axios.post(`${API_URL}/api-token-auth/`, { username, password });
  }

  // 获取当前用户的全部任务
  getAll(token) {
    return axios.get(`${API_URL}/todos/`, authConfig(token));
  }

  // 获取单条任务
  get(id, token) {
    return axios.get(`${API_URL}/todos/${id}/`, authConfig(token));
  }

  // 新增任务
  create(data, token) {
    return axios.post(`${API_URL}/todos/`, data, authConfig(token));
  }

  // 修改任务（整条更新）
  update(id, data, token) {
    return axios.put(`${API_URL}/todos/${id}/`, data, authConfig(token));
  }

  // 切换“完成/未完成”状态
  completeTodo(id, token) {
    return axios.put(`${API_URL}/todos/${id}/complete/`, {}, authConfig(token));
  }

  // 删除任务
  delete(id, token) {
    return axios.delete(`${API_URL}/todos/${id}/`, authConfig(token));
  }

  // 兼容旧代码里叫 deleteTodo 的地方
  deleteTodo(id, token) {
    return this.delete(id, token);
  }
}

const todoDataService = new TodoDataService();

export default todoDataService;
