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
    month: "$250/month",
    reel: "$450/reel",
    reelStoriesLink: "from $800",
    custom: "Custom",
    brandLinkInProfile: "Brand link in profile bio",
    monthlyReachValue: "3.1+ monthly reach",
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
    DreamBeachClub: "Dream Beach Club",
    dreamBeachClubDescription: "The largest in Russia Dream Beach Club with a VIP swimming pool",
    dreamBeachClubCategory: "The largest in Russia swimming pool",
    dreamBeachClubCampaign: "Lifestyle reel / product integration",
    dreamBeachClubResults: "80.8% engagement rate non followers • 100+ saves",
    dreamBeachClubQuote: "We truly enjoyed collaborating with Isaac. Everything was smooth, professional, and beautifully executed. The photo publications and visual content fully reflected the atmosphere of Dream Beach Club. We would be happy to work together again.",
    Abib: "Abib",
    abibDescription: "Rooted in a strong commitment to clean, natural products, the brand has consistently focused on minimalist formulations inspired by nature. This approach reflects a growing need for sensitive skin solutions made with gentle, naturally inspired ingredients.",
    abibCategory: "Korean skincare brand",
    abibCampaign: "Lifestyle reel / product integration",
    abibResults: "69.9% engagement rate non followers • 100+ saves",
    abibQuote: "His followers are exactly our target demographic - discerning, quality-focused men.",
    Yakapitan: "Ya Kapitan",
    yakapitanDescription: "Private boat and yacht rentals in Moscow — available with or without a captain.",
    yakapitanCategory: "Private boat and yacht rentals in Moscow",
    yakapitanCampaign: "Lifestyle reel / product integration",
    yakapitanResults: "88.8% engagement rate non followers • 100+ saves",
    yakapitanQuote: "The production quality and authenticity of Isaac's content is unmatched. Highly recommended for premium brands.",
    Swdr: "Swdr.by",
    swdrDescription: "Swdr is a Russian clothing brand sold through leading online marketplaces in Russia.",
    swdrCategory: "Swdr is a Russian clothing brand",
    swdrCampaign: "Lifestyle reel / product integration",
    swdrResults: "91.9% engagement rate non followers • 100+ saves",
    swdrQuote: "Quality-focused men. Thank you for collaboration",
    Rooms: "Rooms Project",
    roomsDescription: "Rooms Project is a self-portrait studio with curated interior spaces in Moscow and Saint Petersburg, designed for private photoshoots, personal content, and creative projects.",
    roomsCategory: "The self-portrait studio in Moscow and Saint Petersburg",
    roomsCampaign: "Lifestyle reel / product integration",
    roomsResults: "80.1% engagement rate non followers • 100+ saves",
    roomsQuote: "We truly enjoyed collaborating with Isaac.",
    collaborationProof: "Campaign Results",
    campaignType: "Campaign Type",
    results: "Results",
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
    dreamBeachClubCategory: "Крупнейший бассейн России",
    dreamBeachClubDescription: "Крупнейший в России Dream Beach Club с VIP-бассейном",
    dreamBeachClubCampaign: "Lifestyle reel / product integration",
    dreamBeachClubResults: "80,8% вовлечённости среди неподписчиков • 100+ сохранений",
    dreamBeachClubQuote: "Нам было очень приятно сотрудничать с Исааком. Всё прошло гладко, профессионально и красиво. Фотопубликации и визуальный контент полностью передали атмосферу Dream Beach Club. Будем рады поработать вместе снова.",
    abibCategory: "Корейский бренд уходовой косметики",
    abibDescription: "Основан на сильной приверженности чистым и натуральным продуктам, бренд постоянно сосредоточен на минималистичных формулировках, вдохновленных природой. Этот подход отражает растущую потребность в решениях для чувствительной кожи, созданных из мягких, натурально вдохновленных ингредиентов.",
    abibCampaign: "Lifestyle reel / product integration",
    abibResults: "69,9% вовлечённости среди неподписчиков • 100+ сохранений",
    abibQuote: "Его аудитория точно совпадает с нашей целевой аудиторией — это мужчины, которые ценят качество и внимательно выбирают продукты.",
    yakapitanCategory: "Аренда частных катеров и яхт в Москве",
    yakapitanDescription: "Аренда частных катеров и яхт в Москве — с капитаном или без.",
    yakapitanCampaign: "Lifestyle reel / product integration",
    yakapitanResults: "88,8% вовлечённости среди неподписчиков • 100+ сохранений",
    yakapitanQuote: "Качество продакшена и естественность контента Исаака — на очень высоком уровне. Рекомендуем для премиальных брендов.",
    swdrCategory: "SWDR — российский бренд одежды",
    swdrDescription: "SWDR — российский бренд одежды, продаваемый через ведущие онлайн-маркетплейсы России.",
    swdrCampaign: "Lifestyle reel / product integration",
    swdrResults: "91,9% вовлечённости среди неподписчиков • 100+ сохранений",
    swdrQuote: "Аудитория, которая ценит качество. Спасибо за сотрудничество.",
    roomsCategory: "Студия автопортрета в Москве и Санкт-Петербурге",
    roomsDescription: "Rooms Project — студия автопортрета с тщательно подобранными интерьерами в Москве и Санкт-Петербурге, предназначенная для приватных фотосессий, личного контента и творческих проектов.",
    roomsCampaign: "Lifestyle reel / product integration",
    roomsResults: "80,1% вовлечённости среди неподписчиков • 100+ сохранений",
    roomsQuote: "Нам было очень приятно сотрудничать с Исааком.",
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
    month: "₽15.000/месяц",
    reel: "₽12.000/рил",
    reelStoriesLink: "от 25.000",
    custom: "Индивидуально",
    brandLinkInProfile: "Ссылка на бренд в профиле",
    monthlyReachValue: "3.1M+ месячный охват",
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
    DreamBeachClub: "Dream Beach Club",
    Abib: "Abib",
    Yakapitan: "Ya Kapitan",
    Swdr: "Swdr.by",
    Rooms: "Rooms Project",
  },
  fr: {
    tagline: "Créateur lifestyle masculin premium pour les marques axées sur la qualité",
    taglineSupport: "Du contenu short-form cinématographique qui aide les marques premium de fitness, lifestyle, accessoires, grooming et wellness à toucher une audience masculine exigeante grâce à une intégration produit authentique et des résultats d'engagement mesurables.",
    exploreCollaboration: "Explorer une collaboration",
    monthlyReach: "Portée mensuelle",
    maleAudience: "Audience masculine",
    primaryAgeGroup: "Tranche d'âge principale",
    aboutBrand: "À propos de la marque",
    aboutText: "Je crée du contenu lifestyle cinématographique pour les marques qui valorisent la qualité, le savoir-faire et la confiance. Mon audience est principalement composée d'hommes de 25 à 34 ans, sensibles à une esthétique raffinée, au développement personnel, à la performance et aux produits premium. Chaque collaboration est conçue pour s'intégrer naturellement à mon contenu tout en offrant aux marques des assets créatifs clairs, une audience pertinente et des preuves de performance de campagne.",
    bestFitFor: "Idéal pour",
    premiumFitness: "Clubs de fitness et de sport premium",
    mensAccessories: "Accessoires pour hommes",
    groomingWellness: "Grooming et wellness",
    menswearLifestyle: "Mode masculine et produits lifestyle",
    everydayCarry: "Produits everyday carry de haute qualité",
    performanceBrands: "Marques liées à la performance et au développement personnel",
    recentCollaborations: "Collaborations récentes",
    collaborationPackages: "Packages de collaboration",
    getInTouch: "Prendre contact",
    linkInBio: "Traffic Push",
    singleReel: "Awareness Reel",
    ambassador: "Ambassador Partnership",
    inquire: "Demander",
    letsTalk: "Discutons",
    name: "Nom",
    email: "Email",
    message: "Message",
    sendMessage: "Envoyer le message",
    thankYou: "Merci ! Je vous recontacterai bientôt.",
    contact: "Contact",
    collaboration: "Collaboration",
    month: "€200/mois",
    reel: "€350/reel",
    reelStoriesLink: "à partir de €650",
    custom: "Sur demande",
    brandLinkInProfile: "Lien de la marque dans la bio du profil",
    monthlyReachValue: "3.1+ de portée mensuelle",
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
    DreamBeachClub: "Dream Beach Club",
    dreamBeachClubDescription: "Dream Beach Club, le plus grand complexe de Russie avec une piscine VIP",
    dreamBeachClubCategory: "La plus grande piscine de Russie",
    dreamBeachClubCampaign: "Lifestyle Reel / intégration produit",
    dreamBeachClubResults: "80,8 % d'engagement auprès des non-abonnés • 100+ enregistrements",
    dreamBeachClubQuote: "Nous avons beaucoup apprécié notre collaboration avec Isaac. Tout s'est déroulé de manière fluide, professionnelle et élégante. Les publications photo et le contenu visuel ont pleinement retranscrit l'atmosphère de Dream Beach Club. Nous serions ravis de retravailler ensemble.",
    Abib: "Abib",
    abibDescription: "Fondée sur un fort engagement envers des produits propres et naturels, la marque s'est toujours concentrée sur des formules minimalistes inspirées par la nature. Cette approche répond à un besoin croissant de solutions pour peaux sensibles, formulées avec des ingrédients doux et naturellement inspirés.",
    abibCategory: "Marque coréenne de soins de la peau",
    abibCampaign: "Lifestyle Reel / intégration produit",
    abibResults: "69,9 % d'engagement auprès des non-abonnés • 100+ enregistrements",
    abibQuote: "Son audience correspond exactement à notre cible : des hommes exigeants, attentifs à la qualité et sélectifs dans le choix des produits.",
    Yakapitan: "Ya Kapitan",
    yakapitanDescription: "Location de bateaux privés et de yachts à Moscou — avec ou sans capitaine.",
    yakapitanCategory: "Location de bateaux privés et de yachts à Moscou",
    yakapitanCampaign: "Lifestyle Reel / intégration produit",
    yakapitanResults: "88,8 % d'engagement auprès des non-abonnés • 100+ enregistrements",
    yakapitanQuote: "La qualité de production et l'authenticité du contenu d'Isaac sont incomparables. Fortement recommandé pour les marques premium.",
    Swdr: "Swdr.by",
    swdrDescription: "SWDR est une marque russe de vêtements vendue sur les principales marketplaces en ligne de Russie.",
    swdrCategory: "SWDR est une marque russe de vêtements",
    swdrCampaign: "Lifestyle Reel / intégration produit",
    swdrResults: "91,9 % d'engagement auprès des non-abonnés • 100+ enregistrements",
    swdrQuote: "Une audience qui valorise la qualité. Merci pour cette collaboration.",
    Rooms: "Rooms Project",
    roomsDescription: "Rooms Project est un studio d'autoportrait avec des espaces intérieurs soigneusement conçus à Moscou et Saint-Pétersbourg, pensé pour les shootings privés, le contenu personnel et les projets créatifs.",
    roomsCategory: "Studio d'autoportrait à Moscou et Saint-Pétersbourg",
    roomsCampaign: "Lifestyle Reel / intégration produit",
    roomsResults: "80,1 % d'engagement auprès des non-abonnés • 100+ enregistrements",
    roomsQuote: "Nous avons beaucoup apprécié notre collaboration avec Isaac.",
    collaborationProof: "Résultats de campagne",
    campaignType: "Type de campagne",
    results: "Résultats",
  },
  es: {
    tagline: "Creador de contenido lifestyle premium para marcas enfocadas en calidad",
    taglineSupport: "Contenido cinematográfico de corta duración que ayuda a marcas premium de fitness, lifestyle, accesorios, grooming y bienestar a llegar a una audiencia masculina exigente a través de integraciones de productos auténticas y engagement medible.",
    exploreCollaboration: "Explorar colaboración",
    monthlyReach: "Alcance mensual",
    maleAudience: "Audiencia masculina",
    primaryAgeGroup: "Grupo de edad principal",
    aboutBrand: "Sobre la marca",
    aboutText: "Creo contenido lifestyle cinematográfico para marcas que valoran la calidad, la artesanía y la confianza. Mi audiencia son principalmente hombres de 25-34 años que aprecian la estética refinada, el desarrollo personal, el desempeño y los productos premium. Cada colaboración está diseñada para sentirse nativa a mi contenido mientras proporciono a las marcas activos creativos claros, ajuste de audiencia y prueba de campaña.",
    bestFitFor: "Ideal para",
    premiumFitness: "Clubes de fitness y deporte premium",
    mensAccessories: "Accesorios para hombres",
    groomingWellness: "Grooming y bienestar",
    menswearLifestyle: "Moda masculina y productos lifestyle",
    everydayCarry: "Productos everyday carry de alta calidad",
    performanceBrands: "Marcas de desempeño y desarrollo personal",
    recentCollaborations: "Colaboraciones recientes",
    collaborationPackages: "Paquetes de colaboración",
    getInTouch: "Ponte en contacto",
    linkInBio: "Traffic Push",
    singleReel: "Awareness Reel",
    ambassador: "Ambassador Partnership",
    inquire: "Consultar",
    letsTalk: "Hablemos",
    name: "Nombre",
    email: "Email",
    message: "Mensaje",
    sendMessage: "Enviar mensaje",
    thankYou: "¡Gracias! Me pondré en contacto pronto.",
    contact: "Contacto",
    collaboration: "Colaboración",
    month: "$200/mes",
    reel: "$350/reel",
    reelStoriesLink: "desde $650",
    custom: "Personalizado",
    brandLinkInProfile: "Enlace de marca en bio del perfil",
    monthlyReachValue: "3.1+ alcance mensual",
    passiveTrafficGeneration: "Generación pasiva de tráfico",
    professionalProduction: "Producción profesional",
    authenticIntegration: "Integración auténtica",
    fullUsageRights: "Derechos de uso completos",
    linkInBioContent: "Enlace en bio + contenido",
    reelsPerMonth: "4+ reels/mes",
    exclusivePartnership: "Asociación exclusiva",
    engagementRate: "Tasa de engagement",
    directInquiries: "Consultas directas",
    linkCTR: "CTR del enlace en bio",
    saves: "Guardados",
    DreamBeachClub: "Dream Beach Club",
    dreamBeachClubDescription: "Dream Beach Club, el complejo más grande de Rusia con piscina VIP",
    dreamBeachClubCategory: "La piscina más grande de Rusia",
    dreamBeachClubCampaign: "Lifestyle Reel / integración de producto",
    dreamBeachClubResults: "80,8% engagement de no seguidores • 100+ guardados",
    dreamBeachClubQuote: "Disfrutamos mucho colaborando con Isaac. Todo fue fluido, profesional y hermosamente ejecutado. Las publicaciones fotográficas y el contenido visual reflejaron completamente la atmósfera de Dream Beach Club. Estaríamos encantados de trabajar juntos nuevamente.",
    Abib: "Abib",
    abibDescription: "Fundada en un fuerte compromiso con productos limpios y naturales, la marca se ha enfocado consistentemente en formulaciones minimalistas inspiradas en la naturaleza. Este enfoque refleja una necesidad creciente de soluciones para piel sensible hechas con ingredientes suaves e inspirados naturalmente.",
    abibCategory: "Marca coreana de cuidado de la piel",
    abibCampaign: "Lifestyle Reel / integración de producto",
    abibResults: "69,9% engagement de no seguidores • 100+ guardados",
    abibQuote: "Su audiencia es exactamente nuestro grupo demográfico objetivo: hombres exigentes y enfocados en la calidad.",
    Yakapitan: "Ya Kapitan",
    yakapitanDescription: "Alquiler de botes privados y yates en Moscú — con o sin capitán.",
    yakapitanCategory: "Alquiler de botes privados y yates en Moscú",
    yakapitanCampaign: "Lifestyle Reel / integración de producto",
    yakapitanResults: "88,8% engagement de no seguidores • 100+ guardados",
    yakapitanQuote: "La calidad de producción y autenticidad del contenido de Isaac son incomparables. Altamente recomendado para marcas premium.",
    Swdr: "Swdr.by",
    swdrDescription: "SWDR es una marca rusa de ropa vendida a través de los principales mercados en línea de Rusia.",
    swdrCategory: "SWDR es una marca rusa de ropa",
    swdrCampaign: "Lifestyle Reel / integración de producto",
    swdrResults: "91,9% engagement de no seguidores • 100+ guardados",
    swdrQuote: "Una audiencia que valora la calidad. Gracias por la colaboración.",
    Rooms: "Rooms Project",
    roomsDescription: "Rooms Project es un estudio de autorretrato con espacios interiores cuidadosamente diseñados en Moscú y San Petersburgo, pensado para sesiones fotográficas privadas, contenido personal y proyectos creativos.",
    roomsCategory: "Estudio de autorretrato en Moscú y San Petersburgo",
    roomsCampaign: "Lifestyle Reel / integración de producto",
    roomsResults: "80,1% engagement de no seguidores • 100+ guardados",
    roomsQuote: "Disfrutamos mucho colaborando con Isaac.",
    collaborationProof: "Resultados de campaña",
    campaignType: "Tipo de campaña",
    results: "Resultados",
  },
  ar: {
    tagline: "منشئ محتوى نمط حياة رجالي فاخر للعلامات التجارية الموجهة للجودة",
    taglineSupport: "محتوى سينمائي قصير الشكل يساعد العلامات التجارية الفاخرة في اللياقة البدنية والنمط الحياة والإكسسوارات والعناية الشخصية والعافية على الوصول إلى جمهور ذكوري متطلب من خلال التكامل الأصلي للمنتجات والمشاركة القابلة للقياس.",
    exploreCollaboration: "استكشف التعاون",
    monthlyReach: "الوصول الشهري",
    maleAudience: "الجمهور الذكوري",
    primaryAgeGroup: "مجموعة العمر الأساسية",
    aboutBrand: "عن العلامة التجارية",
    aboutText: "أنا أنشئ محتوى نمط حياة سينمائي للعلامات التجارية التي تقدر الجودة والحرفية والثقة. جمهوري يتكون بشكل أساسي من الرجال الذين تتراوح أعمارهم بين 25-34 سنة الذين يقدرون الجماليات المكررة والتطور الشخصي والأداء والمنتجات الفاخرة. كل تعاون مصمم ليشعر بأنه أصلي لمحتواي مع تزويد العلامات التجارية بأصول إبداعية واضحة وملاءمة الجمهور وإثبات الحملة.",
    bestFitFor: "الأنسب لـ",
    premiumFitness: "أندية اللياقة البدنية والرياضة الفاخرة",
    mensAccessories: "إكسسوارات الرجال",
    groomingWellness: "العناية الشخصية والعافية",
    menswearLifestyle: "الملابس الرجالية ومنتجات نمط الحياة",
    everydayCarry: "منتجات الحمل اليومي عالية الجودة",
    performanceBrands: "علامات الأداء والتطور الشخصي",
    recentCollaborations: "التعاونات الأخيرة",
    collaborationPackages: "حزم التعاون",
    getInTouch: "تواصل معنا",
    linkInBio: "Traffic Push",
    singleReel: "Awareness Reel",
    ambassador: "Ambassador Partnership",
    inquire: "استفسر",
    letsTalk: "لنتحدث",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    sendMessage: "إرسال الرسالة",
    thankYou: "شكراً! سأتواصل معك قريباً.",
    contact: "تواصل",
    collaboration: "تعاون",
    month: "200 ريال سعودي/شهر",
    reel: "350 ريال سعودي/رeel",
    reelStoriesLink: "من 650 ريال سعودي",
    custom: "حسب الطلب",
    brandLinkInProfile: "رابط العلامة التجارية في السيرة الذاتية للملف الشخصي",
    monthlyReachValue: "3.1+ وصول شهري",
    passiveTrafficGeneration: "توليد حركة مرور سلبية",
    professionalProduction: "إنتاج احترافي",
    authenticIntegration: "تكامل أصلي",
    fullUsageRights: "حقوق الاستخدام الكاملة",
    linkInBioContent: "رابط في السيرة الذاتية + محتوى",
    reelsPerMonth: "4+ reels/شهر",
    exclusivePartnership: "شراكة حصرية",
    engagementRate: "معدل المشاركة",
    directInquiries: "الاستفسارات المباشرة",
    linkCTR: "CTR رابط السيرة الذاتية",
    saves: "الحفظ",
    DreamBeachClub: "Dream Beach Club",
    dreamBeachClubDescription: "Dream Beach Club، أكبر مجمع في روسيا مع حمام سباحة VIP",
    dreamBeachClubCategory: "أكبر حمام سباحة في روسيا",
    dreamBeachClubCampaign: "Lifestyle Reel / تكامل المنتج",
    dreamBeachClubResults: "80.8% تفاعل من غير المتابعين • 100+ حفظ",
    dreamBeachClubQuote: "استمتعنا كثيراً بالتعاون مع Isaac. كل شيء كان سلساً واحترافياً وجميل التنفيذ. المنشورات الفوتوغرافية والمحتوى البصري عكسا بالكامل أجواء Dream Beach Club. سيسعدنا العمل معاً مرة أخرى.",
    Abib: "Abib",
    abibDescription: "مؤسسة على التزام قوي بالمنتجات النظيفة والطبيعية، ركزت العلامة التجارية باستمرار على الصيغ البسيطة المستوحاة من الطبيعة. يعكس هذا النهج حاجة متزايدة لحلول البشرة الحساسة المصنوعة من مكونات لطيفة ومستوحاة بشكل طبيعي.",
    abibCategory: "علامة تجارية كورية للعناية بالبشرة",
    abibCampaign: "Lifestyle Reel / تكامل المنتج",
    abibResults: "69.9% تفاعل من غير المتابعين • 100+ حفظ",
    abibQuote: "جمهوره يطابق تماماً جمهورنا المستهدف: رجال متطلبون وموجهون نحو الجودة.",
    Yakapitan: "Ya Kapitan",
    yakapitanDescription: "تأجير القوارب واليخوت الخاصة في موسكو — مع أو بدون قبطان.",
    yakapitanCategory: "تأجير القوارب واليخوت الخاصة في موسكو",
    yakapitanCampaign: "Lifestyle Reel / تكامل المنتج",
    yakapitanResults: "88.8% تفاعل من غير المتابعين • 100+ حفظ",
    yakapitanQuote: "جودة الإنتاج وأصالة محتوى Isaac لا تضاهى. موصى به بشدة للعلامات التجارية الفاخرة.",
    Swdr: "Swdr.by",
    swdrDescription: "SWDR هي علامة تجارية روسية للملابس تُباع عبر أسواق الإنترنت الرائدة في روسيا.",
    swdrCategory: "SWDR هي علامة تجارية روسية للملابس",
    swdrCampaign: "Lifestyle Reel / تكامل المنتج",
    swdrResults: "91.9% تفاعل من غير المتابعين • 100+ حفظ",
    swdrQuote: "جمهور يركز على الجودة. شكراً على التعاون.",
    Rooms: "Rooms Project",
    roomsDescription: "Rooms Project هي استوديو صور ذاتية بمساحات داخلية مختارة بعناية في موسكو وسانت بطرسبرغ، مصممة لجلسات التصوير الخاصة والمحتوى الشخصي والمشاريع الإبداعية.",
    roomsCategory: "استوديو صور ذاتية في موسكو وسانت بطرسبرغ",
    roomsCampaign: "Lifestyle Reel / تكامل المنتج",
    roomsResults: "80.1% تفاعل من غير المتابعين • 100+ حفظ",
    roomsQuote: "استمتعنا كثيراً بالتعاون مع Isaac.",
    collaborationProof: "نتائج الحملة",
    campaignType: "نوع الحملة",
    results: "النتائج",
  },
};

