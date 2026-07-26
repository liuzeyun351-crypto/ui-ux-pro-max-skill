"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 py-5 text-left text-base font-medium text-foreground transition-colors hover:text-gold",
          className
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-muted transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:border-gold group-hover:text-gold group-data-[state=open]:rotate-45 group-data-[state=open]:border-gold group-data-[state=open]:text-gold"
        >
          +
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.25s_ease-out] data-[state=open]:animate-[accordion-down_0.3s_var(--ease-out-expo)]"
      {...props}
    >
      <div className={cn("pb-5 pr-10 text-sm leading-relaxed text-muted", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
