import React from "react";
import { trpc } from "@/lib/trpc";
import { normalizeSiteLanguage } from "@shared/siteLanguages";
import { localizeTestimonial } from "@/lib/testimonialCopy";
import MotionReveal from "./MotionReveal";

export default function Testimonials({
  language = "en",
}: {
  language?: string;
}) {
  const locale = normalizeSiteLanguage(language);
  const { data: testimonials, isLoading } =
    trpc.testimonials.getByLanguage.useQuery({ language: locale });
  const title =
    locale === "ru"
      ? "Отзывы брендов"
      : locale === "hy"
        ? "Բրենդների կարծիքները"
        : "Brand testimonials";
  if (isLoading) return null;
  if (!testimonials?.length) return null;
  return (
    <section
      className="mk-section mk-testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className="mk-wrap">
        <MotionReveal>
          <h2 id="testimonials-title">
            {title}
            <span className="mk-dot">.</span>
          </h2>
        </MotionReveal>
        <div className="mk-testimonial-grid">
          {testimonials
            .map(item => localizeTestimonial(item, locale))
            .map(item => (
              <MotionReveal key={item.id} className="mk-quote">
                <blockquote lang={item.language}>
                  <p>“{item.quote}”</p>
                </blockquote>
                <footer>
                  <strong>{item.authorName}</strong>
                  {item.authorRole && <span>{item.authorRole}</span>}
                  <span className="mk-quote-brand">{item.brandName}</span>
                </footer>
              </MotionReveal>
            ))}
        </div>
      </div>
    </section>
  );
}