// Instagram Embed Component - supports both Reels and Posts
const InstagramEmbed = ({ url, title }: { url: string; title: string }) => {
  const getInstagramPath = (instagramUrl: string) => {
    const match = instagramUrl.match(/\/(reel|p)\/([^/?]+)/);
    return match ? `${match[1]}/${match[2]}` : null;
  };

  const instagramPath = getInstagramPath(url);
  if (!instagramPath) return null;

  return (
    <div className="w-full max-w-[420px] mx-auto aspect-[9/16] bg-black rounded-[8px] overflow-hidden shadow-sm">
      <iframe
        src={`https://www.instagram.com/${instagramPath}/embed`}
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

  const collaborations = [
    {
      name: t.DreamBeachClub,
      category: t.dreamBeachClubCategory,
      description: t.dreamBeachClubDescription,
      campaign: t.dreamBeachClubCampaign,
      results: t.dreamBeachClubResults,
      quote: t.dreamBeachClubQuote,
      url: "https://www.instagram.com/reel/DZZbnO8tAb9/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
      title: "Dream Beach Club",
    },
    {
      name: t.Abib,
      category: t.abibCategory,
      description: t.abibDescription,
      campaign: t.abibCampaign,
      results: t.abibResults,
      quote: t.abibQuote,
      url: "https://www.instagram.com/reel/DZpdNz3IsJ4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      title: "Abib",
    },
    {
      name: t.Yakapitan,
      category: t.yakapitanCategory,
      description: t.yakapitanDescription,
      campaign: t.yakapitanCampaign,
      results: t.yakapitanResults,
      quote: t.yakapitanQuote,
      url: "https://www.instagram.com/reel/DYzaM9zI0VX/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      title: "Ya Kapitan",
    },
    {
      name: t.Swdr,
      category: t.swdrCategory,
      description: t.swdrDescription,
      campaign: t.swdrCampaign,
      results: t.swdrResults,
      quote: t.swdrQuote,
      url: "https://www.instagram.com/reel/DZQNm0EIvb4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      title: "Swdr.by",
    },
    {
      name: t.Rooms,
      category: t.roomsCategory,
      description: t.roomsDescription,
      campaign: t.roomsCampaign,
      results: t.roomsResults,
      quote: t.roomsQuote,
      url: "https://www.instagram.com/p/DZRuUBLiPuo/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      title: "Rooms Project",
    },
  ];

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
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <a href="/" className="text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}>
            Isaac
          </a>
          <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
          <div className="flex gap-6">
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
            className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 leading-none"
            style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}
          >
            ISAAC HAKOBIAN
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-6 font-light">{t.tagline}</p>
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

      {/* Recent Collaborations Section */}
      <section id="collaboration" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-16" style={{ fontFamily: "Playfair Display, serif" }}>
            {t.recentCollaborations}
          </h2>

          <div className="space-y-16 md:space-y-20">
            {collaborations.map((item) => (
              <article
                key={item.name}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start md:items-center"
              >
                <div className="order-1">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-accent font-medium mb-4">{item.category}</p>
                  <p className="text-gray-700 leading-relaxed mb-6">{item.description}</p>
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t.campaignType}</p>
                    <p className="text-gray-700 font-medium">{item.campaign}</p>
                  </div>
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t.results}</p>
                    <p className="text-gray-700 font-medium">{item.results}</p>
                  </div>
                  <blockquote className="italic text-gray-700 border-l-4 border-accent pl-4">
                    "{item.quote}"
                  </blockquote>
                </div>
                <div className="order-2">
                  <InstagramEmbed url={item.url} title={item.title} />
                </div>
              </article>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

            {/* Ambassador Partnership */}
            <div className="border border-gray-300 p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                {t.ambassador}
              </h3>
              <p className="text-gray-600 mb-6">{t.custom}</p>
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
      <section id="contact" className="py-20 px-6 bg-white">
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
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.message}</label>
              <textarea
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full bg-accent text-white py-3 hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
            >
              {submitted ? t.thankYou : t.sendMessage}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}>
                Isaac Hakobian
              </h3>
              <p className="text-gray-400">Premium lifestyle content creator</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t.contact}</h4>
              <div className="space-y-2 text-gray-400">
                <a href="https://instagram.com/isaac_hakobian" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent">
                  <Instagram size={16} /> Instagram
                </a>
                <a href="mailto:isohakobian@gmail.com" className="flex items-center gap-2 hover:text-accent">
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t.collaboration}</h4>
              <p className="text-gray-400 text-sm">
                Interested in working together? Get in touch via Instagram DM or email.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 Isaac Hakobian. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
