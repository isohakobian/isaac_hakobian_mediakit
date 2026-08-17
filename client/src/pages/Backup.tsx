import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { instagramAudience } from "@shared/instagramAudience";
import { createPortableBackupPackage, type PortableBackupPackage } from "@shared/backup";
import { createBackupImportPreview, getBackupRecordIds, parsePortableBackupPackage, type BackupImportPreview } from "@shared/backupImport";
import { AlertTriangle, Archive, CheckCircle2, Download, FileJson, History, Loader2, ShieldCheck, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { translations, socialLinks } from "./Home";

const HERO_IMAGE_URL = "/manus-storage/80DC245D-61F0-4786-B87F-DC079CB4BB2C_f4659d04.JPEG";

function formatExportDate(value: string | Date) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function operationTypeLabel(type: string) {
  return type === "export" ? "Экспорт" : type === "safety_backup" ? "Safety backup" : "Импорт";
}

function operationStatusLabel(status: string) {
  return status === "success" ? "Успешно" : status === "failed" ? "Ошибка" : "В процессе";
}

export function Backup() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isPreparing, setIsPreparing] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
  const [exportProgressPercent, setExportProgressPercent] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState("");
  const [importProgressPercent, setImportProgressPercent] = useState(0);
  const [importFileName, setImportFileName] = useState("");
  const [importPackage, setImportPackage] = useState<PortableBackupPackage | null>(null);
  const [importPreview, setImportPreview] = useState<BackupImportPreview | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const summaryQuery = trpc.backup.summary.useQuery(undefined, { enabled: user?.role === "admin" });
  const historyQuery = trpc.backup.history.useQuery(undefined, { enabled: user?.role === "admin" });
  const coreQuery = trpc.backup.core.useQuery(undefined, { enabled: false });
  const startOperation = trpc.backup.startOperation.useMutation();
  const updateOperation = trpc.backup.updateOperation.useMutation();
  const createSafetyBackup = trpc.backup.createSafetyBackup.useMutation();
  const validateImport = trpc.backup.validateImport.useMutation();
  const previewImport = trpc.backup.previewImport.useMutation();
  const restoreTestimonials = trpc.backup.restoreTestimonials.useMutation();
  const restoreCollaborations = trpc.backup.restoreCollaborations.useMutation();
  const restoreAnalyticsBatch = trpc.backup.restoreAnalyticsBatch.useMutation();
  const trpcUtils = trpc.useUtils();
  const isOwnerWorkspace = user?.role === "admin";

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImportFileName(file.name);
    setImportPackage(null);
    setImportPreview(null);
    setImportProgress("Проверяем JSON backup…");
    try {
      if (!file.name.toLowerCase().endsWith(".json") && file.type !== "application/json") {
        throw new Error("Выберите JSON-файл backup");
      }
      if (file.size > 250 * 1024 * 1024) {
        throw new Error("Файл backup слишком большой для браузерного импорта (лимит 250 MB)");
      }
      const parsed = parsePortableBackupPackage(JSON.parse(await file.text()));
      const preview = createBackupImportPreview(parsed);
      await validateImport.mutateAsync({
        packageType: parsed.packageType,
        schemaVersion: parsed.schemaVersion,
        exportedAt: parsed.exportedAt,
        projectTitle: parsed.project.title,
        counts: {
          users: parsed.database.users.length,
          testimonials: parsed.database.testimonials.length,
          collaborations: parsed.database.collaborations.length,
          analytics: parsed.database.analytics.length,
        },
        staticLanguages: parsed.staticContent.siteConfig.languages.length,
      });
      setImportProgress("Сравниваем записи с текущей базой…");
      const diff = await previewImport.mutateAsync({
        testimonialsIds: getBackupRecordIds(parsed.database.testimonials),
        collaborationsIds: getBackupRecordIds(parsed.database.collaborations),
        analyticsIds: getBackupRecordIds(parsed.database.analytics),
      });
      setImportPackage(parsed);
      setImportPreview({ ...preview, diff });
      setImportProgress("");
      toast.success("Backup проверен — можно начать восстановление");
    } catch (error) {
      setImportProgress("");
      toast.error(error instanceof Error ? error.message : "Не удалось проверить backup-файл");
    }
  };

  const restoreImportedBackup = async () => {
    if (!importPackage || !importPreview) return;
    setIsImporting(true);
    setImportProgressPercent(1);
    setImportProgress("Подготавливаем журнал импорта…");
    let operationId: number | undefined;
    try {
      const totalRecords = importPackage.database.testimonials.length + importPackage.database.collaborations.length + importPackage.database.analytics.length;
      operationId = (await startOperation.mutateAsync({
        operationType: "import",
        fileName: importFileName,
        stage: "Ожидаем safety backup",
        totalRecords,
        recordSummary: JSON.stringify(importPreview.diff ?? {}),
      })).id;
      setImportProgressPercent(4);
      setImportProgress("Создаём автоматическую safety backup текущих данных…");
      const safetyBackup = await createSafetyBackup.mutateAsync();
      setImportProgressPercent(10);
      setImportProgress(`Safety backup сохранён: ${safetyBackup.fileName}`);
      await updateOperation.mutateAsync({ id: operationId, stage: "Safety backup сохранён · восстанавливаем данные", progress: 10, processedRecords: 0, totalRecords });

      let processedRecords = 0;
      let testimonialsRestored = 0;
      let collaborationsRestored = 0;
      let analyticsRestored = 0;
      const updateProgress = async (stage: string) => {
        const progress = totalRecords === 0 ? 100 : Math.min(99, 10 + Math.round((processedRecords / totalRecords) * 89));
        setImportProgressPercent(progress);
        setImportProgress(`${stage} · ${processedRecords.toLocaleString("ru-RU")} из ${totalRecords.toLocaleString("ru-RU")}`);
        await updateOperation.mutateAsync({ id: operationId!, stage, progress, processedRecords, totalRecords });
      };

      for (let offset = 0; offset < importPackage.database.testimonials.length; offset += 1000) {
        const result = await restoreTestimonials.mutateAsync({ rows: importPackage.database.testimonials.slice(offset, offset + 1000) as Record<string, unknown>[] });
        testimonialsRestored += result.restored;
        processedRecords += result.restored;
        await updateProgress("Восстанавливаем отзывы");
      }
      for (let offset = 0; offset < importPackage.database.collaborations.length; offset += 1000) {
        const result = await restoreCollaborations.mutateAsync({ rows: importPackage.database.collaborations.slice(offset, offset + 1000) as Record<string, unknown>[] });
        collaborationsRestored += result.restored;
        processedRecords += result.restored;
        await updateProgress("Восстанавливаем коллаборации");
      }
      for (let offset = 0; offset < importPackage.database.analytics.length; offset += 1000) {
        const result = await restoreAnalyticsBatch.mutateAsync({ rows: importPackage.database.analytics.slice(offset, offset + 1000) as Record<string, unknown>[] });
        analyticsRestored += result.restored;
        processedRecords += result.restored;
        await updateProgress("Восстанавливаем analytics");
      }
      await updateOperation.mutateAsync({ id: operationId, status: "success", stage: "Импорт завершён", progress: 100, processedRecords, totalRecords, completedAt: new Date().toISOString(), recordSummary: JSON.stringify({ testimonialsRestored, collaborationsRestored, analyticsRestored, safetyBackup: safetyBackup.fileName }) });
      await Promise.all([summaryQuery.refetch(), historyQuery.refetch()]);
      toast.success(`Восстановлено: ${testimonialsRestored} отзывов, ${collaborationsRestored} коллабораций, ${analyticsRestored} analytics событий`);
    } catch (error) {
      if (operationId) {
        await updateOperation.mutateAsync({ id: operationId, status: "failed", stage: "Импорт остановлен", errorMessage: error instanceof Error ? error.message : "Unknown import error", completedAt: new Date().toISOString() }).catch(() => undefined);
        await historyQuery.refetch();
      }
      setImportProgress("Импорт остановлен — текущие данные не удалены");
      toast.error(error instanceof Error ? error.message : "Импорт остановлен до завершения");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadBackup = async () => {
    setIsPreparing(true);
    setExportProgressPercent(2);
    setExportProgress("Получаем основное содержимое…");
    let operationId: number | undefined;
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `isaac-hakobian-media-kit-backup-${date}.json`;
    try {
      operationId = (await startOperation.mutateAsync({ operationType: "export", fileName, stage: "Получаем основное содержимое", totalRecords: summaryQuery.data?.analytics ?? 0 })).id;
      const core = await coreQuery.refetch();
      if (!core.data) throw new Error("Основной snapshot пуст");

      const chunkSize = 5000;
      const analyticsEvents: unknown[] = [];
      let offset = 0;
      while (true) {
        const chunk = await trpcUtils.backup.analyticsChunk.fetch({ offset, limit: chunkSize });
        analyticsEvents.push(...chunk.events);
        offset += chunk.events.length;
        const total = summaryQuery.data?.analytics ?? analyticsEvents.length;
        const percent = total === 0 ? 80 : Math.min(94, 10 + Math.round((analyticsEvents.length / total) * 80));
        setExportProgressPercent(percent);
        setExportProgress(`Analytics: ${analyticsEvents.length.toLocaleString("ru-RU")} из ${total.toLocaleString("ru-RU")} событий`);
        await updateOperation.mutateAsync({ id: operationId, stage: "Собираем analytics", progress: percent, processedRecords: analyticsEvents.length, totalRecords: total });
        if (chunk.events.length < chunkSize) break;
      }

      setExportProgressPercent(96);
      setExportProgress("Формируем переносимый JSON…");
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
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      if (operationId) await updateOperation.mutateAsync({ id: operationId, status: "success", stage: "Экспорт завершён", progress: 100, processedRecords: analyticsEvents.length, totalRecords: summaryQuery.data?.analytics ?? analyticsEvents.length, completedAt: new Date().toISOString() });
      await historyQuery.refetch();
      setExportProgressPercent(100);
      toast.success("Backup-пакет скачан и добавлен в историю операций");
    } catch (error) {
      if (operationId) {
        await updateOperation.mutateAsync({ id: operationId, status: "failed", stage: "Экспорт остановлен", errorMessage: error instanceof Error ? error.message : "Unknown export error", completedAt: new Date().toISOString() }).catch(() => undefined);
        await historyQuery.refetch();
      }
      toast.error(error instanceof Error ? error.message : "Не удалось подготовить backup-пакет");
    } finally {
      setIsPreparing(false);
      setExportProgress("");
      window.setTimeout(() => setExportProgressPercent(0), 350);
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
                {isPreparing && <div className="space-y-2 rounded-xl border border-[#e6ded3] bg-[#f8f6f2] p-3" aria-live="polite"><div className="flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin text-[#aa7942]" /> Экспорт выполняется</span><span className="font-medium text-[#8b6134]">{exportProgressPercent}%</span></div><Progress value={exportProgressPercent} aria-label={`Прогресс экспорта ${exportProgressPercent}%`} className="h-2" /></div>}
                <div className="border-t border-[#eee6dd] pt-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#aa7942]/10 text-[#aa7942]"><Upload className="h-5 w-5" /></div>
                    <div><h2 className="font-serif text-xl">Восстановить из JSON</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Загрузите ранее скачанный backup. Импорт объединяет записи по id и ничего не удаляет.</p></div>
                  </div>
                  <label className={`relative mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#aa7942]/40 px-4 py-2 text-sm font-medium transition-colors ${isImporting || validateImport.isPending || previewImport.isPending ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-[#aa7942]/10"}`}>
                    <Upload className="h-4 w-4" />
                    <span>{validateImport.isPending ? "Проверяем файл…" : previewImport.isPending ? "Сравниваем с текущей базой…" : "Выбрать JSON backup"}</span>
                    <input ref={importInputRef} type="file" accept=".json,application/json" className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" disabled={isImporting || validateImport.isPending || previewImport.isPending} onChange={handleImportFile} aria-label="Выбрать JSON backup" />
                  </label>
                  <p className="mt-2 min-h-5 text-center text-xs text-muted-foreground" aria-live="polite">{importFileName ? `${importFileName}${importProgress ? ` · ${importProgress}` : ""}` : "Секреты среды не импортируются и не перезаписываются."}</p>
                  {isImporting && <div className="mt-3 space-y-2 rounded-xl border border-[#e6ded3] bg-[#f8f6f2] p-3" aria-live="polite"><div className="flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin text-[#aa7942]" /> {importProgress || "Импорт выполняется"}</span><span className="font-medium text-[#8b6134]">{importProgressPercent}%</span></div><Progress value={importProgressPercent} aria-label={`Прогресс импорта ${importProgressPercent}%`} className="h-2" /><p className="text-[11px] text-muted-foreground">Сначала создаётся автоматическая safety backup текущей базы, затем данные восстанавливаются порциями.</p></div>}
                  {importPreview && <div className="mt-4 rounded-xl border border-[#d9cbbd] bg-[#f8f6f2] p-4 text-sm">
                    <p className="font-medium">Файл проверен: {importPreview.projectTitle}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">Версия {importPreview.schemaVersion} · экспорт {formatExportDate(importPreview.exportedAt)} · режим merge-by-id</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4"><span>Отзывы: <strong>{importPreview.testimonials}</strong></span><span>Коллаборации: <strong>{importPreview.collaborations}</strong></span><span>Analytics: <strong>{importPreview.analytics}</strong></span><span>Языки: <strong>{importPreview.staticLanguages}</strong></span></div>
                    {importPreview.diff && <div className="mt-3 rounded-lg border border-[#e6ded3] bg-white p-3 text-xs"><p className="font-medium">Что изменится после подтверждения</p><div className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-3"><span>Отзывы: +{importPreview.diff.testimonials.insert} / обновить {importPreview.diff.testimonials.update}</span><span>Коллаборации: +{importPreview.diff.collaborations.insert} / обновить {importPreview.diff.collaborations.update}</span><span>Analytics: +{importPreview.diff.analytics.insert} / пропустить {importPreview.diff.analytics.update}</span></div></div>}
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">Пользователи не переносятся, потому что openId намеренно удалён из backup. Текущий владелец и секреты среды сохраняются. Перед началом восстановления автоматически создаётся отдельная safety backup текущих данных.</p>
                    <Button type="button" size="lg" className="mt-4 w-full bg-[#211d19] text-white hover:bg-black" disabled={isImporting} onClick={restoreImportedBackup}>{isImporting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Восстанавливаем…</> : <><Upload className="mr-2 h-4 w-4" /> Подтвердить восстановление</>}</Button>
                  </div>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#e6ded3] shadow-sm"><CardHeader><CardTitle className="font-serif text-xl">Состав snapshot</CardTitle><CardDescription>Текущее состояние базы данных</CardDescription></CardHeader><CardContent className="space-y-3 text-sm">{[["Пользователи", database?.users], ["Отзывы", database?.testimonials], ["Коллаборации", database?.collaborations], ["Analytics events", database?.analytics]].map(([label, count]) => <div key={String(label)} className="flex items-center justify-between border-b border-[#eee6dd] pb-2 last:border-0 last:pb-0"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{typeof count === "number" ? count : "—"}</span></div>)}<p className="pt-2 text-xs leading-5 text-muted-foreground">Каждый export — отдельный snapshot. Скачивайте новый файл после важных изменений.</p></CardContent></Card>
          </div>

          <Card className="border-[#e6ded3] shadow-sm">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#aa7942]/10 text-[#aa7942]">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="font-serif text-2xl">История backup операций</CardTitle>
                  <CardDescription className="mt-1">Экспорты, импорты и автоматические safety backup с датой и текущим статусом.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {historyQuery.isLoading ? (
                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Загружаем историю…
                </div>
              ) : historyQuery.data?.length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Операция</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Прогресс</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyQuery.data.map((operation) => (
                        <TableRow key={operation.id}>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                            {formatExportDate(operation.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{operationTypeLabel(operation.operationType)}</div>
                            <div className="max-w-[260px] truncate text-xs text-muted-foreground">
                              {operation.fileName || operation.stage || "—"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                operation.status === "success"
                                  ? "border-emerald-700/30 text-emerald-800"
                                  : operation.status === "failed"
                                    ? "border-red-700/30 text-red-800"
                                    : "border-[#aa7942]/30 text-[#8b6134]"
                              }
                            >
                              {operationStatusLabel(operation.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-right text-xs text-muted-foreground">
                            {operation.processedRecords.toLocaleString("ru-RU")} / {operation.totalRecords.toLocaleString("ru-RU")} · {operation.progress}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="py-6 text-sm text-muted-foreground">История пока пуста. Она появится после первого экспорта или импорта.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#e6ded3] shadow-sm"><CardHeader><CardTitle className="font-serif text-2xl">Как перенести в другой AI</CardTitle><CardDescription>Передайте JSON-файл вместе с исходным репозиторием.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aa7942]">01 · Скачать</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Скачайте новый полный backup после последних изменений.</p></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aa7942]">02 · Передать</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Загрузите JSON в другой AI и приложите ссылку на GitHub-репозиторий.</p></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#aa7942]">03 · Активировать</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Попросите AI восстановить static content и database, затем добавьте свежие секреты среды.</p></div></CardContent></Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Backup;
