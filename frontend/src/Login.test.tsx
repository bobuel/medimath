jest.mock('react-router-dom', () => ({
  Link: (props: React.ComponentProps<'a'>) => <a {...props} />,
}));
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from './App';

test('login form renders', () => {
  render(<Login />);
  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'pass' } });
  expect(screen.getByDisplayValue('a@b.com')).toBeInTheDocument();
});
