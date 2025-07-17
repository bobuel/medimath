import { useState } from 'react';
import { Archetype, generateArchetypes } from './generateArchetypes';

export default function CreateCharacter() {
  const [archetypes] = useState<Archetype[]>(generateArchetypes());

  const choose = async (a: Archetype) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await fetch('http://localhost:3001/api/character', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ archetype: a }),
    });
    window.location.href = '/world';
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {archetypes.map((a) => (
        <div key={a.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h3>{a.name}</h3>
          <img src={a.avatarUrl} alt={a.name} width={100} height={100} />
          <p>{a.description}</p>
          <ul>
            <li>HP: {a.stats.hp}</li>
            <li>Attack: {a.stats.attack}</li>
            <li>Defense: {a.stats.defense}</li>
          </ul>
          <button onClick={() => choose(a)}>Choose</button>
        </div>
      ))}
    </div>
  );
}
