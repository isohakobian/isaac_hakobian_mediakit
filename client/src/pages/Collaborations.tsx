import { useAuth } from "@/_core/hooks/useAuth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { collaborationLanguages, filterCollaborations, type CollaborationLanguage, type CollaborationTranslation, type CollaborationTranslations, type ManagedCollaboration } from "@shared/collaborations";
import { removeFilterPreset, upsertFilterPreset, type CollaborationFilterPreset } from "@shared/filterPresets";
import { ArrowLeft, CalendarDays, Check, ExternalLink, Eye, EyeOff, FolderKanban, Instagram, Pencil, Plus, Save, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const FILTER_PRESETS_STORAGE_KEY = "isaac-collaboration-filter-presets-v1";

function loadFilterPresets(): CollaborationFilterPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FILTER_PRESETS_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is CollaborationFilterPreset => Boolean(item?.id && item?.name)) : [];
  } catch {
    return [];
  }
}

const languageLabels: Record<CollaborationLanguage, string> = {
  en: "English",
  ru: "Русский",
  es: "Español",
  ar: "العربية",
  fr: "Français",
};

const createEmptyTranslation = (): CollaborationTranslation => ({
  name: "",
  category: "",
  description: "",
  campaign: "",
  results: "",
  quote: "",
  quoteLabel: "",
});

const createEmptyTranslations = (): CollaborationTranslations => ({
  en: createEmptyTranslation(),
  ru: createEmptyTranslation(),
  es: createEmptyTranslation(),
  ar: createEmptyTranslation(),
  fr: createEmptyTranslation(),
});

const today = () => new Date().toISOString().slice(0, 10);

const createBlankForm = () => ({
  translations: createEmptyTranslations(),
  mediaUrl: "",
  mediaTitle: "",
  publishedAt: today(),
  isPublished: true,
});

type CollaborationForm = ReturnType<typeof createBlankForm>;

function isTranslationComplete(translation: CollaborationTranslation) {
  return [translation.name, translation.category, translation.description, translation.campaign, translation.results, translation.quote].every((value) => value.trim().length > 0);
}

function formFromCollaboration(item: ManagedCollaboration): CollaborationForm {
  return {
    translations: item.translations,
    mediaUrl: item.mediaUrl,
    mediaTitle: item.mediaTitle,
    publishedAt: item.publishedAt ?? "",
    isPublished: item.isPublished === 1,
  };
}

