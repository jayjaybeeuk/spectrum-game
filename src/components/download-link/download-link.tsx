import { Button } from "@chakra-ui/react";

const DownloadLink = ({ tapFile }: { tapFile: string }) => {
  return (
    <>
      <Button as="a" href={`${tapFile}`} download>
        Download {tapFile}
      </Button>
    </>
  );
};

export { DownloadLink };
