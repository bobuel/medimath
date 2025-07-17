export interface Archetype {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
  };
}

export function generateArchetypes(): Archetype[] {
  return [
    {
      id: 'knight',
      name: 'Knight',
      description: 'Armored warrior with unmatched defense.',
      avatarUrl: 'https://placekitten.com/200/200',
      stats: { hp: 120, attack: 8, defense: 15 },
    },
    {
      id: 'mage',
      name: 'Mage',
      description: 'Master of arcane arts with powerful attacks.',
      avatarUrl: 'https://placekitten.com/201/200',
      stats: { hp: 80, attack: 15, defense: 5 },
    },
    {
      id: 'ranger',
      name: 'Ranger',
      description: 'Swift archer striking from afar.',
      avatarUrl: 'https://placekitten.com/200/201',
      stats: { hp: 100, attack: 10, defense: 8 },
    },
  ];
}
