export interface Game {
  /** TAP filename relative to /public/games (e.g. "snake.tap") */
  file: string;
  /** Human-friendly name shown in the dropdown and download button */
  name: string;
}

export const GAMES_PATH = "/games";

export const GAMES: Game[] = [
  { file: "helloworld.tap", name: "Hello World" },
  { file: "breakout.tap", name: "Breakout" },
  { file: "snake.tap", name: "Snake" },
  { file: "northampton-adventure.tap", name: "Northampton Adventure" },
  {
    file: "2-graphics-bank-switching.tap",
    name: "Test - Graphics Bank Switching"
  },
  { file: "3-loop-function.tap", name: "Test - Loop function" },
  { file: "4-circle-plot.tap", name: "Test - Circle plot" },
  { file: "5-basic-platform-logic.tap", name: "Test - Basic platform logic" }
];

export const DEFAULT_GAME = GAMES[0];

export const getGameUrl = (file: string) => `${GAMES_PATH}/${file}`;

export const findGame = (file: string) =>
  GAMES.find((game) => game.file === file);
