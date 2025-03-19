
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "outlined";
  hover?: boolean;
  delay?: number;
}

const cardVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: delay * 0.1,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const hoverVariants: Variants = {
  initial: { 
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  hover: { 
    y: -5,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
  }
};

export function Card({ children, className, variant = "default", hover = false, delay = 0 }: CardProps) {
  const baseClasses = cn(
    "rounded-xl overflow-hidden",
    variant === "default" && "bg-white dark:bg-gray-800 shadow-sm",
    variant === "glass" && "glass-card",
    variant === "outlined" && "border border-gray-200 dark:border-gray-700",
    className
  );

  return (
    <motion.div
      className={baseClasses}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      whileHover={hover ? "hover" : undefined}
      variants={hover ? { ...cardVariants, ...hoverVariants } : cardVariants}
    >
      {children}
    </motion.div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn("px-6 py-4 bg-gray-50 dark:bg-gray-900/50", className)}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn("text-sm text-gray-500 dark:text-gray-400", className)}>{children}</p>;
}
