import { lazy, Suspense } from "react";
import Home from "./pages";
import { ChakraProvider } from "@chakra-ui/react";
import { isAnalyticsEnabled } from "./analytics/clarity";
import "./App.css";

// ⚡ Bolt: Lazily load the CookieConsent component.
// Impact: Splits out the cookie consent UI and its dependencies from the main application bundle.
// The code is never loaded at all for users in environments where analytics are disabled.
const CookieConsent = lazy(() => import("./components/cookie-consent/cookie-consent").then(m => ({ default: m.CookieConsent })));

function App() {
  return (
    <ChakraProvider>
      <Home />
      {/* ⚡ Bolt: Only attempt to load the component if analytics are enabled. */}
      {isAnalyticsEnabled() && (
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      )}
    </ChakraProvider>
  );
}

export default App;
