import React from "react";

import "./Button.css";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
};

export default function Button({
  children,
  className,
  type,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`button-primary ${className ? className : ""}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
