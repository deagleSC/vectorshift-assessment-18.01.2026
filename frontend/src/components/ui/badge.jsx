import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Node category variants
        input: "border-transparent bg-blue-500/10 text-blue-600 border-blue-500/20",
        output: "border-transparent bg-violet-500/10 text-violet-600 border-violet-500/20",
        ai: "border-transparent bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
        logic: "border-transparent bg-amber-500/10 text-amber-600 border-amber-500/20",
        data: "border-transparent bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        integration: "border-transparent bg-pink-500/10 text-pink-600 border-pink-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };



