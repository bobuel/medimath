import { generateMap, TileType } from "./generateMap";

test("generateMap returns a 50x50 array of valid tiles", () => {
  const tiles = ["grass", "forest", "water", "mountain", "road"];
  const map = generateMap(1);
  expect(map).toHaveLength(50);
  map.forEach((row) => {
    expect(row).toHaveLength(50);
    row.forEach((tile) => {
      expect(tiles).toContain(tile as TileType);
    });
  });
});
