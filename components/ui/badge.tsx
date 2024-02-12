import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/server/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  color?: "yellow" | "green" | "red";
}

function Badge({ className, variant, color, ...props }: BadgeProps) {
  // Define the mapping object
  const colorClasses = {
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  // Handle undefined color by providing a default class or an empty string
  // This ensures that colorClass is always a valid string, even if color is undefined
  const colorClass = color ? colorClasses[color] : "";

  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        colorClass, // Use the resolved color class
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
