import { memo } from "react";
import { Button } from "@chakra-ui/react";

interface DownloadLinkProps {
  /** URL of the TAP file to download */
  tapFile: string;
  /** Human-friendly name shown in the button label */
  label: string;
}

// ⚡ Bolt: Wrapped DownloadLink in React.memo().
// Impact: Prevents the download button from re-rendering when the parent updates
// due to emulator state changes, since tapFile and label only change when the
// selected game changes.
const DownloadLink = memo(({ tapFile, label }: DownloadLinkProps) => {
  return (
    <Button as="a" href={tapFile} download>
      Download {label}
    </Button>
  );
});

export { DownloadLink };
