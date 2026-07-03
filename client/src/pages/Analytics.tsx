import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

const COLORS = ["#aa7942", "#d4a574", "#8b6f47", "#c9a961", "#6b5436"];

export function Analytics() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [days, setDays] = useState(30);
  const { data: dashboardData, isLoading, refetch } = trpc.analytics.dashboard.useQuery({ days });

  // Redirect if not owner
  if (!loading && (!user || user.openId !== process.env.VITE_APP_ID)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to view analytics.</p>
          <Button onClick={() => setLocation("/")} variant="default">
            Back to Home
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

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Data</h1>
          <p className="text-gray-600 mb-6">No analytics data available yet.</p>
          <Button onClick={() => setLocation("/")} variant="default">
            Back to Home
          </Button>
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

          {/* Days Filter */}
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <Button
                key={d}
                variant={days === d ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setDays(d);
                  refetch();
                }}
              >
                {d}d
              </Button>
            ))}
          </div>
        </div>

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
                        {((count / dashboardData.clicks) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Data from the last {days} days • Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
