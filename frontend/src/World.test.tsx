import { render, screen, fireEvent } from "@testing-library/react";
import World from "./World";
import { Archetype } from "./generateArchetypes";

jest.mock("./generateMap", () => ({
  generateMap: () => {
    const map = Array.from({ length: 50 }, () => Array(50).fill("grass"));
    map[25][26] = "water";
    return map;
  },
}));

const character: Archetype = {
  id: "knight",
  name: "Knight",
  description: "",
  avatarUrl: "x",
  stats: { hp: 1, attack: 1, defense: 1 },
};

global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(character) }),
) as unknown as typeof fetch;

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: () => "token",
    removeItem: jest.fn(),
  },
});

test("character moves around map and blocked by water", async () => {
  jest.useFakeTimers();
  render(<World />);
  await screen.findByTestId("world");
  const player = screen.getByTestId("player");
  expect(player.getAttribute("data-x")).toBe("25");
  fireEvent.keyDown(document, { key: "ArrowRight" });
  jest.advanceTimersByTime(200);
  expect(player.getAttribute("data-x")).toBe("25");
  fireEvent.keyDown(document, { key: "ArrowUp" });
  jest.advanceTimersByTime(200);
  await screen.findByTestId("player");
  expect(screen.getByTestId("player").getAttribute("data-y")).toBe("24");
});
