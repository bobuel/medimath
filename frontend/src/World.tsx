import { useEffect, useState } from 'react';
import { Archetype } from './generateArchetypes';

export default function World() {
  const [character, setCharacter] = useState<Archetype | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:3001/api/character', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCharacter(data));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = '/';
  };

  if (!character) return <div>Loading...</div>;

  return (
    <div>
      <h2>{character.name}</h2>
      <img src={character.avatarUrl} alt={character.name} width={100} height={100} />
      <ul>
        <li>HP: {character.stats.hp}</li>
        <li>Attack: {character.stats.attack}</li>
        <li>Defense: {character.stats.defense}</li>
      </ul>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