export function Collaborations() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const isAdmin = user?.role === "admin";
  const [form, setForm] = useState<CollaborationForm>(() => createBlankForm());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewLanguage, setPreviewLanguage] = useState<CollaborationLanguage>("en");
  const [deleteTarget, setDeleteTarget] = useState<ManagedCollaboration | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [languageFilter, setLanguageFilter] = useState<"all" | CollaborationLanguage>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterPresetName, setFilterPresetName] = useState("");
  const [filterPresets, setFilterPresets] = useState<CollaborationFilterPreset[]>(() => loadFilterPresets());

  const collaborationsQuery = trpc.collaborations.list.useQuery(undefined, { enabled: isAdmin });
  const utils = trpc.useUtils();
  const createMutation = trpc.collaborations.create.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.collaborations.list.invalidate(), utils.collaborations.publicList.invalidate()]);
      toast.success("Коллаборация сохранена");
      setEditingId(null);
      setForm(createBlankForm());
    },
    onError: (error) => toast.error(error.message || "Не удалось сохранить коллаборацию"),
  });
  const updateMutation = trpc.collaborations.update.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.collaborations.list.invalidate(), utils.collaborations.publicList.invalidate()]);
      toast.success("Изменения сохранены");
    },
    onError: (error) => toast.error(error.message || "Не удалось обновить коллаборацию"),
  });
  const deleteMutation = trpc.collaborations.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.collaborations.list.invalidate(), utils.collaborations.publicList.invalidate()]);
      toast.success("Коллаборация удалена");
      setDeleteTarget(null);
      if (editingId !== null) {
        setEditingId(null);
        setForm(createBlankForm());
      }
    },
    onError: (error) => toast.error(error.message || "Не удалось удалить коллаборацию"),
  });

  const sortedItems = useMemo(() => collaborationsQuery.data ?? [], [collaborationsQuery.data]);
  const filteredItems = useMemo(() => filterCollaborations(sortedItems, {
    query: searchQuery,
    status: statusFilter,
    language: languageFilter,
    fromDate,
    toDate,
  }), [fromDate, languageFilter, searchQuery, sortedItems, statusFilter, toDate]);
  const hasFilters = Boolean(searchQuery || statusFilter !== "all" || languageFilter !== "all" || fromDate || toDate);
  const activePreview = form.translations[previewLanguage];

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FILTER_PRESETS_STORAGE_KEY, JSON.stringify(filterPresets));
    }
  }, [filterPresets]);

  useEffect(() => {
    if (!hasFilters) {
      setIsFiltering(false);
      return;
    }
    setIsFiltering(true);
    const timeout = window.setTimeout(() => setIsFiltering(false), 180);
    return () => window.clearTimeout(timeout);
  }, [fromDate, hasFilters, languageFilter, searchQuery, statusFilter, toDate]);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const applyFilterPreset = (preset: CollaborationFilterPreset) => {
    setSearchQuery(preset.query);
    setStatusFilter(preset.status);
    setLanguageFilter(preset.language);
    setFromDate(preset.fromDate);
    setToDate(preset.toDate);
  };

  const saveFilterPreset = () => {
    const name = filterPresetName.trim();
    if (!name) {
      toast.error("Введите название набора фильтров");
      return;
    }
    if (!hasFilters) {
      toast.error("Сначала выберите хотя бы один фильтр");
      return;
    }
    const preset: CollaborationFilterPreset = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name,
      query: searchQuery,
      status: statusFilter,
      language: languageFilter,
      fromDate,
      toDate,
    };
    setFilterPresets((current) => upsertFilterPreset(current, preset));
    setFilterPresetName("");
    toast.success("Набор фильтров сохранён");
  };

  const handleRemoveFilterPreset = (id: string) => {
    setFilterPresets((current) => removeFilterPreset(current, id));
    toast.success("Набор фильтров удалён");
  };

  const updateTranslation = (language: CollaborationLanguage, field: keyof CollaborationTranslation, value: string) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [language]: {
          ...current.translations[language],
          [field]: value,
        },
      },
    }));
  };

  const resetEditor = () => {
    setEditingId(null);
    setForm(createBlankForm());
    setPreviewLanguage("en");
  };

  const startEditing = (item: ManagedCollaboration) => {
    setEditingId(item.id);
    setForm(formFromCollaboration(item));
    setPreviewLanguage("en");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!form.mediaTitle.trim() || !form.mediaUrl.trim()) {
      toast.error("Добавьте название медиа и ссылку на Reel или Post");
      return;
    }

    const missingLanguage = collaborationLanguages.find((language) => !isTranslationComplete(form.translations[language]));
    if (missingLanguage) {
      toast.error(`Заполните все обязательные поля для языка: ${languageLabels[missingLanguage]}`);
      setPreviewLanguage(missingLanguage);
      return;
    }

    const payload = {
      translations: form.translations,
      mediaUrl: form.mediaUrl.trim(),
      mediaTitle: form.mediaTitle.trim(),
      publishedAt: form.publishedAt || null,
      isPublished: form.isPublished,
    };

    if (editingId === null) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate({ id: editingId, data: payload });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center text-sm text-muted-foreground"><div className="flex items-center gap-3" aria-live="polite"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#aa7942]" /> Проверяем доступ…</div></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center px-6">
        <Card className="max-w-md w-full border-[#e6ded3] shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Доступ ограничен</CardTitle>
            <CardDescription>Редактор коллабораций доступен только владельцу медиа-кита.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!user ? <Button onClick={() => { window.location.href = getLoginUrl(); }} className="w-full bg-[#aa7942] text-white hover:bg-[#8b6134]">Войти как владелец</Button> : null}
            <Button onClick={() => setLocation("/")} variant="outline" className="w-full">Вернуться на сайт</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f8f6f2] -m-4 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Button variant="ghost" className="px-0 text-muted-foreground hover:text-foreground" onClick={() => setLocation("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться на сайт
              </Button>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#aa7942]/10 text-[#aa7942]"><FolderKanban className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#aa7942]">Owner workspace</p>
                  <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Коллаборации</h1>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Добавляйте новые кампании один раз: заполните карточку, укажите дату публикации и подготовьте версии для пяти языков. Сайт автоматически покажет опубликованные записи в порядке от новых к старым.</p>
            </div>
            <Button onClick={resetEditor} className="bg-[#aa7942] text-white hover:bg-[#8b6134]">
              <Plus className="mr-2 h-4 w-4" /> Новая коллаборация
            </Button>
          </header>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <Card className="border-[#e6ded3] shadow-sm">
                <CardHeader className="border-b border-[#eee6dd] pb-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="font-serif text-2xl">{editingId === null ? "Новая коллаборация" : "Редактирование коллаборации"}</CardTitle>
                      <CardDescription className="mt-1">Заполните контент, чтобы карточка выглядела полноценно на сайте.</CardDescription>
                    </div>
                    {editingId !== null && <Badge variant="outline" className="w-fit border-[#aa7942]/30 text-[#8b6134]">ID {editingId}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-7 pt-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mediaTitle">Название Instagram-контента</Label>
                      <Input id="mediaTitle" value={form.mediaTitle} onChange={(event) => setForm({ ...form, mediaTitle: event.target.value })} placeholder="Например: Brand × Product Reel" />
                      <p className="text-xs text-muted-foreground">Используется как подпись и доступное название embed.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mediaUrl">Ссылка на Reel или Post</Label>
                      <Input id="mediaUrl" type="url" value={form.mediaUrl} onChange={(event) => setForm({ ...form, mediaUrl: event.target.value })} placeholder="https://www.instagram.com/reel/..." />
                      <p className="text-xs text-muted-foreground">Ссылка должна вести на Instagram Reel или Post.</p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="space-y-2">
                      <Label htmlFor="publishedAt">Дата публикации</Label>
                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="publishedAt" type="date" className="pl-10" value={form.publishedAt} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} />
                      </div>
                      <p className="text-xs text-muted-foreground">Более свежие даты автоматически поднимаются выше.</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e6ded3] bg-white px-4 py-3 md:min-w-44">
                      <div>
                        <Label htmlFor="isPublished" className="cursor-pointer">Показывать на сайте</Label>
                        <p className="text-xs text-muted-foreground">Можно сохранить как черновик</p>
                      </div>
                      <Switch id="isPublished" checked={form.isPublished} onCheckedChange={(checked) => setForm({ ...form, isPublished: checked })} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-serif text-xl font-semibold">Текст карточки</h3>
                      <p className="text-sm text-muted-foreground">Переключайтесь между языками. Обязательные поля отмечены в подсказках.</p>
                    </div>
                    <Tabs value={previewLanguage} onValueChange={(value) => setPreviewLanguage(value as CollaborationLanguage)} className="w-full">
                      <TabsList className="grid h-auto w-full grid-cols-5 bg-[#eee6dd] p-1">
                        {collaborationLanguages.map((language) => {
                          const complete = isTranslationComplete(form.translations[language]);
                          return <TabsTrigger key={language} value={language} className="gap-1.5 py-2 text-xs sm:text-sm"><span>{language.toUpperCase()}</span>{complete && <Check className="h-3.5 w-3.5 text-emerald-600" />}</TabsTrigger>;
                        })}
                      </TabsList>
                      {collaborationLanguages.map((language) => {
                        const translation = form.translations[language];
                        return (
                          <TabsContent key={language} value={language} className="mt-5 space-y-5">
                            <div className="rounded-xl bg-[#f8f6f2] px-4 py-3 text-sm text-muted-foreground">Версия: <span className="font-medium text-foreground">{languageLabels[language]}</span>. Заполнено полей: {Object.values(translation).filter((value) => typeof value === "string" && value.trim().length > 0).length}/7.</div>
                            <div className="grid gap-5 md:grid-cols-2">
                              <div className="space-y-2"><Label htmlFor={`${language}-name`}>Название бренда *</Label><Input id={`${language}-name`} value={translation.name} onChange={(event) => updateTranslation(language, "name", event.target.value)} placeholder="Название коллаборации" /></div>
                              <div className="space-y-2"><Label htmlFor={`${language}-category`}>Категория *</Label><Input id={`${language}-category`} value={translation.category} onChange={(event) => updateTranslation(language, "category", event.target.value)} placeholder="Например: Lifestyle integration" /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor={`${language}-description`}>Описание *</Label><Textarea id={`${language}-description`} value={translation.description} onChange={(event) => updateTranslation(language, "description", event.target.value)} placeholder="Что происходило в кампании и почему она подходит аудитории Isaac" rows={4} /></div>
                            <div className="grid gap-5 md:grid-cols-2">
                              <div className="space-y-2"><Label htmlFor={`${language}-campaign`}>Тип кампании *</Label><Input id={`${language}-campaign`} value={translation.campaign} onChange={(event) => updateTranslation(language, "campaign", event.target.value)} placeholder="Lifestyle Reel / product integration" /></div>
                              <div className="space-y-2"><Label htmlFor={`${language}-results`}>Результаты *</Label><Input id={`${language}-results`} value={translation.results} onChange={(event) => updateTranslation(language, "results", event.target.value)} placeholder="78.1K views • 2,175 interactions" /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor={`${language}-quote`}>Цитата или заметка *</Label><Textarea id={`${language}-quote`} value={translation.quote} onChange={(event) => updateTranslation(language, "quote", event.target.value)} placeholder="Короткая цитата клиента или заметка Isaac" rows={3} /></div>
                            <div className="space-y-2"><Label htmlFor={`${language}-quoteLabel`}>Подпись к цитате</Label><Input id={`${language}-quoteLabel`} value={translation.quoteLabel ?? ""} onChange={(event) => updateTranslation(language, "quoteLabel", event.target.value)} placeholder="Например: Creator note" /></div>
                          </TabsContent>
                        );
                      })}
                    </Tabs>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-[#eee6dd] pt-6 sm:flex-row sm:justify-end">
                    {editingId !== null && <Button type="button" variant="outline" onClick={resetEditor}>Отменить редактирование</Button>}
                    <Button type="button" onClick={handleSubmit} disabled={isSaving} className="bg-[#aa7942] text-white hover:bg-[#8b6134]">{isSaving ? "Сохраняем…" : <><Save className="mr-2 h-4 w-4" /> Сохранить коллаборацию</>}</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#e6ded3] shadow-sm">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Сохранённые коллаборации</CardTitle>
                  <CardDescription>Черновики и опубликованные записи. Список отсортирован по дате публикации.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-[#e6ded3] bg-[#f8f6f2] p-4 space-y-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Поиск по бренду, кампании, результатам или ссылке…" className="bg-white pl-9 pr-9" />
                      {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Очистить поиск"><X className="h-4 w-4" /></button>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      {[
                        { key: "all", label: "Все" },
                        { key: "published", label: "Опубликованные" },
                        { key: "draft", label: "Черновики" },
                      ].map((filter) => <Button key={filter.key} type="button" size="sm" variant={statusFilter === filter.key ? "default" : "outline"} onClick={() => setStatusFilter(filter.key as typeof statusFilter)}>{filter.label}</Button>)}
                      <select aria-label="Фильтр по языку" value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value as typeof languageFilter)} className="h-9 rounded-md border border-input bg-white px-3 text-sm text-foreground">
                        <option value="all">Все языки</option>
                        {collaborationLanguages.map((language) => <option key={language} value={language}>Заполнен {language.toUpperCase()}</option>)}
                      </select>
                      <Input aria-label="Дата от" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="h-9 w-auto bg-white" />
                      <Input aria-label="Дата до" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="h-9 w-auto bg-white" />
                      {hasFilters && <Button type="button" size="sm" variant="ghost" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setLanguageFilter("all"); setFromDate(""); setToDate(""); }}>Сбросить</Button>}
                    </div>
                    <p className="flex min-h-5 items-center gap-2 text-xs text-muted-foreground" aria-live="polite"><span className={`transition-opacity duration-200 ${isFiltering ? "opacity-60" : "opacity-100"}`}>Показано {filteredItems.length} из {sortedItems.length}</span>{isFiltering && <span className="inline-flex items-center gap-1 text-[#8b6134]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#aa7942]" /> Обновляем</span>}</p>
                    <div className="flex flex-col gap-3 border-t border-[#e6ded3] pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-wrap items-center gap-2" aria-label="Сохранённые наборы фильтров">
                        <span className="text-xs font-medium text-muted-foreground">Быстрые наборы:</span>
                        {filterPresets.length === 0 ? <span className="text-xs text-muted-foreground">Пока нет</span> : filterPresets.map((preset) => <span key={preset.id} className="inline-flex max-w-full items-center rounded-full border border-[#d9cbbd] bg-white pl-3 text-xs"><button type="button" onClick={() => applyFilterPreset(preset)} className="max-w-40 truncate rounded-sm py-1.5 pr-1 text-[#8b6134] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aa7942] focus-visible:ring-offset-1" title={`Применить: ${preset.name}`}>{preset.name}</button><button type="button" onClick={() => handleRemoveFilterPreset(preset.id)} className="rounded-sm px-2 py-1.5 text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#aa7942] focus-visible:ring-offset-1" aria-label={`Удалить набор ${preset.name}`}>×</button></span>)}
                      </div>
                      <div className="flex w-full gap-2 sm:w-auto"><Input value={filterPresetName} onChange={(event) => setFilterPresetName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && saveFilterPreset()} placeholder="Название набора" aria-label="Название нового набора фильтров" className="h-9 min-w-0 bg-white sm:w-40" /><Button type="button" size="sm" variant="outline" onClick={saveFilterPreset} disabled={!hasFilters || !filterPresetName.trim()}><Save className="mr-1.5 h-3.5 w-3.5" /> Сохранить</Button></div>
                    </div>
                  </div>
                  {collaborationsQuery.isLoading ? <div className="flex items-center justify-center gap-3 py-8 text-center text-sm text-muted-foreground" aria-live="polite"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#aa7942]" /> Загружаем записи…</div> : sortedItems.length === 0 ? <div className="rounded-xl border border-dashed border-[#d9cbbd] px-5 py-8 text-center text-sm text-muted-foreground">Пока нет управляемых коллабораций. Создайте первую запись выше.</div> : filteredItems.length === 0 ? <div className="rounded-xl border border-dashed border-[#d9cbbd] px-5 py-8 text-center text-sm text-muted-foreground">Ничего не найдено. Измените запрос или сбросьте фильтры.</div> : <div className={`space-y-3 transition-opacity duration-200 ${isFiltering ? "opacity-60" : "opacity-100"}`}>{filteredItems.map((item) => {
                    const title = item.translations.ru?.name || item.translations.en.name;
                    const statusPublished = item.isPublished === 1;
                    return <div key={item.id} className="flex flex-col gap-4 rounded-xl border border-[#e6ded3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-medium">{title}</h3><Badge variant={statusPublished ? "default" : "outline"} className={statusPublished ? "bg-emerald-700 hover:bg-emerald-700" : ""}>{statusPublished ? <><Eye className="mr-1 h-3 w-3" /> Published</> : <><EyeOff className="mr-1 h-3 w-3" /> Draft</>}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{item.publishedAt || "Без даты"} · {item.mediaTitle}</p></div><div className="flex shrink-0 gap-2"><Button variant="outline" size="sm" onClick={() => startEditing(item)}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Изменить</Button><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(item)}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Удалить</Button></div></div>;
                  })}</div>}
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="sticky top-6 overflow-hidden border-[#e6ded3] shadow-sm">
                <CardHeader className="bg-[#211d19] text-white"><div className="flex items-center justify-between"><div><CardTitle className="font-serif text-2xl">Предпросмотр</CardTitle><CardDescription className="text-white/65">Так карточка будет выглядеть на сайте</CardDescription></div><Instagram className="h-5 w-5 text-[#d4a574]" /></div></CardHeader>
                <CardContent className="space-y-5 p-5">
                  <div className="flex flex-wrap gap-1.5">{collaborationLanguages.map((language) => <Button key={language} size="sm" variant={previewLanguage === language ? "default" : "outline"} className={previewLanguage === language ? "bg-[#aa7942] hover:bg-[#8b6134]" : ""} onClick={() => setPreviewLanguage(language)}>{language.toUpperCase()}</Button>)}</div>
                  <div className="rounded-xl border border-[#e6ded3] bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#aa7942]">{activePreview.category || "Категория коллаборации"}</p>
                    <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight">{activePreview.name || "Название бренда"}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{activePreview.description || "Здесь появится описание кампании и её ценность для бренда."}</p>
                    <div className="mt-4 space-y-3 border-y border-[#eee6dd] py-4 text-sm"><div><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Тип кампании</p><p className="mt-1 font-medium">{activePreview.campaign || "Lifestyle Reel / product integration"}</p></div><div><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Результаты</p><p className="mt-1 font-medium">{activePreview.results || "Метрики кампании"}</p></div></div>
                    <blockquote className="mt-4 border-l-2 border-[#aa7942] pl-3 text-sm italic text-muted-foreground">{activePreview.quote ? `“${activePreview.quote}”` : "Цитата клиента или заметка Isaac"}</blockquote>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#f8f6f2] px-3 py-2 text-xs text-muted-foreground"><span>{form.isPublished ? "Будет опубликовано" : "Сохранится как черновик"}</span><span>{form.publishedAt || "Без даты"}</span></div>
                  {form.mediaUrl && <a href={form.mediaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-[#8b6134] hover:underline"><ExternalLink className="h-4 w-4" /> Открыть Instagram-ссылку</a>}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Удалить коллаборацию?</AlertDialogTitle><AlertDialogDescription>Запись будет удалена из редактора и с публичного сайта. Это действие нельзя отменить.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Отмена</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })}>Удалить</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

export default Collaborations;
