# Spectrum Game

This repository contains a collection of Spectrum Basic games that are held as BAS files and are compiled using ZX Basic to run at assembled games speed.

## Getting Started

### Running the web server

To get started, clone this repository to your local machine and compile the BAS files using ZX Basic. You can then run the compiled games on your Spectrum emulator or hardware.

To and run the games, simple run `yarn dev` to run the compile the games, boot into a JS emulator and allow you to play the games via a website.

If you just want to compile the games for use on an emulator, you can just run `yarn build` for Mac and Linus, or `yarn build:win` for windows platforms.

### Converting games to SNA formats

1. Build and run the container:

```bash
docker compose build
docker compose up -d
```

2. Convert files:

```bash
# Convert single file
docker compose run spectrum convert yourgame.tzx

# Or open interactive shell
docker compose exec spectrum bash
```

## ZX Basic and JSSpectrum Licenses

Please note that ZX Basic and JSSpectrum have their own licenses, which you should review before using them to create or run Spectrum Basic games. You can find the licenses for ZX Basic at [Boriel's github page](https://github.com/boriel/zxbasic) and JSSpectrum in their respective repositories.

## Contributing

If you would like to contribute to this repository, please fork the project and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
