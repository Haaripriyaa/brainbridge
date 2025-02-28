
import { InputHTMLAttributes, forwardRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, X } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  showClearButton = false,
  onClear,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClear = () => {
    if (onClear) onClear();
  };

  const getInputType = () => {
    if (props.type === "password") {
      return showPassword ? "text" : "password";
    }
    return props.type;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={getInputType()}
          className={cn(
            "w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm transition-colors focus:border-brainbridge-blue focus:outline-none focus:ring-1 focus:ring-brainbridge-blue",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
            leftIcon ? "pl-10" : "",
            (rightIcon || props.type === "password" || showClearButton) ? "pr-10" : "",
            className
          )}
          {...props}
        />
        {props.type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {props.type !== "password" && rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
        {props.type !== "password" && !rightIcon && showClearButton && props.value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
