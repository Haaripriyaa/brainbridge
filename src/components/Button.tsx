
import { ReactNode, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "back" | "icon";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) => {
  // Variant styles
  const variants = {
    primary: "bg-brainbridge-purple text-white hover:bg-brainbridge-lightpurple shadow-sm",
    secondary: "bg-brainbridge-purple text-white hover:bg-brainbridge-lightpurple shadow-sm",
    outline: "border border-brainbridge-purple text-brainbridge-purple hover:bg-purple-50 bg-transparent",
    ghost: "hover:bg-gray-100 text-gray-800 bg-transparent",
    link: "text-brainbridge-purple hover:underline p-0 bg-transparent",
    back: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm",
    icon: "p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm",
  };

  // Size styles
  const sizes = {
    sm: "text-xs py-1.5 px-3 rounded",
    md: "text-sm py-2 px-4 rounded-md",
    lg: "text-base py-2.5 px-5 rounded-lg",
  };

  return (
    <button
      className={cn(
        "font-medium relative transition-all duration-200 flex items-center justify-center",
        variants[variant],
        variant !== "icon" ? sizes[size] : "",
        fullWidth ? "w-full" : "",
        isLoading ? "opacity-80 pointer-events-none" : "",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className={cn("flex items-center gap-2", isLoading ? "invisible" : "")}>
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </div>
    </button>
  );
};

export default Button;
