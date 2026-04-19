import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-600">{label}</label>}

      <input
        {...props}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}