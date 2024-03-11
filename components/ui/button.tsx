"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/server/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        confirmation:
          "bg-green-300 text-primary hover:bg-green-600 hover:text-primary-foreground",
        destructive:
          "bg-red-300 text-primary hover:bg-destructive hover:text-primary-foreground",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, forwardedRef) => {
    // Separate motion-specific props
    const motionProps: MotionProps = {
      whileHover: { scale: 1.02, transition: { duration: 0.2 } },
      whileTap: { scale: 0.75, transition: { duration: 0.2 } },
    };

    // Determine the component to use
    const Comp = asChild ? Slot : motion.button;

    // Apply motionProps only if Comp is motion.button
    const compProps =
      Comp === motion.button ? { ...props, ...motionProps } : props;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={forwardedRef}
        {...compProps} // Spread the appropriate props based on the component
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
