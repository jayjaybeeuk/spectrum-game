import { useRef, useState, type ChangeEvent } from "react";
import { Dropdown, DownloadLink } from "../../components";
import useLoadJSSpeccy from "../../hooks/useLoadJSSpeccy";

const Home = () => {
  const jssSpeccyRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState("helloworld.tap");

  useLoadJSSpeccy(jssSpeccyRef, `/games/${selectedOption}`);

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Dropdown handleChange={handleOptionChange} value={selectedOption}>
        <option value="helloworld.tap">Hello World</option>
        <option value="breakout.tap">Breakout</option>
        <option value="snake.tap">Snake</option>
        <option value="northampton-adventure.tap">Northampton Adventure</option>
        <option value="1-helloworld-zx-basic-playground.tap">
          Test - Hello World Playground
        </option>
        <option value="2-graphics-bank-switching.tap">
          Test - Graphics Bank Switching
        </option>
        <option value="3-loop-function.tap">Test - Loop function</option>
        <option value="4-circle-plot.tap">Test - Circle plot</option>
        <option value="5-basic-platform-logic.tap">Test - Basic platform logic</option>
      </Dropdown>
      <div id="jsspeccy" ref={jssSpeccyRef} />

      {selectedOption && (
        <div>
          <div>
            You can download and play this game on an emulator via this tap
            file:
          </div>
          <DownloadLink tapFile={`/games/${selectedOption}`} />
          <div>
            To see all of the games available,{" "}
            <a
              target="_blank"
              href="https://github.com/jayjaybeeuk/spectrum-game" rel="noreferrer"
            >
              go to my GitHub page
            </a>
            .
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
