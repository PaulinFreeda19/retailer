import { useState } from "react";

interface Props {
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  onChange,
  placeholder = "Search...",
}: Props) {
  const [value, setValue] = useState("");

  const handleChange = (val: string) => {
    setValue(val);
    onChange(val);
  };

  return (
    <input
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}