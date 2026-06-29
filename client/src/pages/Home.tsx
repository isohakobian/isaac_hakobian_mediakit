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
    Reel+stories+30dayslink:"from $800"
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
    Abib: "Abib",
    Yakapitan: "Ya Kapitan",
    Swdr: "Swdr.by",
    Rooms: "Rooms Project"
    DreamBeachClub: "The largest in Russia Dream Beach Club with a VIP swimming pool",
    Abib: "Rooted in a strong commitment to clean, natural products, the brand has consistently focused on minimalist formulations inspired by nature. This approach reflects a growing need for sensitive skin solutions made with gentle, naturally inspired ingredients.",
    Yakapitan: "Private boat and yacht rentals in Moscow — available with or without a captain.",
    Swdr: "Swdr is a Russian clothing brand sold through leading online marketplaces in Russia.",
    Rooms: "Rooms Project is a self-portrait studio with curated interior spaces in Moscow and Saint Petersburg, designed for private photoshoots, personal content, and creative projects."
    collaborationProof: "Campaign Results",
    campaignType: "Campaign Type",
    results: "Results",
    dreamBeachClubCategory: "The largest in Russia swimming pool",
    dreamBeachClubCampaign: "Lifestyle reel / product integration",
    dreamBeachClubResults: "80.8% engagement rate non followers • 100+ saves",
    dreamBeachClubQuote: "We truly enjoyed collaborating with Isaac. Everything was smooth, professional, and beautifully executed. The photo publications and visual content fully reflected the atmosphere of Dream Beach Club. We would be happy to work together again.",
    abibCampaign: "Korean skincare breand",
    abibCategory: "Lifestyle reel / product integration",
    abibResults: "69.9% engagement rate non followers • 100+ saves",
    abibQuote: "His followers are exactly our target demographic - discerning, quality-focused men.",
    YakapitanCategory: "Private boat and yacht rentals in Moscow",
    YakapitanCampaign: "Lifestyle reel / product integration",
    YakapitanResults: "88.8% engagement rate non followers • 100+ saves",
    YakapitanQuote: "The production quality and authenticity of Isaac's content is unmatched. Highly recommended for premium brands.",
    SwdrCategory: "Swdr is a Russian clothing brand",
    SwdrCampaign: "Lifestyle reel / product integration",
    SwdrResults: "91.9% engagement rate non followers • 100+ saves",
    SwdrQuote: "Quality-focused men.Thank you for collaboration",
    RoomsCategory: "The self-portrait studio in Moscow and Saint Petersburg",
    RoomsCampaign: "Lifestyle reel / product integration",
    RoomsResults: "80.1% engagement rate non followers • 100+ saves",
    RoomsQuote: "We truly enjoyed collaborating with Isaac.",
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
    dreamBeachClubCampaign: "Lifestyle reel / product integration",
    dreamBeachClubResults: "80,8% вовлечённости среди неподписчиков • 100+ сохранений",
    dreamBeachClubQuote: "Нам было очень приятно сотрудничать с Исаак. Всё прошло гладко, профессионально и красиво. Фотопубликации и визуальный контент полностью передали атмосферу Dream Beach Club. Будем рады поработать вместе снова.",
    abibCategory: "Корейский бренд уходовой косметики",
    abibCampaign: "Lifestyle reel / product integration",
    abibResults: "69,9% вовлечённости среди неподписчиков • 100+ сохранений",
    abibQuote: "Его аудитория точно совпадает с нашей целевой аудиторией — это мужчины, которые ценят качество и внимательно выбирают продукты.",
    yakapitanCategory: "Аренда частных катеров и яхт в Москве",
    yakapitanCampaign: "Lifestyle reel / product integration",
    yakapitanResults: "88,8% вовлечённости среди неподписчиков • 100+ сохранений",
    yakapitanQuote: "Качество продакшена и естественность контента Исаак — на очень высоком уровне. Рекомендуем для премиальных брендов.",
    swdrCategory: "SWDR — российский бренд одежды",
    swdrCampaign: "Lifestyle reel / product integration",
    swdrResults: "91,9% вовлечённости среди неподписчиков • 100+ сохранений",
    swdrQuote: "Аудитория, которая ценит качество. Спасибо за сотрудничество.",
    roomsCategory: "Студия автопортрета в Москве и Санкт-Петербурге",
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
    Reel+stories+30dayslink:"от 25.000",
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
    onHillSport: "On Hill Sport",
    keybell: "Keybell",
    reboot: "Reboot",
    onHillSportDesc: "Спортивная одежда премиум-класса и утяжелённые аксессуары. Создал привлекательный контент, демонстрирующий продукты бренда в аутентичных сценариях образа жизни. Достиг высокого уровня вовлечённости с прямыми запросами о продуктах в комментариях.",
    keybellDesc: "Российский бренд люксовых аксессуаров. Тестовое сотрудничество с персонализированным брелоком.",
    rebootDesc: "Сотрудничество с брендом Reboot sport club в качестве премиум-амбассадора с премиальными продуктами и эстетичным контентом образа жизни. Сильный отклик аудитории с высокими показателями вовлечённости и качественной демографией.",
  },
  fr: {
    tagline: "Créateur lifestyle masculin premium pour les marques axées sur la qualité",
    taglineSupport: "Du contenu short-form cinématographique qui aide les marques premium de fitness, lifestyle, accessoires, grooming et wellness à toucher une audience masculine exigeante grâce à une intégration produit authentique et des résultats d’engagement mesurables.",
    exploreCollaboration: "Explorer une collaboration",
    monthlyReach: "Portée mensuelle",
    maleAudience: "Audience masculine",
    primaryAgeGroup: "Tranche d’âge principale",
    aboutBrand: "À propos de la marque",
    aboutText: "Je crée du contenu lifestyle cinématographique pour les marques qui valorisent la qualité, le savoir-faire et la confiance. Mon audience est principalement composée d’hommes de 25 à 34 ans, sensibles à une esthétique raffinée, au développement personnel, à la performance et aux produits premium. Chaque collaboration est conçue pour s’intégrer naturellement à mon contenu tout en offrant aux marques des assets créatifs clairs, une audience pertinente et des preuves de performance de campagne.",
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
    Reel+stories+30dayslink:"from €650",
    brandLinkInProfile: "Lien de la marque dans la bio du profil",
    monthlyReachValue: "3.1+ de portée mensuelle",
    passiveTrafficGeneration: "Génération passive de trafic",
    professionalProduction: "Production professionnelle",
    authenticIntegration: "Intégration authentique",
    fullUsageRights: "Droits d’utilisation complets",
    linkInBioContent: "Lien en bio + contenu",
    reelsPerMonth: "4+ reels/mois",
    exclusivePartnership: "Partenariat exclusif",
    engagementRate: "Taux d’engagement",
    directInquiries: "Demandes directes",
    linkCTR: "CTR du lien en bio",
    saves: "Enregistrements",
    DreamBeachClub: "Dream Beach Club",
    Abib: "Abib",
    Yakapitan: "Ya Kapitan",
    Swdr: "Swdr.by",
    Rooms: "Rooms Project",
    dreamBeachClubDescription: "Dream Beach Club, le plus grand complexe de Russie avec une piscine VIP",
    abibDescription: "Fondée sur un fort engagement envers des produits propres et naturels, la marque s’est toujours concentrée sur des formules minimalistes inspirées par la nature. Cette approche répond à un besoin croissant de solutions pour peaux sensibles, formulées avec des ingrédients doux et naturellement inspirés.",
    yakapitanDescription: "Location de bateaux privés et de yachts à Moscou — avec ou sans capitaine.",
    swdrDescription: "SWDR est une marque russe de vêtements vendue sur les principales marketplaces en ligne de Russie.",
    roomsDescription: "Rooms Project est un studio d’autoportrait avec des espaces intérieurs soigneusement conçus à Moscou et Saint-Pétersbourg, pensé pour les shootings privés, le contenu personnel et les projets créatifs.",
    collaborationProof: "Résultats de campagne",
    campaignType: "Type de campagne",
    results: "Résultats",
    dreamBeachClubCategory: "La plus grande piscine de Russie",
    dreamBeachClubCampaign: "Lifestyle Reel / intégration produit",
    dreamBeachClubResults: "80,8 % d’engagement auprès des non-abonnés • 100+ enregistrements",
    dreamBeachClubQuote: "Nous avons beaucoup apprécié notre collaboration avec Isaac. Tout s’est déroulé de manière fluide, professionnelle et élégante. Les publications photo et le contenu visuel ont pleinement retranscrit l’atmosphère de Dream Beach Club. Nous serions ravis de retravailler ensemble.",
    abibCategory: "Marque coréenne de soins de la peau",
    abibCampaign: "Lifestyle Reel / intégration produit",
    abibResults: "69,9 % d’engagement auprès des non-abonnés • 100+ enregistrements",
    abibQuote: "Son audience correspond exactement à notre cible : des hommes exigeants, attentifs à la qualité et sélectifs dans le choix des produits.",
    yakapitanCategory: "Location de bateaux privés et de yachts à Moscou",
    yakapitanCampaign: "Lifestyle Reel / intégration produit",
    yakapitanResults: "88,8 % d’engagement auprès des non-abonnés • 100+ enregistrements",
    yakapitanQuote: "La qualité de production et l’authenticité du contenu d’Isaac sont incomparables. Fortement recommandé pour les marques premium.",
    swdrCategory: "SWDR est une marque russe de vêtements",
    swdrCampaign: "Lifestyle Reel / intégration produit",
    swdrResults: "91,9 % d’engagement auprès des non-abonnés • 100+ enregistrements",
    swdrQuote: "Des hommes axés sur la qualité. Merci pour cette collaboration.",
    roomsCategory: "Studio d’autoportrait à Moscou et Saint-Pétersbourg",
    roomsCampaign: "Lifestyle Reel / intégration produit",
    roomsResults: "80,1 % d’engagement auprès des non-abonnés • 100+ enregistrements",
    roomsQuote: "Nous avons beaucoup apprécié notre collaboration avec Isaac.",
  },
  es: {
    tagline: "Creador lifestyle masculino premium para marcas enfocadas en la calidad",
    taglineSupport: "Contenido short-form cinematográfico que ayuda a marcas premium de fitness, lifestyle, accesorios, grooming y wellness a llegar a una audiencia masculina exigente mediante integración de producto auténtica y engagement medible.",
    exploreCollaboration: "Explorar colaboración",
    monthlyReach: "Alcance mensual",
    maleAudience: "Audiencia masculina",
    primaryAgeGroup: "Grupo de edad principal",
    aboutBrand: "Sobre la marca",
    aboutText: "Creo contenido lifestyle cinematográfico para marcas que valoran la calidad, la artesanía y la confianza. Mi audiencia está formada principalmente por hombres de 25 a 34 años que responden a una estética refinada, desarrollo personal, rendimiento y productos premium. Cada colaboración está diseñada para sentirse natural dentro de mi contenido, mientras ofrece a las marcas assets creativos claros, afinidad con la audiencia y prueba de resultados de campaña.",
    bestFitFor: "Ideal para",
    premiumFitness: "Clubes premium de fitness y deporte",
    mensAccessories: "Accesorios masculinos",
    groomingWellness: "Grooming y wellness",
    menswearLifestyle: "Moda masculina y productos lifestyle",
    everydayCarry: "Productos everyday carry de alta calidad",
    performanceBrands: "Marcas de rendimiento y desarrollo personal",
    recentCollaborations: "Colaboraciones recientes",
    collaborationPackages: "Paquetes de colaboración",
    getInTouch: "Contactar",
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
    month: "€150/mes",
    reel: "€250/reel",
    Reel+stories+30dayslink:"from €500",
    brandLinkInProfile: "Link de la marca en la bio del perfil",
    monthlyReachValue: "3.1+ de alcance mensual",
    passiveTrafficGeneration: "Generación pasiva de tráfico",
    professionalProduction: "Producción profesional",
    authenticIntegration: "Integración auténtica",
    fullUsageRights: "Derechos completos de uso",
    linkInBioContent: "Link en bio + contenido",
    reelsPerMonth: "4+ reels/mes",
    exclusivePartnership: "Colaboración exclusiva",
    engagementRate: "Tasa de engagement",
    directInquiries: "Consultas directas",
    linkCTR: "CTR del link en bio",
    saves: "Guardados",
    DreamBeachClub: "Dream Beach Club",
    Abib: "Abib",
    Yakapitan: "Ya Kapitan",
    Swdr: "Swdr.by",
    Rooms: "Rooms Project",
    dreamBeachClubDescription: "Dream Beach Club, el complejo más grande de Rusia con piscina VIP",
    abibDescription: "Con una fuerte apuesta por productos limpios y naturales, la marca se ha centrado constantemente en fórmulas minimalistas inspiradas en la naturaleza. Este enfoque responde a una necesidad creciente de soluciones para piel sensible elaboradas con ingredientes suaves e inspirados en lo natural.",
    yakapitanDescription: "Alquiler de barcos privados y yates en Moscú — con o sin capitán.",
    swdrDescription: "SWDR es una marca rusa de ropa vendida en los principales marketplaces online de Rusia.",
    roomsDescription: "Rooms Project es un estudio de autorretratos con espacios interiores cuidadosamente diseñados en Moscú y San Petersburgo, creado para sesiones privadas, contenido personal y proyectos creativos.",
    collaborationProof: "Resultados de campaña",
    campaignType: "Tipo de campaña",
    results: "Resultados",
    dreamBeachClubCategory: "La piscina más grande de Rusia",
    dreamBeachClubCampaign: "Lifestyle Reel / integración de producto",
    dreamBeachClubResults: "80,8 % de engagement entre no seguidores • 100+ guardados",
    dreamBeachClubQuote: "Disfrutamos mucho colaborar con Isaac. Todo fue fluido, profesional y ejecutado con mucho gusto. Las publicaciones fotográficas y el contenido visual reflejaron completamente la atmósfera de Dream Beach Club. Estaríamos encantados de trabajar juntos de nuevo.",
    abibCategory: "Marca coreana de skincare",
    abibCampaign: "Lifestyle Reel / integración de producto",
    abibResults: "69,9 % de engagement entre no seguidores • 100+ guardados",
    abibQuote: "Su audiencia coincide exactamente con nuestro público objetivo: hombres exigentes, enfocados en la calidad y cuidadosos al elegir productos.",
    yakapitanCategory: "Alquiler de barcos privados y yates en Moscú",
    yakapitanCampaign: "Lifestyle Reel / integración de producto",
    yakapitanResults: "88,8 % de engagement entre no seguidores • 100+ guardados",
    yakapitanQuote: "La calidad de producción y la autenticidad del contenido de Isaac son incomparables. Muy recomendado para marcas premium.",
    swdrCategory: "SWDR es una marca rusa de ropa",
    swdrCampaign: "Lifestyle Reel / integración de producto",
    swdrResults: "91,9 % de engagement entre no seguidores • 100+ guardados",
    swdrQuote: "Hombres enfocados en la calidad. Gracias por la colaboración.",
    roomsCategory: "Estudio de autorretratos en Moscú y San Petersburgo",
    roomsCampaign: "Lifestyle Reel / integración de producto",
    roomsResults: "80,1 % de engagement entre no seguidores • 100+ guardados",
    roomsQuote: "Disfrutamos mucho colaborar con Isaac.",
  },
  ar: {
    tagline: "صانع محتوى لايف ستايل رجالي فاخر للعلامات التجارية التي تركز على الجودة",
    taglineSupport: "محتوى قصير بأسلوب سينمائي يساعد علامات اللياقة واللايف ستايل والإكسسوارات والعناية الشخصية والويلنس الفاخرة على الوصول إلى جمهور رجالي دقيق الاختيار من خلال دمج طبيعي للمنتج ونتائج تفاعل قابلة للقياس.",
    exploreCollaboration: "استكشف التعاون",
    monthlyReach: "الوصول الشهري",
    maleAudience: "جمهور رجالي",
    primaryAgeGroup: "الفئة العمرية الأساسية",
    aboutBrand: "عن البراند",
    aboutText: "أصنع محتوى لايف ستايل بأسلوب سينمائي للعلامات التجارية التي تهتم بالجودة والحرفة والثقة. جمهوري يتكوّن بشكل أساسي من رجال بعمر 25–34 عامًا يهتمون بالجماليات الراقية، وتطوير الذات، والأداء، والمنتجات الفاخرة. كل تعاون يتم تنفيذه بطريقة تبدو طبيعية داخل المحتوى، مع تقديم مواد إبداعية واضحة للعلامة التجارية، وتوافق قوي مع الجمهور، وإثبات واضح لنتائج الحملة.",
    bestFitFor: "مناسب أكثر لـ",
    premiumFitness: "نوادي اللياقة والرياضة الفاخرة",
    mensAccessories: "إكسسوارات الرجال",
    groomingWellness: "العناية الشخصية والويلنس",
    menswearLifestyle: "الأزياء الرجالية ومنتجات اللايف ستايل",
    everydayCarry: "منتجات يومية عالية الجودة",
    performanceBrands: "علامات الأداء وتطوير الذات",
    recentCollaborations: "أحدث التعاونات",
    collaborationPackages: "باقات التعاون",
    getInTouch: "تواصل معي",
    linkInBio: "Traffic Push",
    singleReel: "Awareness Reel",
    ambassador: "Ambassador Partnership",
    inquire: "استفسار",
    letsTalk: "لنتحدث",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    sendMessage: "إرسال الرسالة",
    thankYou: "شكرًا لك! سأتواصل معك قريبًا.",
    contact: "التواصل",
    collaboration: "التعاون",
    month: "$300/شهريًا",
    reel: "$600/reel",
    Reel+stories+30dayslink:"from $1.000"
    brandLinkInProfile: "رابط البراند في البايو",
    monthlyReachValue: "3.1+ وصول شهري",
    passiveTrafficGeneration: "توليد زيارات بشكل مستمر",
    professionalProduction: "إنتاج احترافي",
    authenticIntegration: "دمج طبيعي للمنتج",
    fullUsageRights: "حقوق استخدام كاملة",
    linkInBioContent: "رابط في البايو + محتوى",
    reelsPerMonth: "4+ reels/شهريًا",
    exclusivePartnership: "شراكة حصرية",
    engagementRate: "نسبة التفاعل",
    directInquiries: "استفسارات مباشرة",
    linkCTR: "CTR رابط البايو",
    saves: "الحفظ",
    DreamBeachClub: "Dream Beach Club",
    Abib: "Abib",
    Yakapitan: "Ya Kapitan",
    Swdr: "Swdr.by",
    Rooms: "Rooms Project",
    dreamBeachClubDescription: "Dream Beach Club، أكبر مجمع في روسيا مع مسبح VIP",
    abibDescription: "يعتمد البراند على التزام قوي بالمنتجات النظيفة والطبيعية، ويركز باستمرار على تركيبات بسيطة مستوحاة من الطبيعة. هذا الأسلوب يلبي الحاجة المتزايدة إلى حلول مناسبة للبشرة الحساسة بمكونات لطيفة ومستوحاة من الطبيعة.",
    yakapitanDescription: "تأجير قوارب ويخوت خاصة في موسكو — مع كابتن أو بدون كابتن.",
    swdrDescription: "SWDR هو براند ملابس روسي يُباع عبر أهم المتاجر الإلكترونية في روسيا.",
    roomsDescription: "Rooms Project هو استوديو تصوير ذاتي بمساحات داخلية منسقة في موسكو وسانت بطرسبرغ، مخصص لجلسات التصوير الخاصة، والمحتوى الشخصي، والمشاريع الإبداعية.",
    collaborationProof: "نتائج الحملة",
    campaignType: "نوع الحملة",
    results: "النتائج",
    dreamBeachClubCategory: "أكبر مسبح في روسيا",
    dreamBeachClubCampaign: "Lifestyle Reel / product integration",
    dreamBeachClubResults: "80.8% تفاعل من غير المتابعين • 100+ حفظ",
    dreamBeachClubQuote: "استمتعنا كثيرًا بالتعاون مع Isaac. كل شيء كان سلسًا واحترافيًا ومنفذًا بشكل جميل. المنشورات المصورة والمحتوى البصري عكسوا أجواء Dream Beach Club بالكامل. يسعدنا العمل معًا مرة أخرى.",
    abibCategory: "براند كوري للعناية بالبشرة",
    abibCampaign: "Lifestyle Reel / product integration",
    abibResults: "69.9% تفاعل من غير المتابعين • 100+ حفظ",
    abibQuote: "جمهوره يطابق تمامًا جمهورنا المستهدف: رجال دقيقون في اختياراتهم ويركزون على الجودة.",
    yakapitanCategory: "تأجير قوارب ويخوت خاصة في موسكو",
    yakapitanCampaign: "Lifestyle Reel / product integration",
    yakapitanResults: "88.8% تفاعل من غير المتابعين • 100+ حفظ",
    yakapitanQuote: "جودة الإنتاج وطبيعية محتوى Isaac على مستوى استثنائي. نوصي به بشدة للعلامات التجارية الفاخرة.",
    swdrCategory: "SWDR هو براند ملابس روسي",
    swdrCampaign: "Lifestyle Reel / product integration",
    swdrResults: "91.9% تفاعل من غير المتابعين • 100+ حفظ",
    swdrQuote: "جمهور يركز على الجودة. شكرًا على التعاون.",
    roomsCategory: "استوديو تصوير ذاتي في موسكو وسانت بطرسبرغ",
    roomsCampaign: "Lifestyle Reel / product integration",
    roomsResults: "80.1% تفاعل من غير المتابعين • 100+ حفظ",
    roomsQuote: "استمتعنا كثيرًا بالتعاون مع Isaac.",
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
  <div className="w-full max-w-[420px] mx-auto aspect-[9/16] bg-black rounded-[8px] overflow-hidden shadow-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
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
              <InstagramReel
                url="https://www.instagram.com/reel/DX-KPOfo2YV/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                title="Keybell Reel"
              />
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
