import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

export function FaqSection({
  items,
  compact,
}: {
  items: { q: string; a: string }[];
  compact?: boolean;
}) {
  return (
    <section
      className={`mx-auto max-w-4xl px-5 sm:px-8 ${compact ? "py-0" : "py-28"}`}
      aria-labelledby="faq-heading"
    >
      {!compact && (
        <SectionHeading
          kicker="Questions, answered"
          title={<span id="faq-heading">Before you raise the curtain</span>}
          align="center"
          className="mb-12"
        />
      )}
      <Reveal>
        <Accordion type="single" collapsible className="rounded-[var(--radius-xl)] border border-border bg-surface px-7">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
