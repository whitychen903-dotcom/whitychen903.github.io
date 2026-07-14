import { cn } from "@/lib/utils";
import Link from "next/link";

interface CardProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Card({ href, className, children }: CardProps) {
  const base =
    "group block bg-white rounded-2xl border border-neutral-200/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-neutral-300";

  if (href) {
    return (
      <Link href={href} className={cn(base, className)}>
        {children}
      </Link>
    );
  }

  return <div className={cn(base, className)}>{children}</div>;
}

export function CardImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("aspect-[16/10] overflow-hidden bg-neutral-100", className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full",
        className
      )}
    >
      {children}
    </span>
  );
}
