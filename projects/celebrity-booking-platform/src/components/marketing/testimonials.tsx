import { TESTIMONIALS } from "../../../prisma/seed-data";
import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";

export function Testimonials() {
  const [lead, ...rest] = TESTIMONIALS;
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8" aria-labelledby="testimonials-heading">
      <SectionHeading
        kicker="Client letters"
        title={<span id="testimonials-heading">Rooms we&apos;ve brought to their feet</span>}
        align="center"
        className="mb-16"
      />

      <Stagger className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* lead quote spans full height, set like a pull quote */}
        <StaggerItem className="lg:row-span-2">
          <figure className="hairline-gold relative flex h-full flex-col justify-between rounded-[var(--radius-xl)] border border-gold/25 bg-surface p-9">
            <span aria-hidden className="font-display text-7xl leading-none text-gold/40">
              “
            </span>
            <blockquote className="mt-2 font-display text-2xl font-medium leading-snug text-foreground">
              {lead.quote}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <Avatar name={lead.name} />
              <span>
                <span className="block text-sm font-semibold text-foreground">{lead.name}</span>
                <span className="block text-xs text-faint">{lead.role}</span>
              </span>
            </figcaption>
          </figure>
        </StaggerItem>

        {rest.map((t) => (
          <StaggerItem key={t.name}>
            <figure className="flex h-full flex-col justify-between rounded-[var(--radius-xl)] border border-border bg-surface p-7 transition-colors duration-300 hover:border-gold/30">
              <blockquote className="text-[15px] leading-relaxed text-muted">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={t.name} size="sm" />
                <span>
                  <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="block text-xs text-faint">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
