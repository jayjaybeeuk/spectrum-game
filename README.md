# Spectrum Game

This repository contains a collection of Spectrum Basic games that are held as BAS files and are compiled using ZX Basic to run at assembled games speed.

## Getting Started

### Running the web server

To get started, clone this repository to your local machine and compile the BAS files using ZX Basic. You can then run the compiled games on your Spectrum emulator or hardware.

To and run the games, simple run `yarn dev` to run the compile the games, boot into a JS emulator and allow you to play the games via a website.

If you just want to compile the games for use on an emulator, you can just run `yarn build` for Mac and Linus, or `yarn build:win` for windows platforms.

### Running the tests

Frontend unit and component tests use [Vitest](https://vitest.dev/) with React Testing Library:

```bash
yarn test        # single run
yarn test:watch  # watch mode
```

### Analytics (optional)

The site can use [Microsoft Clarity](https://clarity.microsoft.com/) for anonymised usage analytics. It is off by default:

1. Copy `.env.example` to `.env` and set `VITE_CLARITY_ID` to your Clarity project ID (`.env` is git-ignored).
2. Clarity only loads in production builds (`yarn build`), never under `yarn dev`.
3. Visitors are shown a consent banner; the Clarity tag is only injected after they click **Accept**. Their choice is stored in `localStorage`.

### Converting games to SNA formats

`scripts/convert.sh` converts `.tzx` / `.tap` tape images to `.sna` snapshots using `tzx2sna` and `tap2sna`. The easiest way to run it is via the Docker container, which mounts `./public/games` as its working directory:

1. Build the container:

```bash
docker compose build
```

2. Convert files (the `.sna` is written next to the input):

```bash
# Convert every .tzx / .tap in public/games
docker compose run --rm spectrum convert

# Convert specific files
docker compose run --rm spectrum convert snake.tap breakout.tap

# Write snapshots to a different directory (relative to /games in the container)
docker compose run --rm spectrum convert -o snapshots snake.tap

# Or open an interactive shell
docker compose run --rm spectrum bash
```

The script exits non-zero if no input files are found or any conversion fails. Run `convert -h` for usage.

## ZX Basic and JSSpectrum Licenses

Please note that ZX Basic and JSSpectrum have their own licenses, which you should review before using them to create or run Spectrum Basic games. You can find the licenses for ZX Basic at [Boriel's github page](https://github.com/boriel/zxbasic) and JSSpectrum in their respective repositories.

## Contributing

If you would like to contribute to this repository, please fork the project and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
