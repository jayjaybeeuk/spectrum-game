import { lazy, Suspense } from "react";
import Home from "./pages";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";

// ⚡ Bolt: Lazy load CookieConsent to reduce initial bundle size since it's non-critical UI.
const CookieConsent = lazy(() => import("./components/cookie-consent/cookie-consent").then(m => ({ default: m.CookieConsent })));

function App() {
  return (
    <ChakraProvider>
      <Home />
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
    </ChakraProvider>
  );
}

export default App;
