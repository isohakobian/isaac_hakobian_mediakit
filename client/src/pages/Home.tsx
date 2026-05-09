import { Button } from "@/components/ui/button";
import { Mail, Instagram, ArrowRight } from "lucide-react";
import { useState } from "react";

/**
 * Editorial Minimalism Design System
 * - Typography: Playfair Display (headings) + Inter (body)
 * - Color: White background, deep charcoal text, warm gold accents
 * - Layout: Full-width image sections with text overlays
 * - Vibe: High-end editorial, cinematic, premium
 */

export default function Home() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-6 flex gap-4">
        <a href="#collaboration" className="text-sm font-medium hover:text-accent transition-colors">
          Collaboration
        </a>
        <a href="#contact" className="text-sm font-medium hover:text-accent transition-colors">
          Contact
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663311211269/WZfdVfUKwq8MfAdGMwgGoQ/hero_main-PWDXyxppzXPuH3VQi3odAz.webp)',
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl px-6">
          <h1
            className="text-7xl md:text-8xl font-bold mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Isaac Hakobian
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
            Quiet Luxury Lifestyle Content Creator
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#collaboration" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 hover:opacity-90 transition-opacity">
              Explore Collaboration <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif", color: "#8B4513" }}>
                3.5M+
              </div>
              <p className="text-lg text-gray-600">Monthly Reach</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif", color: "#8B4513" }}>
                69%
              </div>
              <p className="text-lg text-gray-600">Male Audience</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif", color: "#8B4513" }}>
                25-44
              </div>
              <p className="text-lg text-gray-600">Primary Age Group</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-12">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              About the Brand
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              I create cinematic lifestyle content that celebrates the philosophy of Quiet Luxury—understated elegance, premium quality, and authentic storytelling. My audience consists of discerning men aged 25-44 who value craftsmanship, personal development, and refined aesthetics. Every frame is intentional, every collaboration is strategic.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="collaboration" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-16" style={{ fontFamily: "Playfair Display, serif" }}>
            Recent Collaborations
          </h2>

          <div className="space-y-20">
            {/* On Hill Sport */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                  On Hill Sport
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Premium running apparel and weighted accessories. Created 4 Reels showcasing the brand's products in authentic lifestyle scenarios. Achieved high engagement with direct product inquiries in comments.
                </p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold">8.2%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Direct Inquiries</p>
                    <p className="text-2xl font-bold">15+</p>
                  </div>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">On Hill Sport Campaign</p>
              </div>
            </div>

            {/* Keybell */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
              <div className="h-64 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center md:order-last">
                <p className="text-gray-600">Keybell Accessories</p>
              </div>
              <div className="md:order-first">
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                  Keybell
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Russian luxury accessories brand. Test collaboration with custom-engraved keychain. Positioned as premium ambasador with link in bio and ongoing content production.
                </p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Bio Link CTR</p>
                    <p className="text-2xl font-bold">12%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Saves</p>
                    <p className="text-2xl font-bold">340</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Packages */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-16" style={{ fontFamily: "Playfair Display, serif" }}>
            Collaboration Packages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Link in Bio */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Link in Bio
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: "#8B4513" }}>
                ₽10,000
              </p>
              <p className="text-gray-600 mb-6">/month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Brand link in profile bio</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>3.5M+ monthly reach</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Passive traffic generation</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Inquire
              </Button>
            </div>

            {/* Single Reel */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Single Reel
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: "#8B4513" }}>
                ₽15,000
              </p>
              <p className="text-gray-600 mb-6">/reel</p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Professional production</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Authentic integration</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Full usage rights</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Inquire
              </Button>
            </div>

            {/* Ambassador */}
            <div className="border-2 border-accent p-8 hover:shadow-lg transition-shadow bg-gray-50">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Ambassador
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: "#8B4513" }}>
                Custom
              </p>
              <p className="text-gray-600 mb-6">Long-term partnership</p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Link in bio + content</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>4+ reels/month</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Exclusive partnership</span>
                </li>
              </ul>
              <Button className="w-full">
                Let's Talk
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Playfair Display, serif" }}>
            Get in Touch
          </h2>

          <div className="bg-white p-8 rounded-lg border border-gray-300">
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-lg text-accent font-semibold">Thank you! I'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-gray-300 flex gap-6 justify-center">
              <a href="https://instagram.com/isaac_hakobian" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-accent transition-colors">
                <Instagram size={24} />
              </a>
              <a href="mailto:isaac@example.com" className="text-gray-600 hover:text-accent transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-300">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2026 Isaac Hakobian. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
