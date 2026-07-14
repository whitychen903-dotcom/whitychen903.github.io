import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 text-[14px] leading-none";

  const variants = {
    primary: "bg-[#6F8436] text-white hover:bg-[#5a6e2b] active:bg-[#38460C]",
    secondary: "bg-[#E5D89E] text-[#38460C] hover:bg-[#d4c88e]",
    outline: "border border-[#6F8436] text-[#6F8436] hover:bg-[#6F8436] hover:text-white",
    ghost: "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-[12px]",
    md: "px-6 py-2.5",
    lg: "px-8 py-3 text-[16px]",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
