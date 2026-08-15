import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { useLocation } from "wouter";

const COLORS = ["#aa7942", "#d4a574", "#8b6f47", "#c9a961", "#6b5436"];

export function Analytics() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [days, setDays] = useState<number>(30);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("30d");

  const isAdmin = user?.role === "admin";
  const queryInput = activeTab === "custom" && startDate && endDate
    ? { days: 30, startDate, endDate }
    : { days };

  const { data: dashboardData, isLoading, isError, error, refetch } = trpc.analytics.dashboard.useQuery(
    queryInput,
    { enabled: !loading && isAdmin },
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
              <p className="text-gray-600 mt-2">Website performance & visitor insights</p>
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
                  setActiveTab("custom");
                  refetch();
                }
              }}
            >
              Применить даты
            </Button>
          </div>
          {activeTab === "custom" && startDate && endDate && (
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

        {/* Charts Grid */}
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Language Distribution */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Visitors by Language</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={languageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#aa7942" />
              </BarChart>
            </ResponsiveContainer>
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
                <Tooltip />
                <Bar dataKey="value" fill="#d4a574" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Traffic Source */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">Traffic Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={referrerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b6f47" />
              </BarChart>
            </ResponsiveContainer>
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
