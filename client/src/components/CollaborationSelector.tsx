import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle, Sparkles, Target, Layers } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const categories = [
  { id: "grooming", title: "Grooming & Hair Care", description: "Премиальный уход, бритье, стайлинг и косметика" },
  { id: "fashion", title: "Fashion & Wardrobe", description: "Мужская одежда, капсулы, аксессуары и обувь" },
  { id: "fitness", title: "Fitness & Sport", description: "Фитнес-клубы, спортивное питание, экипировка" },
  { id: "lifestyle", title: "Lifestyle & Luxury", description: "Премиальный отдых, студии, авто, техника и стиль жизни" },
];

const goals = [
  { id: "launch", title: "Запуск продукта / Product Launch", format: "Cinematic Reel + Stories Sequence + Product Staging" },
  { id: "awareness", title: "Охват и узнаваемость / Brand Awareness", format: "High-reach Lifestyle Reel + Profile Integration" },
  { id: "conversion", title: "Конверсия и продажи / Sales & Traffic", format: "Direct-response Reel + Link in Bio + Save Optimized" },
  { id: "ugc", title: "Создание контента / UGC & Brand Assets", format: "Multi-format Visual Production for Brand Channels" },
];

export function CollaborationSelector() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedGoal, setSelectedGoal] = useState(goals[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  const submitBrief = trpc.brandRequests.submit.useMutation({
    onSuccess: () => {
      toast.success("Бриф успешно отправлен! Исаак свяжется с вами в ближайшее время.");
      setIsModalOpen(false);
      setBrandName("");
      setContactName("");
      setEmail("");
      setTelegram("");
      setBudget("");
      setDescription("");
    },
    onError: (err) => {
      toast.error(`Ошибка отправки: ${err.message}`);
    },
  });

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory) || categories[0];
  const activeGoalObj = goals.find((g) => g.id === selectedGoal) || goals[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !contactName || !email) {
      toast.error("Пожалуйста, заполните обязательные поля");
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
      description: description || `Интерактивный бриф по категории: ${activeCategoryObj.title}, цель: ${activeGoalObj.title}`,
    });
  };

  return (
    <section className="py-16 bg-[#fcfbfa] border-y border-[#f0ede6]" id="selector">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#aa7942]/10 text-[#aa7942] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Interactive Format Selector
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#211d19]">
            Подберите формат сотрудничества
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Выберите направление вашего бренда и цель кампании — система мгновенно предложит оптимальное решение для вашей аудитории.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Step 1: Category */}
          <Card className="border-[#e6ded3] shadow-sm bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#aa7942] mb-4">
                <Layers className="h-4 w-4" /> Шаг 1 · Категория бренда
              </div>
              <div className="grid gap-3">
                {categories.map((cat) => (
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
                <Target className="h-4 w-4" /> Шаг 2 · Цель кампании
              </div>
              <div className="grid gap-3 mb-6">
                {goals.map((goal) => (
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
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8b6134] mb-1">Рекомендованный формат</div>
                <div className="font-serif text-base font-medium text-[#211d19]">{activeGoalObj.format}</div>
                <div className="text-xs text-muted-foreground mt-1">Оптимально для категории {activeCategoryObj.title} с фокусом на вовлечение мужской аудитории.</div>
              </div>
            </CardContent>

            <div className="p-6 sm:p-8 pt-0">
              <Button
                type="button"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#211d19] text-white hover:bg-black py-6 text-sm font-medium tracking-wide shadow-md"
              >
                <span>Запросить этот формат</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Brand Brief Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-[#e6ded3]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal">Запрос на сотрудничество</DialogTitle>
            <DialogDescription>
              Выбранный формат: <strong className="text-[#211d19]">{activeGoalObj.format}</strong> ({activeCategoryObj.title})
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Название бренда *</Label>
                <Input
                  id="brandName"
                  placeholder="например, Abib / Swdr"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Ваше имя *</Label>
                <Input
                  id="contactName"
                  placeholder="например, Алексей"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email для связи *</Label>
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
                <Label htmlFor="telegram">Telegram (опционально)</Label>
                <Input
                  id="telegram"
                  placeholder="@username"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Бюджет кампании (опционально)</Label>
              <Input
                id="budget"
                placeholder="например, $1,000 - $3,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание задачи или продукта *</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Расскажите в нескольких словах о продукте и сроках запуска..."
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
              {submitBrief.isPending ? "Отправляем бриф..." : "Отправить бриф Исааку"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default CollaborationSelector;
