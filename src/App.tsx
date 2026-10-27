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
  const analyticsEnabled = isAnalyticsEnabled();

  // ⚡ Bolt: Check consent synchronously before render to avoid downloading the chunk for returning users.
  // We use a lazy initializer in useState to only read from localStorage if analytics are enabled,
  // preventing a synchronous blocking disk read on initial load when analytics are disabled.
  const [initialConsent] = useState(() => analyticsEnabled ? readStoredConsent() : null);

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
