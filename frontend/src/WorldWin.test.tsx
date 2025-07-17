import { render, screen, fireEvent } from '@testing-library/react';
import World from './World';
import { Archetype } from './generateArchetypes';

jest.mock('./generateMap', () => ({
  generateMap: () => Array.from({ length: 50 }, () => Array(50).fill('grass')),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      id: 'knight',
      name: 'Knight',
      description: '',
      avatarUrl: 'x',
      stats: { hp: 1, attack: 1, defense: 1 },
    } as Archetype),
  }),
) as unknown as typeof fetch;

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: () => 'token',
    removeItem: jest.fn(),
  },
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: () => '10',
    setItem: jest.fn(),
  },
});

test('shows win overlay when points >= 10 and restarts', async () => {
  render(<World />);
  expect(await screen.findByText(/You Win!/)).toBeInTheDocument();
  fireEvent.click(screen.getByText('Play Again'));
  expect(screen.queryByText(/You Win!/)).not.toBeInTheDocument();
});
