import { useRef } from "react";
import { Dropdown } from "../../components/dropdown";
import useLoadJSSpeccy from "../../hooks/useLoadJSSpeccy";

import { useState } from "react";

const Home = () => {
  const jssSpeccyRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState("helloworld.tap");

  useLoadJSSpeccy(jssSpeccyRef, `/games/${selectedOption}`);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Dropdown handleChange={handleOptionChange} value={selectedOption}>
        <option value="helloworld.tap">Hello World</option>
        <option value="breakout.tap">Another Game</option>
      </Dropdown>
      <div id="jsspeccy" ref={jssSpeccyRef}></div>
    </>
  );
};

export default Home;
