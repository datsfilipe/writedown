import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps {
  variant?: "red" | "green" | "slate";
  size?: "sm";
  children: React.ReactNode;
  extraClasses?: string;
}

const Button = ({
  variant,
  size,
  children,
  extraClasses,
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const getButtonClass = () => {
    if (size === "sm") {
      switch (variant) {
        case "red":
          return "rounded-full py-1 px-3 text-sm font-medium text-red-500 ring-2 ring-red-500 transition-colors duration-300 hover:bg-red-100 bg-red-50";
        case "green":
          return "rounded-full py-1 px-3 text-sm font-medium text-green-500 ring-2 ring-green-500 transition-colors duration-300 hover:bg-green-100 bg-green-50";
        case "slate":
          return "rounded-full py-1 px-3 text-sm font-medium text-slate-500 ring-2 ring-slate-500 transition-colors duration-300 hover:bg-slate-100 bg-slate-50";
        default:
          return "rounded-full py-1 px-3 text-sm font-medium text-slate-900 ring-2 ring-slate-900 transition-colors duration-300 hover:bg-slate-300";
      }
    }

    switch (variant) {
      case "red":
        return "inline-flex items-center justify-center px-5 py-2.5 bg-white border rounded-full border-red-900 text-sm font-medium text-red-900 hover:bg-red-200 transition-all duration-300";
      default:
        return "inline-flex items-center justify-center px-5 py-2.5 bg-slate-50 border rounded-full border-2 border-slate-900 text-sm font-medium text-slate-900 hover:bg-slate-200 transition-all duration-300";
    }
  };

  return (
    <button
      type="button"
      className={getButtonClass() + " " + extraClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
