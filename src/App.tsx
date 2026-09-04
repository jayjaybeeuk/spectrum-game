import Home from "./pages";
import { ChakraProvider } from "@chakra-ui/react";
import { CookieConsent } from "./components";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <Home />
      <CookieConsent />
    </ChakraProvider>
  );
}

export default App;
