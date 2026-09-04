import { Button } from "@chakra-ui/react";

interface DownloadLinkProps {
  /** URL of the TAP file to download */
  tapFile: string;
  /** Human-friendly name shown in the button label */
  label: string;
}

const DownloadLink = ({ tapFile, label }: DownloadLinkProps) => {
  return (
    <Button as="a" href={tapFile} download>
      Download {label}
    </Button>
  );
};

export { DownloadLink };
