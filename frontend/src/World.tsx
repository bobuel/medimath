import React, { useEffect, useRef, useState } from "react";
import { Archetype } from "./generateArchetypes";
import { generateMap, TileType } from "./generateMap";
import { generateMathProblem, MathProblem } from "./generateMathProblem";
import "./World.css";

export default function World() {
  const [character, setCharacter] = useState<Archetype | null>(null);
  const [map, setMap] = useState<TileType[][]>(() => generateMap());
  const [position, setPosition] = useState({ x: 25, y: 25 });
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState(() => {
    const stored = sessionStorage.getItem("points");
    return stored ? Number(stored) : 0;
  });
  const [challenge, setChallenge] = useState<
    | { pos: { x: number; y: number }; problem: MathProblem; attempts: number }
    | null
  >(null);
  const [win, setWin] = useState(false);
  const lastMove = useRef(0);
  const [inputAnswer, setInputAnswer] = useState("");

  const closeChallenge = React.useCallback(() => {
    if (!challenge) return;
    const newMap = map.map((row) => row.slice());
    newMap[challenge.pos.y][challenge.pos.x] = "grass";
    setMap(newMap);
    setChallenge(null);
  }, [challenge, map]);

  const submitAnswer = () => {
    if (!challenge) return;
    if (parseInt(inputAnswer, 10) === challenge.problem.answer) {
      setPoints((p) => p + challenge.problem.points);
      closeChallenge();
    } else if (challenge.attempts === 0) {
      setChallenge({ ...challenge, attempts: 1 });
    } else {
      closeChallenge();
    }
    setInputAnswer("");
  };

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
    if (!challenge) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChallenge();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [challenge, closeChallenge]);

  useEffect(() => {
    sessionStorage.setItem("points", points.toString());
    if (points >= 10) setWin(true);
  }, [points]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (challenge || win) return;
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
      let open = false;
      let cx = 0;
      let cy = 0;
      setPosition((p) => {
        const nx = Math.max(0, Math.min(49, p.x + dx));
        const ny = Math.max(0, Math.min(49, p.y + dy));
        const tile = map[ny][nx];
        if (tile === "water" || tile === "mountain") return p;
        if (tile === "challenge") {
          open = true;
          cx = nx;
          cy = ny;
        }
        return { x: nx, y: ny };
      });
      if (open) {
        setChallenge({
          pos: { x: cx, y: cy },
          problem: generateMathProblem((Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3),
          attempts: 0,
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [map, challenge, win]);

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
      <div className="hud">Points: {points}/10</div>
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
      {challenge && (
        <div className="modal" role="dialog">
          <div>
            <h3>Math Challenge!</h3>
            <p>{challenge.problem.question}</p>
            <input
              autoFocus
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
            />
            <button onClick={submitAnswer}>Submit</button>
          </div>
        </div>
      )}
      {win && (
        <div className="win-overlay">
          <div>
            <h2>You Win!</h2>
            <p>Total Points: {points}</p>
            <button
              onClick={() => {
                setPoints(0);
                sessionStorage.setItem("points", "0");
                setMap(generateMap());
                setPosition({ x: 25, y: 25 });
                setWin(false);
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
