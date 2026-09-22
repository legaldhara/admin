import type { ButtonProps } from "../utils/types";
import type React from "react";

interface CustomButtonProps extends ButtonProps {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  asChild?: boolean;
  type?: "button" | "submit" | "reset";
}

function Button({
  variant = "orange",
  size = "medium",
  disabled,
  name,
  onClick,
  children,
  className = "",
  icon,
  iconPosition = "left",
}: CustomButtonProps) {
  const baseClasses = `rounded-full font-medium text-center whitespace-nowrap flex justify-center items-center`;

  const sizeClasses = {
    small: "text-sm py-1.5 px-5 w-15",
    medium: "text-base py-3 px-6 w-48",
    large: "text-lg py-4 px-8 w-64",
    tiny: "text-xs py-1 px-4",
  };

  const variantClasses = {
    orange: "bg-[#f7892a] text-white border border-[#f7892a]",
    "transparent-orange": "bg-transparent text-[#f7892a] border border-[#f7892a]",
    white: "bg-white text-[#f7892a] border border-white",
    "transparent-white": "bg-transparent text-white border border-white",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} '' ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {children || name}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}

export default Button;
