import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('renders the navbar and a login link for a logged-out user', () => {
  render(<App />);

  // 品牌名
  expect(screen.getByText('Todo App')).toBeInTheDocument();
  // 未登录时导航栏只有 Login / Sign up
  expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument();
});
