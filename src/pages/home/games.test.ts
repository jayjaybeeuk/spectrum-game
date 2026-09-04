import { describe, expect, it } from "vitest";
import { DEFAULT_GAME, GAMES, findGame, getGameUrl } from "./games";

describe("games list", () => {
  it("has at least one game and a default that is in the list", () => {
    expect(GAMES.length).toBeGreaterThan(0);
    expect(GAMES).toContain(DEFAULT_GAME);
  });

  it("uses unique .tap filenames and non-empty names", () => {
    const files = GAMES.map((g) => g.file);
    expect(new Set(files).size).toBe(files.length);
    for (const game of GAMES) {
      expect(game.file).toMatch(/\.tap$/);
      expect(game.name.trim()).not.toBe("");
    }
  });

  it("builds the public URL for a game file", () => {
    expect(getGameUrl("snake.tap")).toBe("/games/snake.tap");
  });

  it("finds games by filename", () => {
    expect(findGame("snake.tap")?.name).toBe("Snake");
    expect(findGame("does-not-exist.tap")).toBeUndefined();
  });
});
