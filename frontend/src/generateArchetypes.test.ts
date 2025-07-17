import { generateArchetypes } from './generateArchetypes';

test('generateArchetypes returns three unique archetypes with required keys', () => {
  const archetypes = generateArchetypes();
  expect(archetypes).toHaveLength(3);
  const ids = new Set(archetypes.map(a => a.id));
  expect(ids.size).toBe(3);
  archetypes.forEach(a => {
    expect(a).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        avatarUrl: expect.any(String),
        stats: {
          hp: expect.any(Number),
          attack: expect.any(Number),
          defense: expect.any(Number),
        },
      })
    );
  });
});
