import * as React from "react";
import { cn } from "@/lib/utils";

// Container
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Base styling with improved shadows and transitions
        "bg-white text-foreground flex flex-col rounded-lg border border-gray-200/80",
        // Enhanced shadow system
        "shadow-sm hover:shadow-md transition-all duration-200 ease-in-out",
        // Subtle hover effects
        "hover:border-gray-300/60 hover:-translate-y-0.5",
        // Dark mode support
        "dark:bg-gray-950 dark:border-gray-800 dark:shadow-gray-900/20",
        // Better accessibility
        "focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300",
        className
      )}
      {...props}
    />
  );
}

// Header with improved spacing and typography
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // Better spacing and alignment
        "flex items-start justify-between gap-4 px-6 py-5",
        // Subtle border with better color
        "border-b border-gray-100/80",
        // Dark mode
        "dark:border-gray-800/80",
        // Responsive spacing
        "sm:px-6 sm:py-5",
        className
      )}
      {...props}
    />
  );
}

// Title with improved typography hierarchy
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        // Enhanced typography
        "text-xl font-semibold tracking-tight text-gray-900 leading-tight",
        // Better line height for readability
        "sm:text-lg",
        // Dark mode
        "dark:text-gray-50",
        // Subtle color transitions
        "transition-colors duration-150",
        className
      )}
      {...props}
    />
  );
}

// Description with better contrast and spacing
function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn(
        // Improved readability
        "text-sm text-gray-600 leading-relaxed mt-1",
        // Better contrast
        "dark:text-gray-400",
        // Responsive text sizing
        "sm:text-sm",
        className
      )}
      {...props}
    />
  );
}

// Action section with better positioning
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        // Better positioning and spacing
        "flex items-center gap-2 text-sm text-gray-500",
        // Hover states for interactive elements
        "transition-colors duration-150",
        // Dark mode
        "dark:text-gray-400",
        // Ensure it doesn't shrink
        "flex-shrink-0",
        className
      )}
      {...props}
    />
  );
}

// Content with improved spacing system
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        // Better spacing system
        "px-6 py-5 flex-1",
        // Responsive spacing
        "sm:px-6 sm:py-5",
        // Better text color inheritance
        "text-gray-800 dark:text-gray-200",
        className
      )}
      {...props}
    />
  );
}

// Footer with enhanced button layout
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        // Improved layout and spacing
        "flex items-center justify-end gap-3 px-6 py-4",
        // Better border styling
        "border-t border-gray-100/80",
        // Background for visual separation
        "bg-gray-50/30",
        // Dark mode
        "dark:border-gray-800/80 dark:bg-gray-900/20",
        // Responsive spacing
        "sm:px-6 sm:py-4",
        // Ensure proper button spacing
        "[&>*]:min-w-0",
        className
      )}
      {...props}
    />
  );
}

// Additional utility component for card sections
function CardSection({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-section"
      className={cn(
        "px-6 py-4 border-b border-gray-100/80 last:border-b-0",
        "dark:border-gray-800/80",
        className
      )}
      {...props}
    />
  );
}

// Enhanced divider component
function CardDivider({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <hr
      data-slot="card-divider"
      className={cn(
        "border-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4",
        "dark:via-gray-700",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardSection,
  CardDivider,
};
