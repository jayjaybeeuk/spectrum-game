import { memo, type ReactNode } from "react";
import { Select } from "@chakra-ui/react";

interface DropdownProps {
  children: ReactNode;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// ⚡ Bolt: Wrapped Dropdown in React.memo().
// Impact: Prevents the dropdown from re-rendering when the parent (Home) updates
// due to emulator state changes (like isScriptLoaded or isStarted).
const Dropdown = memo(({ children, value, handleChange }: DropdownProps) => {
  return (
    <Select placeholder="Select option" value={value} onChange={handleChange}>
      {children}
    </Select>
  );
});

export { Dropdown };
