import { trpc } from "@/lib/trpc";
import { Star } from "lucide-react";

interface TestimonialsProps {
  language?: string;
}

export default function Testimonials({ language = "en" }: TestimonialsProps) {
  const { data: testimonials, isLoading } = trpc.testimonials.getByLanguage.useQuery({
    language,
  });

  if (isLoading) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-16" style={{ fontFamily: "Playfair Display, serif" }}>
            {language === "ru" ? "Отзывы брендов" : language === "es" ? "Testimonios de marcas" : language === "ar" ? "آراء العلامات التجارية" : "Brand Testimonials"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 p-8 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold mb-16" style={{ fontFamily: "Playfair Display, serif" }}>
          {language === "ru" ? "Отзывы брендов" : language === "es" ? "Testimonios de marcas" : language === "ar" ? "آراء العلامات التجارية" : "Brand Testimonials"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border border-gray-300 p-8 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} fill="#8B4513" stroke="#8B4513" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="border-t border-gray-300 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.authorName}</p>
                {testimonial.authorRole && (
                  <p className="text-sm text-gray-600">{testimonial.authorRole}</p>
                )}
                <p className="text-sm font-medium text-accent mt-2">{testimonial.brandName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
