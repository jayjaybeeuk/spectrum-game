import { lazy, Suspense, useEffect, useState } from "react";
import Home from "./pages";
import { ChakraProvider } from "@chakra-ui/react";
import { isAnalyticsEnabled, initClarity } from "./analytics/clarity";
import { readStoredConsent } from "./hooks/useCookieConsent";
import "./App.css";

// ⚡ Bolt: Lazily load the CookieConsent component.
// Impact: Splits out the cookie consent UI and its dependencies from the main application bundle.
// The code is never loaded at all for users in environments where analytics are disabled.
const CookieConsent = lazy(() => import("./components/cookie-consent/cookie-consent").then(m => ({ default: m.CookieConsent })));

function App() {
  // ⚡ Bolt: Check consent synchronously before render to avoid downloading the chunk for returning users.
  // We use useState to hold the initial value so we don't read from localStorage on every render.
  const [initialConsent] = useState(readStoredConsent);
  const analyticsEnabled = isAnalyticsEnabled();

  useEffect(() => {
    if (analyticsEnabled && initialConsent === "granted") {
      initClarity();
    }
  }, [analyticsEnabled, initialConsent]);

  // ⚡ Bolt: Only render (and fetch) the CookieConsent chunk if the user hasn't made a choice yet.
  const needsConsent = analyticsEnabled && initialConsent === null;

  return (
    <ChakraProvider>
      <Home />
      {needsConsent && (
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      )}
    </ChakraProvider>
  );
}

export default App;
