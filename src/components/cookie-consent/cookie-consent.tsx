import { useEffect } from "react";
import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import useCookieConsent from "../../hooks/useCookieConsent";
import { initClarity, isAnalyticsEnabled } from "../../analytics/clarity";

/**
 * Minimal cookie/analytics consent banner.
 *
 * Only rendered when analytics is actually enabled for this build (production +
 * VITE_CLARITY_ID set). Clarity is loaded only after the visitor clicks Accept;
 * the choice is remembered in localStorage.
 */
const CookieConsent = () => {
  const { consent, grant, deny } = useCookieConsent();
  const analyticsEnabled = isAnalyticsEnabled();

  useEffect(() => {
    if (analyticsEnabled && consent === "granted") {
      initClarity();
    }
  }, [analyticsEnabled, consent]);

  if (!analyticsEnabled || consent !== null) {
    return null;
  }

  return (
    <Box
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="gray.800"
      color="white"
      px={4}
      py={3}
      boxShadow="0 -2px 8px rgba(0, 0, 0, 0.3)"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        gap={3}
        maxW="960px"
        mx="auto"
      >
        <Text fontSize="sm">
          This site uses Microsoft Clarity to record anonymised usage data
          (session replays and heatmaps) so I can see how the games are played.
          Nothing is loaded unless you accept.{" "}
          <Link
            href="https://privacy.microsoft.com/privacystatement"
            isExternal
            textDecoration="underline"
          >
            Microsoft privacy statement
          </Link>
          .
        </Text>
        <Flex gap={2} justify={{ base: "flex-end", md: "initial" }}>
          <Button size="sm" variant="outline" colorScheme="whiteAlpha" onClick={deny}>
            Decline
          </Button>
          <Button size="sm" colorScheme="blue" onClick={grant}>
            Accept
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export { CookieConsent };
