"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function Pagination({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  );
}

export function PaginationItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li className={cn("list-none", className)} {...props} />;
}

type AnchorProps = React.ComponentProps<"a"> & {
  isActive?: boolean;
};

export function PaginationLink({
  className,
  isActive,
  ...props
}: AnchorProps) {
  return (
    <a
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "outline", size: "icon" }),
        "h-9 w-9",
        className
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  ...props
}: AnchorProps) {
  return (
    <a
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "h-9 w-9",
        className
      )}
      {...props}
      aria-label="Go to previous page"
    >
      <ChevronLeft className="h-4 w-4" />
    </a>
  );
}

export function PaginationNext({
  className,
  ...props
}: AnchorProps) {
  return (
    <a
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "h-9 w-9",
      className)}
      {...props}
      aria-label="Go to next page"
    >
      <ChevronRight className="h-4 w-4" />
    </a>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}