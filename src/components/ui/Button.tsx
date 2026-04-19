import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  ...props
}: Props) {
  const base = "px-4 py-2 rounded text-sm font-medium transition";

  const styles =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-200 text-black hover:bg-gray-300";

  return (
    <button {...props} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}