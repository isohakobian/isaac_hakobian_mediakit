import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, ArrowRight, Linkedin, MessageCircle, Youtube, Tv, Music } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Testimonials from "@/components/Testimonials";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Editorial Minimalism Design System
 * - Typography: Playfair Display (headings) + Inter (body)
 * - Color: White background, deep charcoal text, warm gold accents
 * - Layout: Full-width image sections with text overlays
 * - Vibe: High-end editorial, cinematic, premium
 */

const translations = {
  en: {
    tagline: "Quiet Luxury Lifestyle Content Creator",
    exploreCollaboration: "Explore Collaboration",
    monthlyReach: "Monthly Reach",
    maleAudience: "Male Audience",
    primaryAgeGroup: "Primary Age Group",
    aboutBrand: "About the Brand",
    aboutText: "I create cinematic lifestyle content that celebrates the philosophy of Quiet Luxury—understated elegance, premium quality, and authentic storytelling. My audience consists of discerning men aged 25-34 who value craftsmanship, personal development, and refined aesthetics. Every frame is intentional, every collaboration is strategic.",
    recentCollaborations: "Recent Collaborations",
    collaborationPackages: "Collaboration Packages",
    getInTouch: "Get in Touch",
    linkInBio: "Link in Bio",
    singleReel: "Single Reel",
    ambassador: "Ambassador",
    inquire: "Inquire",
    letsTalk: "Let's Talk",
    name: "Name",
    email: "Email",
    message: "Message",
    sendMessage: "Send Message",
    thankYou: "Thank you! I'll be in touch soon.",
    contact: "Contact",
    collaboration: "Collaboration",
    month: "/month",
    reel: "/reel",
    brandLinkInProfile: "Brand link in profile bio",
    monthlyReachValue: "3.5M+ monthly reach",
    passiveTrafficGeneration: "Passive traffic generation",
    professionalProduction: "Professional production",
    authenticIntegration: "Authentic integration",
    fullUsageRights: "Full usage rights",
    linkInBioContent: "Link in bio + content",
    reelsPerMonth: "4+ reels/month",
    exclusivePartnership: "Exclusive partnership",
    engagementRate: "Engagement Rate",
    directInquiries: "Direct Inquiries",
    linkCTR: "Bio Link CTR",
    saves: "Saves",
    onHillSport: "On Hill Sport",
    keybell: "Keybell",
    reboot: "Reboot",
    onHillSportDesc: "Premium running apparel and weighted accessories. Created engaging content showcasing the brand's products in authentic lifestyle scenarios. Achieved high engagement with direct product inquiries in comments.",
    keybellDesc: "Russian luxury accessories brand. Test collaboration with custom-engraved keychain.",
    rebootDesc: "Lifestyle brand collaboration with Reboot sport club as premium ambassador featuring premium products and aesthetic lifestyle content. Strong audience resonance with high engagement rates and quality audience demographics.",
  },
  ru: {
    tagline: "Создатель контента Quiet Luxury",
    exploreCollaboration: "Изучить сотрудничество",
    monthlyReach: "Месячный охват",
    maleAudience: "Мужская аудитория",
    primaryAgeGroup: "Основная возрастная группа",
    aboutBrand: "О бренде",
    aboutText: "Я создаю кинематографический контент о стиле жизни, который отражает философию Quiet Luxury — сдержанную элегантность, премиальное качество и аутентичное повествование. Моя аудитория — требовательные мужчины в возрасте 25-34 лет, которые ценят мастерство, личное развитие и утонченную эстетику.",
    recentCollaborations: "Недавние сотрудничества",
    collaborationPackages: "Пакеты сотрудничества",
    getInTouch: "Свяжитесь со мной",
    linkInBio: "Ссылка в профиле",
    singleReel: "Один Reel",
    ambassador: "Амбассадор",
    inquire: "Узнать",
    letsTalk: "Давайте обсудим",
    name: "Имя",
    email: "Email",
    message: "Сообщение",
    sendMessage: "Отправить",
    thankYou: "Спасибо! Я свяжусь с вами в ближайшее время.",
    contact: "Контакт",
    collaboration: "Сотрудничество",
    month: "/месяц",
    reel: "/рил",
    brandLinkInProfile: "Ссылка на бренд в профиле",
    monthlyReachValue: "3.5M+ месячный охват",
    passiveTrafficGeneration: "Пассивная генерация трафика",
    professionalProduction: "Профессиональное производство",
    authenticIntegration: "Аутентичная интеграция",
    fullUsageRights: "Полные права использования",
    linkInBioContent: "Ссылка в профиле + контент",
    reelsPerMonth: "4+ рилса/месяц",
    exclusivePartnership: "Эксклюзивное партнерство",
    engagementRate: "Engagement Rate",
    directInquiries: "Прямые запросы",
    linkCTR: "CTR ссылки в профиле",
    saves: "Сохранения",
    onHillSport: "On Hill Sport",
    keybell: "Keybell",
    reboot: "Reboot",
    onHillSportDesc: "Спортивная одежда премиум-класса и утяжелённые аксессуары. Создал привлекательный контент, демонстрирующий продукты бренда в аутентичных сценариях образа жизни. Достиг высокого уровня вовлечённости с прямыми запросами о продуктах в комментариях.",
    keybellDesc: "Российский бренд люксовых аксессуаров. Тестовое сотрудничество с персонализированным брелоком.",
    rebootDesc: "Сотрудничество с брендом Reboot sport club в качестве премиум-амбассадора с премиальными продуктами и эстетичным контентом образа жизни. Сильный отклик аудитории с высокими показателями вовлечённости и качественной демографией.",
  },
  fr: {
    tagline: "Créateur de contenu Quiet Luxury",
    exploreCollaboration: "Explorer la collaboration",
    monthlyReach: "Portée mensuelle",
    maleAudience: "Audience masculine",
    primaryAgeGroup: "Groupe d'âge principal",
    aboutBrand: "À propos de la marque",
    aboutText: "Je crée du contenu de style de vie cinématographique qui célèbre la philosophie du Quiet Luxury - l'élégance discrète, la qualité premium et la narration authentique. Mon audience est composée d'hommes exigeants âgés de 25-34 ans qui valorisent l'artisanat, le développement personnel et l'esthétique raffinée.",
    recentCollaborations: "Collaborations récentes",
    collaborationPackages: "Forfaits de collaboration",
    getInTouch: "Me contacter",
    linkInBio: "Lien en bio",
    singleReel: "Un Reel",
    ambassador: "Ambassadeur",
    inquire: "S'informer",
    letsTalk: "Parlons",
    name: "Nom",
    email: "E-mail",
    message: "Message",
    sendMessage: "Envoyer",
    thankYou: "Merci! Je vous recontacterai bientôt.",
    contact: "Contact",
    collaboration: "Collaboration",
    month: "/mois",
    reel: "/reel",
    brandLinkInProfile: "Lien de la marque en bio",
    monthlyReachValue: "3.5M+ portée mensuelle",
    passiveTrafficGeneration: "Génération passive de trafic",
    professionalProduction: "Production professionnelle",
    authenticIntegration: "Intégration authentique",
    fullUsageRights: "Droits d'utilisation complets",
    linkInBioContent: "Lien en bio + contenu",
    reelsPerMonth: "4+ reels/mois",
    exclusivePartnership: "Partenariat exclusif",
    engagementRate: "Taux d'engagement",
    directInquiries: "Demandes directes",
    linkCTR: "CTR du lien en bio",
    saves: "Enregistrements",
    onHillSport: "On Hill Sport",
    keybell: "Keybell",
    reboot: "Reboot",
    onHillSportDesc: "Vêtements de sport premium et accessoires lestés. J'ai créé du contenu attrayant mettant en avant les produits de la marque dans des scénarios de style de vie authentiques. J'ai obtenu un engagement élevé avec des demandes directes de produits dans les commentaires.",
    keybellDesc: "Marque russe d'accessoires de luxe. Collaboration test avec porte-clés personnalisé.",
    rebootDesc: "Collaboration avec la marque Reboot sport club en tant qu'ambassadeur premium avec des produits premium et du contenu de style de vie esthétique. Forte résonance du public avec des taux d'engagement élevés et une démographie d'audience de qualité.",
  },
  es: {
    tagline: "Creador de contenido Quiet Luxury",
    exploreCollaboration: "Explorar colaboración",
    monthlyReach: "Alcance mensual",
    maleAudience: "Audiencia masculina",
    primaryAgeGroup: "Grupo de edad principal",
    aboutBrand: "Sobre la marca",
    aboutText: "Creo contenido de estilo de vida cinematográfico que celebra la filosofía de Quiet Luxury: elegancia discreta, calidad premium e historias auténticas. Mi audiencia son hombres exigentes de 25-34 años que valoran la artesanía, el desarrollo personal y la estética refinada.",
    recentCollaborations: "Colaboraciones recientes",
    collaborationPackages: "Paquetes de colaboración",
    getInTouch: "Ponte en contacto",
    linkInBio: "Enlace en bio",
    singleReel: "Un Reel",
    ambassador: "Embajador",
    inquire: "Consultar",
    letsTalk: "Hablemos",
    name: "Nombre",
    email: "Correo",
    message: "Mensaje",
    sendMessage: "Enviar",
    thankYou: "¡Gracias! Me pondré en contacto pronto.",
    contact: "Contacto",
    collaboration: "Colaboración",
    month: "/mes",
    reel: "/reel",
    brandLinkInProfile: "Enlace de marca en bio",
    monthlyReachValue: "3.5M+ alcance mensual",
    passiveTrafficGeneration: "Generación pasiva de tráfico",
    professionalProduction: "Producción profesional",
    authenticIntegration: "Integración auténtica",
    fullUsageRights: "Derechos de uso completos",
    linkInBioContent: "Enlace en bio + contenido",
    reelsPerMonth: "4+ reels/mes",
    exclusivePartnership: "Asociación exclusiva",
    engagementRate: "Engagement Rate",
    directInquiries: "Consultas directas",
    linkCTR: "CTR del enlace en bio",
    saves: "Guardados",
    onHillSport: "On Hill Sport",
    keybell: "Keybell",
    reboot: "Reboot",
    onHillSportDesc: "Ropa deportiva premium y accesorios ponderados. Creé contenido atractivo que muestra los productos de la marca en escenarios de estilo de vida auténticos. Logré un alto nivel de participación con consultas directas de productos en los comentarios.",
    keybellDesc: "Marca rusa de accesorios de lujo. Colaboración de prueba con llavero personalizado.",
    rebootDesc: "Colaboración con la marca Reboot sport club como embajador premium con productos premium y contenido de estilo de vida estético. Fuerte resonancia de la audiencia con altas tasas de participación y demografía de audiencia de calidad.",
  },
  ar: {
    tagline: "منشئ محتوى Quiet Luxury",
    exploreCollaboration: "استكشف التعاون",
    monthlyReach: "الوصول الشهري",
    maleAudience: "الجمهور الذكوري",
    primaryAgeGroup: "المجموعة العمرية الأساسية",
    aboutBrand: "عن العلامة التجارية",
    aboutText: "أنا أنشئ محتوى نمط حياة سينمائي يحتفل بفلسفة Quiet Luxury - الأناقة المتحفظة والجودة المتميزة والسرد الحقيقي. جمهوري يتكون من رجال متطلبين تتراوح أعمارهم بين 25-34 سنة يقدرون الحرفية والتطور الشخصي والجمالية المكررة.",
    recentCollaborations: "التعاونات الأخيرة",
    collaborationPackages: "حزم التعاون",
    getInTouch: "تواصل معي",
    linkInBio: "رابط في السيرة",
    singleReel: "ريل واحد",
    ambassador: "سفير",
    inquire: "استفسر",
    letsTalk: "لنتحدث",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    sendMessage: "إرسال",
    thankYou: "شكراً! سأتواصل معك قريباً.",
    contact: "الاتصال",
    collaboration: "التعاون",
    month: "/شهر",
    reel: "/ريل",
    brandLinkInProfile: "رابط العلامة التجارية في السيرة",
    monthlyReachValue: "3.5M+ وصول شهري",
    passiveTrafficGeneration: "توليد حركة مرور سلبية",
    professionalProduction: "إنتاج احترافي",
    authenticIntegration: "تكامل أصلي",
    fullUsageRights: "حقوق الاستخدام الكاملة",
    linkInBioContent: "رابط في السيرة + محتوى",
    reelsPerMonth: "4+ ريلات/شهر",
    exclusivePartnership: "شراكة حصرية",
    engagementRate: "معدل الانخراط",
    directInquiries: "استفسارات مباشرة",
    linkCTR: "معدل النقر على الرابط",
    saves: "الحفظ",
    onHillSport: "On Hill Sport",
    keybell: "Keybell",
    reboot: "Reboot",
    onHillSportDesc: "ملابس رياضية فاخرة والإكسسوارات الثقيلة. أنشأت محتوى جذاب يعرض منتجات العلامة التجارية في سيناريوهات نمط حياة أصلية. حققت مستويات عالية من المشاركة مع استفسارات مباشرة عن المنتجات في التعليقات.",
    keybellDesc: "علامة تجارية روسية للإكسسوارات الفاخرة. تعاون تجريبي مع مفتاح مخصص.",
    rebootDesc: "التعاون مع علامة Reboot sport club كسفير فاخر مع منتجات فاخرة ومحتوى نمط حياة جمالي. استجابة قوية للجمهور مع معدلات مشاركة عالية وديموغرافيا جمهور عالية الجودة.",
  },
};

