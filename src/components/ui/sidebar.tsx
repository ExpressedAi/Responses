"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Sidebar({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col border-r bg-background",
        className
      )}
      {...props}
    />
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-4 py-3 border-b", className)} {...props} />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-2 py-2", className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-4 py-3 border-t", className)} {...props} />
  );
}

export function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex min-w-0 flex-1", className)} {...props} />
  );
}

export function SidebarRail({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("w-0 lg:w-1", className)} {...props} />
  );
}

export function SidebarTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm",
        className
      )}
      {...props}
    >
      {children ?? "Toggle sidebar"}
    </button>
  );
}