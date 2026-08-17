import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { instagramAudience } from "@shared/instagramAudience";
import { createPortableBackupPackage } from "@shared/backup";
import { AlertTriangle, Archive, CheckCircle2, Download, FileJson, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { translations, socialLinks } from "./Home";

const HERO_IMAGE_URL = "/manus-storage/80DC245D-61F0-4786-B87F-DC079CB4BB2C_f4659d04.JPEG";

function formatExportDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function Backup() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isPreparing, setIsPreparing] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
  const summaryQuery = trpc.backup.summary.useQuery(undefined, { enabled: user?.role === "admin" });
  const coreQuery = trpc.backup.core.useQuery(undefined, { enabled: false });
  const trpcUtils = trpc.useUtils();
  const isOwnerWorkspace = user?.role === "admin";

  const downloadBackup = async () => {
    setIsPreparing(true);
    setExportProgress("Получаем основное содержимое…");
    try {
      const core = await coreQuery.refetch();
      if (!core.data) throw new Error("Основной snapshot пуст");

      const chunkSize = 5000;
      const analyticsEvents: unknown[] = [];
      let offset = 0;
      while (true) {
        const chunk = await trpcUtils.backup.analyticsChunk.fetch({ offset, limit: chunkSize });
        analyticsEvents.push(...chunk.events);
        offset += chunk.events.length;
        setExportProgress(`Analytics: ${analyticsEvents.length.toLocaleString("ru-RU")} событий`);
        if (chunk.events.length < chunkSize) break;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 220));
      const backupPackage = createPortableBackupPackage({
        exportedAt: core.data.exportedAt,
        database: { ...core.data.database, analytics: analyticsEvents },
        staticContent: {
          translations,
          socialLinks,
          siteConfig: {
            languages: ["en", "ru", "es", "ar", "fr"],
            defaultLanguage: "en",
            designSystem: "Quiet Luxury / Editorial Minimalism",
            analyticsEvents: ["page_view", "click", "form_submit", "section_time", "language_change"],
            adminFeatures: ["Analytics Dashboard", "Collaboration Editor", "filter presets", "portable backup export"],
          },
          visualAssets: {
            heroImageUrl: HERO_IMAGE_URL,
            sourceFiles: [
              "client/src/pages/Home.tsx",
              "client/src/pages/Analytics.tsx",
              "client/src/pages/Collaborations.tsx",
              "shared/instagramAudience.ts",
              "shared/collaborations.ts",
              "drizzle/schema.ts",
            ],
          },
          instagramAudience: JSON.parse(JSON.stringify(instagramAudience)) as Record<string, unknown>,
        },
      });

      const blob = new Blob([JSON.stringify(backupPackage, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date(backupPackage.exportedAt).toISOString().slice(0, 10);
      link.href = url;
      link.download = `isaac-hakobian-media-kit-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Backup-пакет скачан");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось подготовить backup-пакет");
    } finally {
      setIsPreparing(false);
      setExportProgress("");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center text-sm text-muted-foreground" aria-live="polite"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Проверяем доступ…</div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center px-6"><Card className="max-w-md w-full"><CardHeader><CardTitle>Войдите для доступа</CardTitle><CardDescription>Backup Center доступен только в owner workspace.</CardDescription></CardHeader><CardContent><Button className="w-full bg-[#aa7942] text-white hover:bg-[#8b6134]" onClick={() => { window.location.href = getLoginUrl(); }}>Войти как владелец</Button></CardContent></Card></div>;
  }

  if (!isOwnerWorkspace) {
    return <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center px-6"><Card className="max-w-md w-full"><CardHeader><CardTitle>Доступ ограничен</CardTitle><CardDescription>Экспорт резервной копии доступен только владельцу медиа-кита.</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full" onClick={() => setLocation("/")}>Вернуться на сайт</Button></CardContent></Card></div>;
  }

  const database = summaryQuery.data;
  const isReady = Boolean(database) && !summaryQuery.isLoading && !summaryQuery.isError && !isPreparing;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f8f6f2] -m-4 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#aa7942]">Owner workspace</p>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Backup Center</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Скачайте переносимый пакет с контентом и данными сайта, чтобы передать его другому AI или восстановить проект в другой среде.</p>
            </div>
            <Badge variant="outline" className="w-fit border-[#aa7942]/30 px-3 py-1.5 text-[#8b6134]"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Только владелец</Badge>
          </header>

          <Alert className="border-[#d9cbbd] bg-white"><AlertTriangle className="h-4 w-4 text-[#aa7942]" /><AlertTitle>Пакет не содержит секретные ключи</AlertTitle><AlertDescription>В backup входят данные и структура сайта, но не входят DATABASE_URL, JWT_SECRET, OAuth cookies, API tokens и credentials интеграций. Для активации в другой среде потребуются новые секреты.</AlertDescription></Alert>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="border-[#e6ded3] shadow-sm">
              <CardHeader><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#aa7942]/10 text-[#aa7942]"><Archive className="h-5 w-5" /></div><div><CardTitle className="font-serif text-2xl">Portable JSON backup</CardTitle><CardDescription className="mt-1">Один файл для передачи человеку или другому AI.</CardDescription></div></div></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Мультиязычный сайт", "Коллаборации и отзывы", "Analytics events", "Instagram snapshot"].map((label) => <div key={label} className="flex items-center gap-2 rounded-xl border border-[#eee6dd] bg-[#f8f6f2] px-3 py-2.5 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" /> {label}</div>)}
                </div>
                <div className="rounded-xl border border-[#e6ded3] bg-[#211d19] p-4 text-sm text-white/80"><div className="flex items-center gap-2 text-white"><FileJson className="h-4 w-4 text-[#d4a574]" /><span className="font-medium">Формат: `.json`</span></div><p className="mt-2 leading-6">Внутри есть schema version, manifest проекта, статический контент, database snapshot, порядок восстановления и готовый activation prompt для другого AI.</p></div>
                <Button type="button" size="lg" onClick={downloadBackup} disabled={!isReady || isPreparing} className="w-full bg-[#aa7942] text-white hover:bg-[#8b6134]">{isPreparing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Готовим backup…</> : <><Download className="mr-2 h-4 w-4" /> Скачать полный backup</>}</Button>
                <p className="min-h-5 text-center text-xs text-muted-foreground" aria-live="polite">{isPreparing ? exportProgress || "Собираем полный snapshot — это может занять время…" : summaryQuery.isLoading ? "Проверяем состав snapshot…" : summaryQuery.isError ? "Не удалось проверить snapshot. Обновите страницу и повторите." : summaryQuery.data ? `В базе сейчас ${summaryQuery.data.analytics} analytics events · готово к экспорту` : ""}</p>
              </CardContent>
            </Card>

            <Card className="border-[#e6ded3] shadow-sm"><CardHeader><CardTitle className="font-serif text-xl">Состав snapshot</CardTitle><CardDescription>Текущее состояние базы данных</CardDescription></CardHeader><CardContent className="space-y-3 text-sm">{[["Пользователи", database?.users], ["Отзывы", database?.testimonials], ["Коллаборации", database?.collaborations], ["Analytics events", database?.analytics]].map(([label, count]) => <div key={String(label)} className="flex items-center justify-between border-b border-[#eee6dd] pb-2 last:border-0 last:pb-0"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{typeof count === "number" ? count : "—"}</span></div>)}<p className="pt-2 text-xs leading-5 text-muted-foreground">Каждый export — отдельный snapshot. Скачивайте новый файл после важных изменений.</p></CardContent></Card>
          </div>

          <Card className="border-[#e6ded3] shadow-sm"><CardHeader><CardTitle className="font-serif text-2xl">Как перенести в другой AI</CardTitle><CardDescription>Передайте JSON-файл вместе с исходным репозиторием.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aa7942]">01 · Скачать</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Скачайте новый полный backup после последних изменений.</p></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aa7942]">02 · Передать</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Загрузите JSON в другой AI и приложите ссылку на GitHub-репозиторий.</p></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aa7942]">03 · Активировать</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Попросите AI восстановить static content и database, затем добавьте свежие секреты среды.</p></div></CardContent></Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Backup;
