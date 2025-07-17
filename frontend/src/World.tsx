import React, { useEffect, useRef, useState } from "react";
import { Archetype } from "./generateArchetypes";
import { generateMap, TileType } from "./generateMap";
import "./World.css";

export default function World() {
  const [character, setCharacter] = useState<Archetype | null>(null);
  const [map] = useState<TileType[][]>(() => generateMap(1));
  const [position, setPosition] = useState({ x: 25, y: 25 });
  const [step, setStep] = useState(0);
  const lastMove = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3001/api/character", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCharacter(data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/";
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastMove.current < 166) return;
      lastMove.current = now;
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") dy = -1;
      else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") dy = 1;
      else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") dx = -1;
      else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") dx = 1;
      if (dx === 0 && dy === 0) return;
      setStep((s) => 1 - s);
      setPosition((p) => {
        const nx = Math.max(0, Math.min(49, p.x + dx));
        const ny = Math.max(0, Math.min(49, p.y + dy));
        const tile = map[ny][nx];
        if (tile === "water" || tile === "mountain") return p;
        return { x: nx, y: ny };
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [map]);

  if (!character) return <div>Loading...</div>;

  const startX = Math.min(Math.max(0, position.x - 7), 35);
  const startY = Math.min(Math.max(0, position.y - 7), 35);
  const tiles: React.ReactElement[] = [];
  for (let y = startY; y < startY + 15; y += 1) {
    for (let x = startX; x < startX + 15; x += 1) {
      const tile = map[y][x];
      const key = `${x}-${y}`;
      tiles.push(
        <div key={key} className={`tile ${tile}`}>
          {x === position.x && y === position.y && (
            <div
              data-testid="player"
              data-x={position.x}
              data-y={position.y}
              className={`player step${step}`}
            />
          )}
        </div>,
      );
    }
  }

  return (
    <div>
      <h2>{character.name}</h2>
      <img
        src={character.avatarUrl}
        alt={character.name}
        width={100}
        height={100}
      />
      <ul>
        <li>HP: {character.stats.hp}</li>
        <li>Attack: {character.stats.attack}</li>
        <li>Defense: {character.stats.defense}</li>
      </ul>
      <button onClick={logout}>Log Out</button>
      <div data-testid="world" className="world">
        {tiles}
      </div>
    </div>
  );
}
