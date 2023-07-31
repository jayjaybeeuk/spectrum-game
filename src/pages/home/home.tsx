import { useRef, useState, ChangeEvent } from "react";
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
      </Dropdown>
      <div id="jsspeccy" ref={jssSpeccyRef}></div>

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
              href="https://github.com/jayjaybeeuk/spectrum-game"
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
