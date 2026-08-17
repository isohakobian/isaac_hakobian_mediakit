import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle, Sparkles, Target, Layers } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { CollaborationLanguage } from "@shared/collaborations";

interface SelectorProps {
  language: CollaborationLanguage;
}

export const selectorTranslations: Record<CollaborationLanguage, {
  badge: string;
  title: string;
  subtitle: string;
  step1: string;
  step2: string;
  recommended: string;
  cta: string;
  modalTitle: string;
  modalDesc: (fmt: string) => string;
  brandName: string;
  contactName: string;
  email: string;
  telegram: string;
  budget: string;
  description: string;
  submitBtn: string;
  submitting: string;
  successToast: string;
  errorToast: string;
  requiredFieldsError: string;
  brandNamePlaceholder: string;
  contactNamePlaceholder: string;
  budgetPlaceholder: string;
  descriptionPlaceholder: string;
  categories: Array<{ id: string; title: string; description: string }>;
  goals: Array<{ id: string; title: string; format: string }>;
}> = {
  en: {
    badge: "Interactive Format Selector",
    title: "Find the Right Collaboration Format",
    subtitle: "Select your brand category and campaign goal to instantly receive the optimal integration recommendation.",
    step1: "Step 1 · Brand Category",
    step2: "Step 2 · Campaign Goal",
    recommended: "Recommended Format",
    cta: "Request This Format",
    modalTitle: "Collaboration Brief Request",
    modalDesc: (fmt) => `Selected format: ${fmt}`,
    brandName: "Brand Name *",
    contactName: "Your Name *",
    email: "Email *",
    telegram: "Telegram (optional)",
    budget: "Campaign Budget (optional)",
    description: "Task or Product Description *",
    submitBtn: "Submit Brief to Isaac",
    submitting: "Submitting...",
    successToast: "Brief submitted successfully! Isaac will be in touch soon.",
    errorToast: "Submission failed",
    requiredFieldsError: "Please complete all required fields.",
    brandNamePlaceholder: "e.g. Abib or Swdr",
    contactNamePlaceholder: "Your name",
    budgetPlaceholder: "e.g. $1,000 - $3,000",
    descriptionPlaceholder: "Briefly describe your product and campaign goals...",
    categories: [
      { id: "grooming", title: "Grooming & Hair Care", description: "Premium grooming, shaving, styling & cosmetics" },
      { id: "fashion", title: "Fashion & Wardrobe", description: "Men's menswear, capsules, accessories & footwear" },
      { id: "fitness", title: "Fitness & Sport", description: "Premium fitness clubs, sport nutrition & gear" },
      { id: "lifestyle", title: "Lifestyle & Luxury", description: "Luxury hospitality, private studios, automotive & living" },
    ],
    goals: [
      { id: "launch", title: "Product Launch", format: "Cinematic Reel + Stories Sequence + Product Staging" },
      { id: "awareness", title: "Brand Awareness", format: "High-reach Lifestyle Reel + Profile Integration" },
      { id: "conversion", title: "Sales & Traffic", format: "Direct-response Reel + Link in Bio + Save Optimized" },
      { id: "ugc", title: "UGC & Brand Assets", format: "Multi-format Visual Production for Brand Channels" },
    ],
  },
  ru: {
    badge: "Интерактивный подбор",
    title: "Подберите формат сотрудничества",
    subtitle: "Выберите направление вашего бренда и цель кампании — система мгновенно предложит оптимальное решение.",
    step1: "Шаг 1 · Категория бренда",
    step2: "Шаг 2 · Цель кампании",
    recommended: "Рекомендованный формат",
    cta: "Запросить этот формат",
    modalTitle: "Запрос на сотрудничество",
    modalDesc: (fmt) => `Выбранный формат: ${fmt}`,
    brandName: "Название бренда *",
    contactName: "Ваше имя *",
    email: "Email для связи *",
    telegram: "Telegram (опционально)",
    budget: "Бюджет кампании (опционально)",
    description: "Описание задачи или продукта *",
    submitBtn: "Отправить бриф Исааку",
    submitting: "Отправляем бриф...",
    successToast: "Бриф успешно отправлен! Исаак свяжется с вами в ближайшее время.",
    errorToast: "Ошибка отправки",
    requiredFieldsError: "Пожалуйста, заполните обязательные поля.",
    brandNamePlaceholder: "например, Abib или Swdr",
    contactNamePlaceholder: "Ваше имя",
    budgetPlaceholder: "например, $1 000 – $3 000",
    descriptionPlaceholder: "Кратко опишите продукт и задачу кампании...",
    categories: [
      { id: "grooming", title: "Grooming & Hair Care", description: "Премиальный уход, бритье, стайлинг и косметика" },
      { id: "fashion", title: "Fashion & Wardrobe", description: "Мужская одежда, капсулы, аксессуары и обувь" },
      { id: "fitness", title: "Fitness & Sport", description: "Фитнес-клубы, спортивное питание, экипировка" },
      { id: "lifestyle", title: "Lifestyle & Luxury", description: "Премиальный отдых, студии, авто, техника и стиль жизни" },
    ],
    goals: [
      { id: "launch", title: "Запуск продукта", format: "Cinematic Reel + Stories Sequence + Product Staging" },
      { id: "awareness", title: "Охват и узнаваемость", format: "High-reach Lifestyle Reel + Profile Integration" },
      { id: "conversion", title: "Конверсия и продажи", format: "Direct-response Reel + Link in Bio + Save Optimized" },
      { id: "ugc", title: "Создание контента (UGC)", format: "Multi-format Visual Production for Brand Channels" },
    ],
  },
  es: {
    badge: "Selector interactivo",
    title: "Encuentra el formato de colaboración",
    subtitle: "Selecciona la categoría de tu marca y objetivo de campaña para recibir la recomendación óptima.",
    step1: "Paso 1 · Categoría de marca",
    step2: "Paso 2 · Objetivo de campaña",
    recommended: "Formato recomendado",
    cta: "Solicitar este formato",
    modalTitle: "Solicitud de colaboración",
    modalDesc: (fmt) => `Formato seleccionado: ${fmt}`,
    brandName: "Nombre de marca *",
    contactName: "Tu nombre *",
    email: "Email *",
    telegram: "Telegram (opcional)",
    budget: "Presupuesto de campaña (opcional)",
    description: "Descripción de la tarea o producto *",
    submitBtn: "Enviar brief a Isaac",
    submitting: "Enviando brief...",
    successToast: "¡Brief enviado con éxito! Isaac se pondrá en contacto pronto.",
    errorToast: "Error al enviar",
    requiredFieldsError: "Completa todos los campos obligatorios.",
    brandNamePlaceholder: "por ejemplo, Abib o Swdr",
    contactNamePlaceholder: "Tu nombre",
    budgetPlaceholder: "por ejemplo, $1.000 - $3.000",
    descriptionPlaceholder: "Describe brevemente tu producto y los objetivos de la campaña...",
    categories: [
      { id: "grooming", title: "Grooming & Cuidado capilar", description: "Grooming premium, afeitado, estilismo y cosmética" },
      { id: "fashion", title: "Moda y Vestuario", description: "Ropa masculina, cápsulas, accesorios y calzado" },
      { id: "fitness", title: "Fitness y Deporte", description: "Clubes fitness premium, nutrición deportiva y equipo" },
      { id: "lifestyle", title: "Lifestyle & Luxury", description: "Hospitalidad de lujo, estudios privados, automoción y estilo" },
    ],
    goals: [
      { id: "launch", title: "Lanzamiento de producto", format: "Reel cinemático + Secuencia de Stories + Staging" },
      { id: "awareness", title: "Conciencia de marca", format: "Reel de alto alcance + Integración en perfil" },
      { id: "conversion", title: "Ventas y Tráfico", format: "Reel de respuesta directa + Link en bio + Guardados" },
      { id: "ugc", title: "Activos de marca y UGC", format: "Producción visual multiformato para canales de marca" },
    ],
  },
  ar: {
    badge: "محدد الصيغ التفاعلي",
    title: "اختر صيغة التعاون المناسبة",
    subtitle: "اختر فئة علامتك التجارية وهدف الحملة للحصول على التوصية المثلى فوراً.",
    step1: "الخطوة 1 · فئة العلامة التجارية",
    step2: "الخطوة 2 · هدف الحملة",
    recommended: "الصيغة الموصى بها",
    cta: "اطلب هذه الصيغة",
    modalTitle: "طلب موجز التعاون",
    modalDesc: (fmt) => `الصيغة المختارة: ${fmt}`,
    brandName: "اسم العلامة التجارية *",
    contactName: "اسمك *",
    email: "البريد الإلكتروني *",
    telegram: "تيليجرام (اختياري)",
    budget: "ميزانية الحملة (اختياري)",
    description: "وصف المهمة أو المنتج *",
    submitBtn: "إرسال الموجز إلى إسحاق",
    submitting: "جاري الإرسال...",
    successToast: "تم إرسال الموجز بنجاح! سيتواصل معك إسحاق قريباً.",
    errorToast: "فشل الإرسال",
    requiredFieldsError: "يرجى إكمال جميع الحقول المطلوبة.",
    brandNamePlaceholder: "مثال: Abib أو Swdr",
    contactNamePlaceholder: "اسمك",
    budgetPlaceholder: "مثال: 1,000 - 3,000 دولار",
    descriptionPlaceholder: "صف منتجك وهدف الحملة باختصار...",
    categories: [
      { id: "grooming", title: "العناية الشخصية والشعر", description: "العناية الفاخرة الحلاقة والتصفيف" },
      { id: "fashion", title: "الأزياء وخزانة الملابس", description: "الملابس الرجالية الإكسسوارات والأحذية" },
      { id: "fitness", title: "اللياقة البدنية والرياضة", description: "نوادي اللياقة البدنية والتغذية الرياضية" },
      { id: "lifestyle", title: "نمط الحياة الفاخر", description: "الضيافة الفاخرة الاستوديوهات الخاصة والسيارات" },
    ],
    goals: [
      { id: "launch", title: "إطلاق منتج", format: "ريل سينمائي + قصص متسلسلة + عرض منتج" },
      { id: "awareness", title: "الوعي بالعلامة التجارية", format: "ريل عالي الوصول + تكامل الملف الشخصي" },
      { id: "conversion", title: "المبيعات وحركة المرور", format: "ريل استجابة مباشرة + رابط في البايو" },
      { id: "ugc", title: "أصول المحتوى والعلامة", format: "إنتاج مرئي متعدد الأشكال لقنوات العلامة" },
    ],
  },
  fr: {
    badge: "Sélecteur de format interactif",
    title: "Trouvez le bon format de collaboration",
    subtitle: "Sélectionnez la catégorie de votre marque et l'objectif de la campagne pour recevoir instantanément la recommandation optimale.",
    step1: "Étape 1 · Catégorie de marque",
    step2: "Étape 2 · Objectif de campagne",
    recommended: "Format recommandé",
    cta: "Demander ce format",
    modalTitle: "Demande de collaboration",
    modalDesc: (fmt) => `Format sélectionné : ${fmt}`,
    brandName: "Nom de la marque *",
    contactName: "Votre nom *",
    email: "Email *",
    telegram: "Telegram (optionnel)",
    budget: "Budget de campagne (optionnel)",
    description: "Description du produit ou de la tâche *",
    submitBtn: "Envoyer le brief à Isaac",
    submitting: "Envoi en cours...",
    successToast: "Brief envoyé avec succès ! Isaac vous contactera bientôt.",
    errorToast: "Échec de l'envoi",
    requiredFieldsError: "Veuillez remplir tous les champs obligatoires.",
    brandNamePlaceholder: "ex. Abib ou Swdr",
    contactNamePlaceholder: "Votre nom",
    budgetPlaceholder: "ex. 1 000 – 3 000 $",
    descriptionPlaceholder: "Décrivez brièvement votre produit et les objectifs de la campagne...",
    categories: [
      { id: "grooming", title: "Soins et Coiffure", description: "Soins premium, rasage, coiffure et cosmétiques" },
      { id: "fashion", title: "Mode et Vestiaire", description: "Vêtements pour hommes, capsules, accessoires et chaussures" },
      { id: "fitness", title: "Fitness et Sport", description: "Clubs de fitness premium, nutrition sportive et équipement" },
      { id: "lifestyle", title: "Style de vie et Luxe", description: "Hôtellerie de luxe, studios privés, automobile et art de vivre" },
    ],
    goals: [
      { id: "launch", title: "Lancement de produit", format: "Reel cinématographique + Séquence de Stories + Staging" },
      { id: "awareness", title: "Notoriété de marque", format: "Reel Lifestyle à forte portée + Intégration profil" },
      { id: "conversion", title: "Ventes et Trafic", format: "Reel à réponse directe + Lien en bio + Sauvegardes" },
      { id: "ugc", title: "UGC et Actifs de marque", format: "Production visuelle multi-formats pour les canaux de marque" },
    ],
  },
};

