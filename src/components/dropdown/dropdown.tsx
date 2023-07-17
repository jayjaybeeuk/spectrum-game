import { ReactNode } from "react";
import { Select } from "@chakra-ui/react";

interface DropdownProps {
  children: ReactNode;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown = ({ children, value, handleChange }: DropdownProps) => {
  return (
    <Select placeholder="Select option" value={value} onChange={handleChange}>
      {children}
    </Select>
  );
};

export { Dropdown };