const InstagramReel = ({ url, title }: { url: string; title: string }) => {
  const getReelId = (instagramUrl: string) => {
    const match = instagramUrl.match(/\/reel\/([^/?]+)/);
    return match ? match[1] : null;
  };

  const reelId = getReelId(url);
  if (!reelId) return null;

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        src={`https://www.instagram.com/reel/${reelId}/embed`}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        title={title}
        className="w-full h-full"
      />
    </div>
  );
};

export default function Home() {
  const { user } = useAuth();
  const { trackClick, trackFormSubmit, language, setLanguage } = useAnalytics();
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const t = translations[language as keyof typeof translations] || translations.en;



  const handleCollaborationClick = () => {
    trackClick("explore-collaboration-btn", "Explore Collaboration");
  };

  const handleInstagramDM = () => {
    const message = encodeURIComponent("Здравствуйте! Я заинтересован(а) в сотрудничестве и хотел(а) бы обсудить детали.");
    window.open(`https://instagram.com/isaac_hakobian`, "_blank");
    trackClick("instagram-dm-inquiry");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send email via tRPC
      const response = await fetch("/api/trpc/system.sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "isaac@example.com",
          subject: `Collaboration Inquiry from ${formState.name}`,
          message: formState.message,
          senderEmail: formState.email,
        }),
      });
      
      if (response.ok) {
        trackFormSubmit("contact_form", {
          name: formState.name,
          email: formState.email,
        });
        setSubmitted(true);
        toast.success(t.thankYou);
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-6 flex gap-4 items-center">
        <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
        <a
          href="#collaboration"
          onClick={() => trackClick("nav-collaboration")}
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          {t.collaboration}
        </a>
        <a
          href="#contact"
          onClick={() => trackClick("nav-contact")}
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          {t.contact}
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(/manus-storage/80DC245D-61F0-4786-B87F-DC079CB4BB2C_f4659d04.JPEG)',
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl px-6">
          <h1
            className="text-7xl md:text-8xl font-bold mb-6"
            style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}
          >
            ISAAC HAKOBIAN
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">{t.tagline}</p>
          <div className="flex gap-4 justify-center">
            <a
              href="#collaboration"
              onClick={handleCollaborationClick}
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 hover:opacity-90 transition-opacity"
            >
              {t.exploreCollaboration} <ArrowRight size={16} />
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
                2.0M+
              </div>
              <p className="text-lg text-gray-600">{t.monthlyReach}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif", color: "#8B4513" }}>
                79%
              </div>
              <p className="text-lg text-gray-600">{t.maleAudience}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif", color: "#8B4513" }}>
                25-34
              </div>
              <p className="text-lg text-gray-600">{t.primaryAgeGroup}</p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-12">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              {t.aboutBrand}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">{t.aboutText}</p>
          </div>
        </div>
      </section>

      {/* Case Studies Section with Reels */}
      <section id="collaboration" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-16" style={{ fontFamily: "Playfair Display, serif" }}>
            {t.recentCollaborations}
          </h2>

          <div className="space-y-20">
            {/* On Hill Sport */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                  {t.onHillSport}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {t.onHillSportDesc}
                </p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.engagementRate}</p>
                    <p className="text-2xl font-bold">8.2%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.directInquiries}</p>
                    <p className="text-2xl font-bold">15+</p>
                  </div>
                </div>
              </div>
              <InstagramReel
                url="https://www.instagram.com/reel/DXTejdvCHq1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                title="On Hill Sport Reel"
              />
            </div>

            {/* Keybell */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:grid-flow-dense">
              <InstagramReel
                url="https://www.instagram.com/reel/DX-KPOfo2YV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                title="Keybell Reel"
              />
              <div className="md:order-first">
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                  {t.keybell}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {t.keybellDesc}
                </p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.linkCTR}</p>
                    <p className="text-2xl font-bold">12%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.saves}</p>
                    <p className="text-2xl font-bold">340</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reboot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                  {t.reboot}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {t.rebootDesc}
                </p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t.engagementRate}</p>
                    <p className="text-2xl font-bold">9.5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.saves}</p>
                    <p className="text-2xl font-bold">420</p>
                  </div>
                </div>
              </div>
              <InstagramReel
                url="https://www.instagram.com/reel/DTsCmsLiIOB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                title="Reboot Reel"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials language={language} />

      {/* Collaboration Packages */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-16" style={{ fontFamily: "Playfair Display, serif" }}>
            {t.collaborationPackages}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Link in Bio */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                {t.linkInBio}
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: "#8B4513" }}>
                ₽10,000
              </p>
              <p className="text-gray-600 mb-6">{t.month}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>{t.brandLinkInProfile}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>{t.monthlyReachValue}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>{t.passiveTrafficGeneration}</span>
                </li>
              </ul>
              <Button
                onClick={handleInstagramDM}
                className="w-full"
                variant="outline"
              >
                {t.inquire}
              </Button>
            </div>

            {/* Single Reel */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                {t.singleReel}
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: "#8B4513" }}>
                ₽7,000
              </p>
              <p className="text-gray-600 mb-6">{t.reel}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>{t.professionalProduction}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>{t.authenticIntegration}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>{t.fullUsageRights}</span>
                </li>
              </ul>
              <Button
                onClick={handleInstagramDM}
                className="w-full"
                variant="outline"
              >
                {t.inquire}
              </Button>
            </div>

            {/* Ambassador */}
            <div className="border-2 border-accent p-8 hover:shadow-lg transition-shadow bg-gray-50 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                {t.ambassador}
              </h3>
              <p className="text-4xl font-bold mb-4" style={{ color: "#8B4513" }}>
                Custom
              </p>
              <p className="text-gray-600 mb-6">Long-term partnership</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>{t.linkInBioContent}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>{t.reelsPerMonth}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>{t.exclusivePartnership}</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={handleInstagramDM}
                className="w-full"
              >
                {t.letsTalk}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Playfair Display, serif" }}>
            {t.getInTouch}
          </h2>

          <div className="bg-white p-8 rounded-lg border border-gray-300">
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-lg text-accent font-semibold">{t.thankYou}</p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.name}</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.email}</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.message}</label>
                  <textarea
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t.sendMessage}
                </Button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-gray-300 flex gap-6 justify-center flex-wrap">
              <a
                href="https://instagram.com/isaac_hakobian"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("social-instagram")}
                className="text-gray-600 hover:text-accent transition-colors"
                title="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="mailto:isohakobian@gmail.com"
                onClick={() => trackClick("social-email")}
                className="text-gray-600 hover:text-accent transition-colors"
                title="Email"
              >
                <Mail size={24} />
              </a>
              <a
                href="https://www.tiktok.com/@isaachakobian?_r=1&_t=ZS-96qDdTjTH1B"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("social-tiktok")}
                className="text-gray-600 hover:text-accent transition-colors"
                title="TikTok"
              >
                <Music size={24} />
              </a>
              <a
                href="https://ru.pinterest.com/isohakobian/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("social-pinterest")}
                className="text-gray-600 hover:text-accent transition-colors"
                title="Pinterest"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://t.me/+A7IKAwimpLEyNTJi"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("social-telegram")}
                className="text-gray-600 hover:text-accent transition-colors"
                title="Telegram"
              >
                <MessageCircle size={24} />
              </a>
              <a
                href="https://www.youtube.com/@isaachakobian/featured"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("social-youtube")}
                className="text-gray-600 hover:text-accent transition-colors"
                title="YouTube"
              >
                <Youtube size={24} />
              </a>
              <a
                href="https://www.threads.com/@isaac_hakobian"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("social-threads")}
                className="text-gray-600 hover:text-accent transition-colors"
                title="Threads"
              >
                <Tv size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Footer */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: "Playfair Display, serif" }}>
            {language === "en" && "Follow My Journey"}
            {language === "ru" && "Следите за мной"}
            {language === "es" && "Sígueme"}
            {language === "ar" && "تابعني"}
            {language === "fr" && "Suivez mon parcours"}
          </h2>
          <div className="flex gap-8 justify-center flex-wrap">
            <a
              href="https://instagram.com/isaac_hakobian"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("footer-instagram")}
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-accent transition-colors"
            >
              <Instagram size={32} />
              <span className="text-sm">Instagram</span>
            </a>
            <a
              href="https://ru.pinterest.com/isohakobian/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("footer-pinterest")}
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-accent transition-colors"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="currentColor"/>
              </svg>
              <span className="text-sm">Pinterest</span>
            </a>
            <a
              href="https://t.me/+A7IKAwimpLEyNTJi"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("footer-telegram")}
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-accent transition-colors"
            >
              <MessageCircle size={32} />
              <span className="text-sm">Telegram</span>
            </a>
            <a
              href="https://www.youtube.com/@isaachakobian/featured"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("footer-youtube")}
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-accent transition-colors"
            >
              <Youtube size={32} />
              <span className="text-sm">YouTube</span>
            </a>
            <a
              href="https://www.threads.com/@isaac_hakobian"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("footer-threads")}
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-accent transition-colors"
            >
              <Tv size={32} />
              <span className="text-sm">Threads</span>
            </a>
            <a
              href="https://www.tiktok.com/@isaachakobian?_r=1&_t=ZS-96qDdTjTH1B"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("footer-tiktok")}
              className="flex flex-col items-center gap-2 text-gray-600 hover:text-accent transition-colors"
            >
              <Music size={32} />
              <span className="text-sm">TikTok</span>
            </a>
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
