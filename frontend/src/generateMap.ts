export type TileType = "grass" | "forest" | "water" | "mountain" | "road";

function mulberry32(seed: number): () => number {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMap(seed = Date.now()): TileType[][] {
  const rand = mulberry32(seed);
  const map: TileType[][] = [];
  for (let y = 0; y < 50; y += 1) {
    const row: TileType[] = [];
    for (let x = 0; x < 50; x += 1) {
      const r = rand();
      let tile: TileType;
      if (r < 0.05) tile = "water";
      else if (r < 0.1) tile = "mountain";
      else if (r < 0.25) tile = "forest";
      else if (r < 0.3) tile = "road";
      else tile = "grass";
      row.push(tile);
    }
    map.push(row);
  }
  return map;
}