export function CollaborationSelector({ language }: SelectorProps) {
  const dict = selectorTranslations[language] || selectorTranslations.en;
  const [selectedCategory, setSelectedCategory] = useState(dict.categories[0].id);
  const [selectedGoal, setSelectedGoal] = useState(dict.goals[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  const submitBrief = trpc.brandRequests.submit.useMutation({
    onSuccess: () => {
      toast.success(dict.successToast);
      setIsModalOpen(false);
      setBrandName("");
      setContactName("");
      setEmail("");
      setTelegram("");
      setBudget("");
      setDescription("");
    },
    onError: (err) => {
      toast.error(`${dict.errorToast}: ${err.message}`);
    },
  });

  const activeCategoryObj = dict.categories.find((c) => c.id === selectedCategory) || dict.categories[0];
  const activeGoalObj = dict.goals.find((g) => g.id === selectedGoal) || dict.goals[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !contactName || !email) {
      toast.error(dict.requiredFieldsError);
      return;
    }
    submitBrief.mutate({
      brandName,
      contactName,
      email,
      telegram: telegram || undefined,
      category: activeCategoryObj.title,
      goal: activeGoalObj.title,
      format: activeGoalObj.format,
      budget: budget || undefined,
      description: description || `Interactive brief for category: ${activeCategoryObj.title}, goal: ${activeGoalObj.title}`,
    });
  };

  return (
    <section dir={language === "ar" ? "rtl" : "ltr"} className="py-16 bg-[#fcfbfa] border-y border-[#f0ede6]" id="selector">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#aa7942]/10 text-[#aa7942] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="h-3.5 w-3.5" /> {dict.badge}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#211d19]">
            {dict.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            {dict.subtitle}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Step 1: Category */}
          <Card className="border-[#e6ded3] shadow-sm bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#aa7942] mb-4">
                <Layers className="h-4 w-4" /> {dict.step1}
              </div>
              <div className="grid gap-3">
                {dict.categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? "border-[#aa7942] bg-[#aa7942]/5 shadow-sm"
                        : "border-[#eef2f6] hover:border-[#d9cbbd] bg-white"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm text-[#211d19]">{cat.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{cat.description}</div>
                    </div>
                    {selectedCategory === cat.id && <CheckCircle className="h-5 w-5 text-[#aa7942] shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Goal & Recommendation */}
          <Card className="border-[#e6ded3] shadow-sm bg-white flex flex-col justify-between">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#aa7942] mb-4">
                <Target className="h-4 w-4" /> {dict.step2}
              </div>
              <div className="grid gap-3 mb-6">
                {dict.goals.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      selectedGoal === goal.id
                        ? "border-[#aa7942] bg-[#aa7942]/5 shadow-sm"
                        : "border-[#eef2f6] hover:border-[#d9cbbd] bg-white"
                    }`}
                  >
                    <div className="font-medium text-sm text-[#211d19]">{goal.title}</div>
                    {selectedGoal === goal.id && <CheckCircle className="h-4 w-4 text-[#aa7942] shrink-0 ml-2" />}
                  </button>
                ))}
              </div>

              {/* Recommendation Box */}
              <div className="rounded-xl bg-[#f8f6f2] border border-[#e6ded3] p-4 text-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8b6134] mb-1">{dict.recommended}</div>
                <div className="font-serif text-base font-medium text-[#211d19]">{activeGoalObj.format}</div>
              </div>
            </CardContent>

            <div className="p-6 sm:p-8 pt-0">
              <Button
                type="button"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#211d19] text-white hover:bg-black py-6 text-sm font-medium tracking-wide shadow-md"
              >
                <span>{dict.cta}</span>
                <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Brand Brief Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-[#e6ded3]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal">{dict.modalTitle}</DialogTitle>
            <DialogDescription>
              {dict.modalDesc(activeGoalObj.format)}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">{dict.brandName}</Label>
                <Input
                  id="brandName"
                  placeholder={dict.brandNamePlaceholder}
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">{dict.contactName}</Label>
                <Input
                  id="contactName"
                  placeholder={dict.contactNamePlaceholder}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{dict.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="brand@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">{dict.telegram}</Label>
                <Input
                  id="telegram"
                  placeholder="@username"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">{dict.budget}</Label>
              <Input
                id="budget"
                placeholder={dict.budgetPlaceholder}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{dict.description}</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder={dict.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#211d19] text-white hover:bg-black py-6 mt-4"
              disabled={submitBrief.isPending}
            >
              {submitBrief.isPending ? dict.submitting : dict.submitBtn}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default CollaborationSelector;
