import { Button } from "@/components/ui/button";
import { Mail, Instagram, ArrowRight, Linkedin, MessageCircle, Youtube, Tv, Music } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Testimonials from "@/components/Testimonials";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/_core/hooks/useAuth";

/**
 * Editorial Minimalism Design System
 * - Typography: Playfair Display (headings) + Inter (body)
 * - Color: White background, deep charcoal text, warm gold accents
 * - Layout: Full-width image sections with text overlays
 * - Vibe: High-end editorial, cinematic, premium
 */

const translations = {
  en: {
    tagline: "Premium Men's Lifestyle Creator for Quality-Focused Brands",
    taglineSupport: "Cinematic short-form content that helps premium fitness, lifestyle, accessories, grooming, and wellness brands reach a discerning male audience through authentic product integration and measurable engagement.",
    exploreCollaboration: "Explore Collaboration",
    monthlyReach: "Monthly Reach",
    maleAudience: "Male Audience",
    primaryAgeGroup: "Primary Age Group",
    aboutBrand: "About the Brand",
    aboutText: "I create cinematic lifestyle content for brands that value quality, craft, and trust. My audience is primarily men aged 25-34 who respond to refined aesthetics, personal development, performance, and premium products. Each collaboration is built to feel native to my content while giving brands clear creative assets, audience fit, and campaign proof.",
    bestFitFor: "Best Fit For",
    premiumFitness: "Premium fitness and sport clubs",
    mensAccessories: "Men's accessories",
    groomingWellness: "Grooming and wellness",
    menswearLifestyle: "Menswear and lifestyle products",
    everydayCarry: "High-quality everyday carry",
    performanceBrands: "Performance and personal development brands",
    recentCollaborations: "Recent Collaborations",
    collaborationPackages: "Collaboration Packages",
    getInTouch: "Get in Touch",
    linkInBio: "Traffic Push",
    singleReel: "Awareness Reel",
    ambassador: "Ambassador Partnership",
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
    collaborationProof: "Campaign Results",
    campaignType: "Campaign Type",
    results: "Results",
    onHillSportCategory: "Premium running apparel and weighted accessories",
    onHillSportCampaign: "Lifestyle reel / product integration",
    onHillSportResults: "8.2% engagement rate • 15+ direct product inquiries",
    onHillSportQuote: "Isaac brought authentic energy to our brand. His audience engagement was exceptional and the content quality exceeded expectations.",
    keybellCategory: "Luxury accessories",
    keybellCampaign: "Custom product feature / bio traffic",
    keybellResults: "12% bio link CTR • 340 saves",
    keybellQuote: "His followers are exactly our target demographic - discerning, quality-focused men.",
    rebootCategory: "Premium sport club / lifestyle",
    rebootCampaign: "Ambassador-style lifestyle content",
    rebootResults: "9.5% engagement rate • 420 saves",
    rebootQuote: "The production quality and authenticity of Isaac's content is unmatched. Highly recommended for premium brands.",
  },
  ru: {
    tagline: "Премиальный креатор контента для брендов высокого качества",
    taglineSupport: "Кинематографический контент для премиальных брендов в спорте, аксессуарах, груминге и велнессе. Отображаю требовательную мужскую аудиторию через аутентичные интеграции и измеримые результаты.",
    exploreCollaboration: "Обсудить сотрудничество",
    monthlyReach: "Месячный охват",
    maleAudience: "Мужская аудитория",
    primaryAgeGroup: "Основная возрастная группа",
    aboutBrand: "О бренде",
    aboutText: "Креатор кинематографического контента для брендов, которые ценят качество, мастерство и доверие. Моя аудитория — мужчины 25-34 лет, которые оценивают рафинированную эстетику, личное развитие и премиальные продукты. Каждое сотрудничество — это аутентичные ассеты, таргетированная аудитория и измеримые результаты.",
    bestFitFor: "Лучше всего подходит для",
    premiumFitness: "Премиальные спортивные клубы",
    mensAccessories: "Мужские аксессуары",
    groomingWellness: "Груминг и велнесс",
    menswearLifestyle: "Мужская мода и лайфстайл",
    everydayCarry: "Премиум эверидей",
    performanceBrands: "Бренды развития и производительности",
    recentCollaborations: "Недавние сотрудничества",
    collaborationPackages: "Пакеты сотрудничества",
    collaborationProof: "Результаты кампании",
    campaignType: "Тип кампании",
    results: "Показатели",
    onHillSportCategory: "Премиальная спортивная одежда и утяжели",
    onHillSportCampaign: "Лайфстайл рил / интеграция продукта",
    onHillSportResults: "8.2% engagement rate • 15+ прямых запросов",
    onHillSportQuote: "Исаак принес аутентичную энергию нашему бренду. Его аудитория показала исключительные результаты.",
    keybellCategory: "Люксовые аксессуары",
    keybellCampaign: "Показ продукта / трафик в профил",
    keybellResults: "12% CTR ссылки • 340 сохранений",
    keybellQuote: "Его подписчики — это точно наша таргет аудитория.",
    rebootCategory: "Премиальный спорт клуб / лайфстайл",
    rebootCampaign: "Контент амбассадора",
    rebootResults: "9.5% engagement rate • 420 сохранений",
    rebootQuote: "Качество производства и аутентичность контента бесподобны.",
    getInTouch: "Свяжитесь со мной",
    linkInBio: "Трафик в профиль",
    singleReel: "Рил осведомленности",
    ambassador: "Партнерство амбассадора",
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
    tagline: "Créateur de contenu premium pour les marques de qualité",
    taglineSupport: "Contenu cinématographique pour les marques premium en fitness, accessoires, grooming et bien-être. J'atteins un public masculin exigeant par des intégrations authentiques et des résultats mesurables.",
    exploreCollaboration: "Explorer la collaboration",
    monthlyReach: "Portée mensuelle",
    maleAudience: "Public masculin",
    primaryAgeGroup: "Groupe d'âge principal",
    aboutBrand: "À propos de la marque",
    aboutText: "Je crée du contenu de style de vie cinématographique pour les marques qui valorisent la qualité, l'artisanat et la confiance. Mon audience est composée d'hommes âgés de 25-34 ans qui apprécient l'esthétique raffinée, le développement personnel et les produits premium. Chaque collaboration est conçue pour s'intégrer naturellement à mon contenu tout en offrant aux marques des actifs créatifs clairs, un ajustement d'audience et une preuve de campagne.",
    bestFitFor: "Meilleur pour",
    premiumFitness: "Clubs sportifs premium",
    mensAccessories: "Accessoires pour hommes",
    groomingWellness: "Grooming et bien-être",
    menswearLifestyle: "Mode masculine et style de vie",
    everydayCarry: "Accessoires premium au quotidien",
    performanceBrands: "Marques de développement et performance",
    recentCollaborations: "Collaborations récentes",
    collaborationPackages: "Forfaits de collaboration",
    collaborationProof: "Résultats de campagne",
    campaignType: "Type de campagne",
    results: "Résultats",
    onHillSportCategory: "Vêtements de sport premium et accessoires lestés",
    onHillSportCampaign: "Reel de style de vie / intégration de produit",
    onHillSportResults: "8.2% engagement rate • 15+ demandes directes",
    onHillSportQuote: "Isaac a apporté une énergie authentique à notre marque. L'engagement de son audience a été exceptionnel.",
    keybellCategory: "Accessoires de luxe",
    keybellCampaign: "Présentation de produit / trafic en bio",
    keybellResults: "12% CTR du lien • 340 enregistrements",
    keybellQuote: "Ses followers sont exactement notre audience cible.",
    rebootCategory: "Club sportif premium / style de vie",
    rebootCampaign: "Contenu d'ambassadeur",
    rebootResults: "9.5% engagement rate • 420 enregistrements",
    rebootQuote: "La qualité de production et l'authenticité du contenu d'Isaac sont incomparables.",
    getInTouch: "Me contacter",
    linkInBio: "Impulsion de trafic",
    singleReel: "Reel de sensibilisation",
    ambassador: "Partenariat d'ambassadeur",
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
    tagline: "Creador de contenido premium para marcas de calidad",
    taglineSupport: "Contenido cinematográfico para marcas premium en fitness, accesorios, grooming y bienestar. Llego a una audiencia masculina exigente a través de integraciones auténticas y resultados medibles.",
    exploreCollaboration: "Explorar colaboración",
    monthlyReach: "Alcance mensual",
    maleAudience: "Audiencia masculina",
    primaryAgeGroup: "Grupo de edad principal",
    aboutBrand: "Sobre la marca",
    aboutText: "Creo contenido de estilo de vida cinematográfico para marcas que valoran la calidad, la artesanía y la confianza. Mi audiencia son principalmente hombres de 25-34 años que aprecian la estética refinada, el desarrollo personal y los productos premium. Cada colaboración está diseñada para sentirse nativa a mi contenido mientras proporciono a las marcas activos creativos claros, ajuste de audiencia y prueba de campaña.",
    bestFitFor: "Mejor para",
    premiumFitness: "Clubes deportivos premium",
    mensAccessories: "Accesorios para hombres",
    groomingWellness: "Grooming y bienestar",
    menswearLifestyle: "Moda masculina y estilo de vida",
    everydayCarry: "Accesorios premium de uso diario",
    performanceBrands: "Marcas de desarrollo y rendimiento",
    recentCollaborations: "Colaboraciones recientes",
    collaborationPackages: "Paquetes de colaboración",
    collaborationProof: "Resultados de campaña",
    campaignType: "Tipo de campaña",
    results: "Resultados",
    onHillSportCategory: "Ropa deportiva premium y accesorios ponderados",
    onHillSportCampaign: "Reel de estilo de vida / integración de producto",
    onHillSportResults: "8.2% engagement rate • 15+ consultas directas",
    onHillSportQuote: "Isaac trajo energía auténtica a nuestra marca. El engagement de su audiencia fue excepcional.",
    keybellCategory: "Accesorios de lujo",
    keybellCampaign: "Presentación de producto / tráfico en bio",
    keybellResults: "12% CTR del enlace • 340 guardados",
    keybellQuote: "Sus seguidores son exactamente nuestra audiencia objetivo.",
    rebootCategory: "Club deportivo premium / estilo de vida",
    rebootCampaign: "Contenido de embajador",
    rebootResults: "9.5% engagement rate • 420 guardados",
    rebootQuote: "La calidad de producción y autenticidad del contenido de Isaac es incomparable.",
    getInTouch: "Ponte en contacto",
    linkInBio: "Impulso de tráfico",
    singleReel: "Reel de conciencia",
    ambassador: "Asociación de embajador",
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
    tagline: "منشئ محتوى بريميوم للعلامات التجارية عالية الجودة",
    taglineSupport: "محتوى سينمائي للعلامات البريميوم في اللياقة والاكسسوارات والعناية بالبشرة. أصل لجمهور ذكوري متطلب من خلال التكامل الأصلي والنتائج المقاسة.",
    exploreCollaboration: "استكشف التعاون",
    monthlyReach: "الوصول الشهري",
    maleAudience: "الجمهور الذكوري",
    primaryAgeGroup: "المجموعة العمرية الأساسية",
    aboutBrand: "حول العلامة التجارية",
    aboutText: "أنشئ محتوى نمط حياة سينمائي للعلامات التجارية التي تقدر الجودة والحرفية والثقة. جمهوري يتكون في المقام الأول من رجال تتراوح أعمارهم بين 25-34 سنة يقدرون الجماليات المكررة والتطور الشخصي والمنتجات المتميزة. تم تصميم كل تعاون ليشعر بأنه أصلي لمحتوى الخاص بي مع توفير الأصول الإبداعية الواضحة وملاءمة الجمهور وإثبات الحملة.",
    bestFitFor: "الأفضل ل",
    premiumFitness: "نوادي رياضية بريميوم",
    mensAccessories: "اكسسوارات رجالية",
    groomingWellness: "العناية بالبشرة والعافية",
    menswearLifestyle: "الملابس الرجالية ونمط الحياة",
    everydayCarry: "اكسسوارات بريميوم يومية",
    performanceBrands: "علامات التطور والأداء",
    recentCollaborations: "التعاونات الأخيرة",
    collaborationPackages: "حزم التعاون",
    collaborationProof: "نتائج الحملة",
    campaignType: "نوع الحملة",
    results: "النتائج",
    onHillSportCategory: "ملابس رياضية فاخرة والإكسسوارات الثقيلة",
    onHillSportCampaign: "ريل نمط حياة / تكامل منتج",
    onHillSportResults: "8.2% engagement rate • 15+ استفسارات مباشرة",
    onHillSportQuote: "أحضر إسحاق طاقة أصلية لعلامتنا التجارية. كان الانخراط استثنائياً.",
    keybellCategory: "اكسسوارات فاخرة",
    keybellCampaign: "عرض منتج / حركة بيو",
    keybellResults: "12% CTR رابط • 340 حفظ",
    keybellQuote: "متابعوه هم بالضبط جمهورنا المستهدف.",
    rebootCategory: "نادي رياضي بريميوم / نمط حياة",
    rebootCampaign: "محتوى سفير",
    rebootResults: "9.5% engagement rate • 420 حفظ",
    rebootQuote: "جودة الإنتاج وأصالة محتوى إسحاق لا مثيل لها.",
    getInTouch: "تواصل معي",
    linkInBio: "دفع الحركة",
    singleReel: "ريل الوعي",
    ambassador: "شراكة السفير",
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
      const response = await fetch("/api/trpc/system.sendEmail?input=" + encodeURIComponent(JSON.stringify({
        to: "isohakobian@gmail.com",
        subject: `Collaboration Inquiry from ${formState.name}`,
        message: formState.message,
        senderEmail: formState.email,
      })), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        trackFormSubmit("contact-form", { email: formState.email, name: formState.name });
        setSubmitted(true);
        setFormState({ name: "", email: "", message: "" });
        toast.success(t.thankYou);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        toast.error("Error sending message");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Error sending message");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}>
            Isaac
          </a>
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-20">
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

        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1
            className="text-7xl md:text-8xl font-bold mb-4"
            style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}
          >
            ISAAC HAKOBIAN
          </h1>
          <p className="text-2xl md:text-3xl text-white/95 mb-6 font-light" style={{ fontFamily: "Playfair Display, serif" }}>{t.tagline}</p>
          {t.taglineSupport && <p className="text-lg text-white/80 mb-8 font-light leading-relaxed max-w-2xl mx-auto">{t.taglineSupport}</p>}
          <div className="flex gap-4 justify-center">
            <a
              href="#collaboration"
              onClick={handleCollaborationClick}
              className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 hover:opacity-90 transition-opacity font-medium"
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
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-8" style={{ fontFamily: "Playfair Display, serif" }}>
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
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  {t.onHillSport}
                </h3>
                <p className="text-sm text-accent font-medium mb-4">{t.onHillSportCategory}</p>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t.campaignType}</p>
                  <p className="text-gray-700 font-medium">{t.onHillSportCampaign}</p>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t.results}</p>
                  <p className="text-gray-700 font-medium">{t.onHillSportResults}</p>
                </div>
                <blockquote className="italic text-gray-700 border-l-4 border-accent pl-4">
                  "{t.onHillSportQuote}"
                </blockquote>
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
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  {t.keybell}
                </h3>
                <p className="text-sm text-accent font-medium mb-4">{t.keybellCategory}</p>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t.campaignType}</p>
                  <p className="text-gray-700 font-medium">{t.keybellCampaign}</p>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t.results}</p>
                  <p className="text-gray-700 font-medium">{t.keybellResults}</p>
                </div>
                <blockquote className="italic text-gray-700 border-l-4 border-accent pl-4">
                  "{t.keybellQuote}"
                </blockquote>
              </div>
            </div>

            {/* Reboot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  {t.reboot}
                </h3>
                <p className="text-sm text-accent font-medium mb-4">{t.rebootCategory}</p>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t.campaignType}</p>
                  <p className="text-gray-700 font-medium">{t.rebootCampaign}</p>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t.results}</p>
                  <p className="text-gray-700 font-medium">{t.rebootResults}</p>
                </div>
                <blockquote className="italic text-gray-700 border-l-4 border-accent pl-4">
                  "{t.rebootQuote}"
                </blockquote>
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
              <p className="text-gray-600 mb-6">{t.month}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.brandLinkInProfile}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.passiveTrafficGeneration}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.professionalProduction}</span>
                </li>
              </ul>
              <button onClick={handleInstagramDM} className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium">
                {t.inquire}
              </button>
            </div>

            {/* Single Reel */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                {t.singleReel}
              </h3>
              <p className="text-gray-600 mb-6">{t.reel}</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.authenticIntegration}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.fullUsageRights}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.professionalProduction}</span>
                </li>
              </ul>
              <button onClick={handleInstagramDM} className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium">
                {t.inquire}
              </button>
            </div>

            {/* Ambassador */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow md:col-span-2 md:w-1/2 md:mx-auto">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                {t.ambassador}
              </h3>
              <p className="text-gray-600 mb-6">Custom</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.linkInBioContent}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.reelsPerMonth}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span className="text-gray-700">{t.exclusivePartnership}</span>
                </li>
              </ul>
              <button onClick={handleInstagramDM} className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium">
                {t.letsTalk}
              </button>
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
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.name}</label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.message}</label>
              <textarea
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-accent h-32"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium"
            >
              {t.sendMessage}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Isaac Hakobian
              </h3>
              <p className="text-gray-400">Premium lifestyle content creator</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">{t.contact}</h4>
              <div className="flex gap-4">
                <a href="https://instagram.com/isaac_hakobian" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="mailto:isohakobian@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
                <a href="https://www.tiktok.com/@isaachakobian?_r=1&_t=ZS-96qDdTjTH1B" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Music size={20} />
                </a>
                <a href="https://ru.pinterest.com/isohakobian/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Tv size={20} />
                </a>
                <a href="https://t.me/+A7IKAwimpLEyNTJi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle size={20} />
                </a>
                <a href="https://www.youtube.com/@isaachakobian/featured" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube size={20} />
                </a>
                <a href="https://www.threads.com/@isaac_hakobian" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            <div className="text-right text-gray-400 text-sm">
              <p>© 2026 Isaac Hakobian</p>
              <p>All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
