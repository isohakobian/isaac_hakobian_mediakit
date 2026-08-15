import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { ArrowLeft, FolderKanban, Instagram, Users, ExternalLink, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { instagramAudience } from "@shared/instagramAudience";

const COLORS = ["#aa7942", "#d4a574", "#8b6f47", "#c9a961", "#6b5436"];

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string | number;
};

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-xl border border-[#e6ded3] bg-white/95 p-3 text-xs shadow-xl backdrop-blur-sm">
      {label !== undefined && <p className="mb-2 border-b border-[#eee6dd] pb-2 font-semibold text-[#211d19]">{String(label)}</p>}
      <div className="space-y-1.5">
        {payload.map((item, index) => (
          <div key={`${item.name ?? "value"}-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color ?? "#aa7942" }} />{item.name ?? "Значение"}</span>
            <strong className="font-semibold text-[#211d19]">{typeof item.value === "number" ? item.value.toLocaleString("ru-RU") : String(item.value ?? "—")}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Analytics() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [days, setDays] = useState<number>(30);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("30d");

  const isAdmin = user?.role === "admin";
  const [dateError, setDateError] = useState<string | null>(null);

  const queryInput = activeTab === "custom" && startDate && endDate
    ? { days: 30, startDate, endDate }
    : { days };

  const { data: dashboardData, isLoading, isFetching, isError, error, refetch } = trpc.analytics.dashboard.useQuery(
    queryInput,
    { enabled: !loading && isAdmin && !dateError },
  );

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Analytics доступен владельцу</h1>
          <p className="text-gray-600 mb-6">Войдите в аккаунт владельца, чтобы просматривать статистику сайта.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => { window.location.href = getLoginUrl(); }}>
              Войти как владелец
            </Button>
            <Button onClick={() => setLocation("/")} variant="outline">
              На главную
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && user && !isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Доступ ограничен</h1>
          <p className="text-gray-600 mb-6">Analytics доступен только владельцу медиа-кита.</p>
          <Button onClick={() => setLocation("/")} variant="default">
            На главную
          </Button>
        </div>
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Не удалось загрузить Analytics</h1>
          <p className="text-gray-600 mb-6">Проверьте соединение и попробуйте ещё раз. Данные сайта не потеряны.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => refetch()}>Повторить загрузку</Button>
            <Button onClick={() => setLocation("/")} variant="outline">На главную</Button>
          </div>
          {error?.message && <p className="mt-4 text-xs text-muted-foreground">{error.message}</p>}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Пока нет данных</h1>
          <p className="text-gray-600 mb-6">Analytics подключён, но в выбранном периоде ещё нет событий.</p>
          <Button onClick={() => setLocation("/")} variant="default">На главную</Button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const deviceData = Object.entries(dashboardData.deviceBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const languageData = Object.entries(dashboardData.languageBreakdown).map(([name, value]) => ({
    name: name.toUpperCase(),
    value,
  }));

  const clickData = Object.entries(dashboardData.clickTracking)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({
      name: name.replace(/-/g, " "),
      value,
    }));

  const totalClicks = dashboardData.clicks || 1;

  const referrerData = Object.entries(dashboardData.referrerBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 17) + "..." : name,
      value,
    }));

  const countryData = Object.entries(dashboardData.countryBreakdown ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const regionData = Object.entries(dashboardData.regionBreakdown ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const activityMap: Record<string, { date: string; events: number; pageViews: number; clicks: number; forms: number }> = {};
  dashboardData.events.forEach((event) => {
    const eventDate = new Date(event.createdAt);
    if (Number.isNaN(eventDate.getTime())) return;
    const date = eventDate.toISOString().slice(0, 10);
    activityMap[date] ??= { date, events: 0, pageViews: 0, clicks: 0, forms: 0 };
    activityMap[date].events += 1;
    if (event.eventType === "page_view") activityMap[date].pageViews += 1;
    if (event.eventType === "click") activityMap[date].clicks += 1;
    if (event.eventType === "form_submit") activityMap[date].forms += 1;
  });
  const activityData = Object.values(activityMap).sort((a, b) => a.date.localeCompare(b.date));
  const accessibleSummary = (items: Array<{ name: string; value: number }>) => items.map((item) => `${item.name}: ${item.value.toLocaleString("ru-RU")}`).join("; ");
  const activitySummary = activityData.map((item) => `${item.date}: Всего событий ${item.events}, просмотры ${item.pageViews}, клики ${item.clicks}, заявки ${item.forms}`).join("; ");

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="p-0"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-4xl font-bold" style={{ fontFamily: "Playfair Display, serif", color: "#aa7942" }}>
                Analytics Dashboard
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-gray-600">Website performance & visitor insights</p>
            {isFetching && (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[#8b6134]" aria-live="polite">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#aa7942]" /> Обновляем данные…
              </span>
            )}
          </div>
            </div>
          </div>

          {/* Days & Date Range Filter */}
          <div className="flex flex-wrap justify-end items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLocation("/collaborations")}>
              <FolderKanban className="mr-2 h-4 w-4" /> Коллаборации
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
              Сайт
            </Button>
            {[
              { label: "7 дней", days: 7, key: "7d" },
              { label: "30 дней", days: 30, key: "30d" },
              { label: "90 дней", days: 90, key: "90d" },
              { label: "Год", days: 365, key: "365d" },
            ].map((preset) => (
              <Button
                key={preset.key}
                variant={activeTab === preset.key ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveTab(preset.key);
                  setDays(preset.days);
                  setStartDate("");
                  setEndDate("");
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Date Range Picker Bar */}
        <Card className="p-4 mb-8 bg-card/50 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Произвольный период:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">С:</span>
              <input
                type="date"
                className="px-3 py-1.5 text-sm rounded-md border border-input bg-background text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">По:</span>
              <input
                type="date"
                className="px-3 py-1.5 text-sm rounded-md border border-input bg-background text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant={activeTab === "custom" ? "default" : "secondary"}
              disabled={!startDate || !endDate}
              onClick={() => {
                if (startDate && endDate) {
                  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
                    setDateError("Используйте формат даты ГГГГ-ММ-ДД");
                    return;
                  }
                  if (new Date(startDate) > new Date(endDate)) {
                    setDateError("Дата начала не может быть позже даты окончания");
                    return;
                  }
                  setDateError(null);
                  setActiveTab("custom");
                  refetch();
                }
              }}
            >
              Применить даты
            </Button>
          </div>
          {dateError && (
            <p className="w-full text-xs text-destructive font-medium mt-1">{dateError}</p>
          )}
          {activeTab === "custom" && startDate && endDate && !dateError && (
            <span className="text-xs text-amber-700 font-medium">
              Фильтр: {startDate} — {endDate}
            </span>
          )}
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Visits</p>
            <p className="text-3xl font-bold">{dashboardData.pageViews.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Unique Visitors</p>
            <p className="text-3xl font-bold">{dashboardData.uniqueSessions.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Events</p>
            <p className="text-3xl font-bold">{dashboardData.totalEvents.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Clicks</p>
            <p className="text-3xl font-bold">{dashboardData.clicks.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Form Submissions</p>
            <p className="text-3xl font-bold">{dashboardData.formSubmits.toLocaleString()}</p>
          </Card>
        </div>

        {/* Instagram Audience Snapshot */}
        <section className="mb-8" aria-labelledby="instagram-audience-title">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#aa7942]"><Instagram className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">Instagram audience</span></div>
              <h2 id="instagram-audience-title" className="mt-2 font-serif text-2xl font-semibold">Расширенная аудитория</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Подтверждённые данные из Instagram Professional Dashboard. Период: последние 30 дней.</p>
            </div>
            <span className="rounded-full border border-[#e6ded3] bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground">{instagramAudience.periodLabel}</span>
          </div>
          <div className={`grid gap-4 sm:grid-cols-3 transition-opacity duration-300 ${isFetching ? "opacity-60" : "opacity-100"}`}>
            <Card className="p-5"><p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Просмотры</p><p className="mt-2 text-3xl font-semibold">{instagramAudience.views.toLocaleString()}</p><p className="mt-1 text-xs text-muted-foreground">{instagramAudience.followerViewShare}% followers · {instagramAudience.nonFollowerViewShare}% non-followers</p></Card>
            <Card className="p-5"><p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Зрители</p><p className="mt-2 text-3xl font-semibold">{instagramAudience.viewers.toLocaleString()}</p><p className="mt-1 text-xs text-muted-foreground">Уникальная аудитория за период Instagram</p></Card>
            <Card className="p-5"><p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Followers</p><p className="mt-2 text-3xl font-semibold">{instagramAudience.totalFollowers.toLocaleString()}</p><p className="mt-1 text-xs text-muted-foreground">Всего подписчиков на момент проверки</p></Card>
          </div>
          <div className={`mt-4 grid gap-6 lg:grid-cols-2 transition-opacity duration-300 ${isFetching ? "opacity-60" : "opacity-100"}`}>
            <Card className="p-6">
              <div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">Контент по просмотрам</h3><p className="mt-1 text-xs text-muted-foreground">Доля каждого формата в Instagram Insights</p></div><Users className="h-4 w-4 text-[#aa7942]" /></div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={instagramAudience.contentByViews} layout="vertical" margin={{ top: 4, right: 12, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="name" width={64} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, "Доля"]} />
                  <Bar dataKey="value" fill="#aa7942" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="sr-only">Значения контента по просмотрам: {accessibleSummary(instagramAudience.contentByViews)}</p>
            </Card>
            <Card className="p-6">
              <div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold">Контент по взаимодействиям</h3><p className="mt-1 text-xs text-muted-foreground">Какие форматы дают больше действий</p></div><ExternalLink className="h-4 w-4 text-[#aa7942]" /></div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={instagramAudience.contentByInteractions} layout="vertical" margin={{ top: 4, right: 12, left: 10, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="name" width={64} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, "Доля"]} />
                  <Bar dataKey="value" fill="#2f7d62" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="sr-only">Значения контента по взаимодействиям: {accessibleSummary(instagramAudience.contentByInteractions)}</p>
            </Card>
          </div>
          <Card className="mt-4 border-[#e6ded3] bg-[#fbfaf8] p-5">
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#aa7942]" /><div><h3 className="text-base font-semibold">Что ещё доступно из Instagram</h3><p className="mt-1 text-sm text-muted-foreground">Возраст, пол, страны и города не были переданы в текущем Account Insights export, поэтому они отмечены честно и не подменены предположениями.</p><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{instagramAudience.unavailableDemographics.map((item) => <div key={item.label} className="rounded-lg border border-dashed border-[#d9cbbd] bg-white px-3 py-2"><p className="text-sm font-medium">{item.label}</p><p className="mt-1 text-xs text-muted-foreground">Недоступно</p></div>)}</div></div></div>
          </Card>
        </section>

        {/* Audience Activity & Demographics */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold">Активность аудитории</h3>
                <p className="mt-1 text-sm text-muted-foreground">События, просмотры, клики и заявки по дням</p>
              </div>
              <span className="rounded-full bg-[#aa7942]/10 px-3 py-1 text-xs font-medium text-[#8b6134]">Динамика</span>
            </div>
            {activityData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">Нет данных об активности за выбранный период.</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }} aria-label="Динамика событий, просмотров, кликов и заявок по дням">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="events" name="Всего событий" stroke="#333333" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="pageViews" name="Просмотры" stroke="#aa7942" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="clicks" name="Клики" stroke="#8b6f47" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="forms" name="Заявки" stroke="#2f7d62" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="sr-only">Точные значения активности по дням: {activitySummary || "Нет данных"}</p>
              </>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold">География аудитории</h3>
              <p className="mt-1 text-sm text-muted-foreground">Только регионы, реально переданные аналитикой</p>
            </div>
            {countryData.length === 0 && regionData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-border px-6 text-center text-sm text-muted-foreground">Данные о стране и регионе пока не собираются для выбранного периода.</div>
            ) : (
              <div className="space-y-6">
                {countryData.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Страны</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={countryData} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="name" type="category" width={70} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="value" name="Посетители" fill="#aa7942" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {regionData.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Регионы</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="name" type="category" width={70} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="value" name="Посетители" fill="#d4a574" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Demographic & Conversion Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Device Type */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Visitors by Device</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <p className="sr-only">Посетители по устройствам: {accessibleSummary(deviceData)}</p>
          </Card>

          {/* Language Distribution */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Visitors by Language</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={languageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" fill="#aa7942" />
              </BarChart>
            </ResponsiveContainer>
            <p className="sr-only">Посетители по языкам: {accessibleSummary(languageData)}</p>
          </Card>

          {/* Top Clicks */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Most Clicked Elements</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={clickData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={190} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" fill="#d4a574" />
              </BarChart>
            </ResponsiveContainer>
            <p className="sr-only">Самые кликабельные элементы: {accessibleSummary(clickData)}</p>
          </Card>

          {/* Traffic Source */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Traffic Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={referrerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" fill="#8b6f47" />
              </BarChart>
            </ResponsiveContainer>
            <p className="sr-only">Источники трафика: {accessibleSummary(referrerData)}</p>
          </Card>
        </div>

        {/* Click Details Table */}
        <Card className="p-6 mb-12">
          <h3 className="text-xl font-bold mb-6">Detailed Click Tracking</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Element</th>
                  <th className="text-right py-3 px-4 font-semibold">Clicks</th>
                  <th className="text-right py-3 px-4 font-semibold">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dashboardData.clickTracking)
                  .sort((a, b) => b[1] - a[1])
                  .map(([element, count]) => (
                    <tr key={element} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{element.replace(/-/g, " ")}</td>
                      <td className="text-right py-3 px-4 font-semibold">{count}</td>
                      <td className="text-right py-3 px-4">
                        {dashboardData.clicks === 0 ? "0.0" : ((count / totalClicks) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>
            {activeTab === "custom" && startDate && endDate
              ? `Статистика за период с ${startDate} по ${endDate}`
              : `Статистика за последние ${days} дней`}
            {" • Обновлено: "}
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
