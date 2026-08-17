import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, ExternalLink, Calendar, CheckCircle2, Clock, XCircle, Archive, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export function BrandRequests() {
  const utils = trpc.useUtils();
  const requestsQuery = trpc.brandRequests.list.useQuery();
  const updateStatus = trpc.brandRequests.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Статус заявки обновлен");
      utils.brandRequests.list.invalidate();
    },
    onError: (err) => {
      toast.error(`Ошибка: ${err.message}`);
    },
  });

  const [filterStatus, setFilterStatus] = useState<string>("all");

  const requests = requestsQuery.data ?? [];
  const filteredRequests = filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);

  const statusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-[#aa7942] text-white">Новая</Badge>;
      case "reviewing":
        return <Badge variant="outline" className="border-[#aa7942] text-[#aa7942]">На рассмотрении</Badge>;
      case "discussion":
        return <Badge className="bg-blue-600 text-white">Обсуждение</Badge>;
      case "confirmed":
        return <Badge className="bg-emerald-700 text-white">Подтверждено</Badge>;
      case "archived":
        return <Badge variant="secondary" className="text-muted-foreground">В архиве</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8 max-w-7xl">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-normal tracking-tight">Заявки от брендов</h1>
            <p className="mt-1 text-sm text-muted-foreground">Управление входящими запросами на сотрудничество с вашего медиа-кита.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы ({requests.length})</SelectItem>
                <SelectItem value="new">Новые</SelectItem>
                <SelectItem value="reviewing">На рассмотрении</SelectItem>
                <SelectItem value="discussion">В обсуждении</SelectItem>
                <SelectItem value="confirmed">Подтвержденные</SelectItem>
                <SelectItem value="archived">В архиве</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-[#e6ded3] shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Входящие брифы</CardTitle>
            <CardDescription>Заявки, оставленные потенциальными партнерами через интерактивный селектор и форму.</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsQuery.isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#aa7942]" /> Загружаем заявки…
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {filterStatus === "all" ? "Пока нет входящих заявок от брендов." : "Нет заявок с выбранным статусом."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Бренд / Контакт</TableHead>
                      <TableHead>Категория и цель</TableHead>
                      <TableHead>Формат и бюджет</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(req.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{req.brandName}</div>
                          <div className="text-xs text-muted-foreground">{req.contactName} · <a href={`mailto:${req.email}`} className="underline hover:text-[#aa7942]">{req.email}</a></div>
                          {req.telegram && <div className="text-xs text-muted-foreground">Telegram: {req.telegram}</div>}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold uppercase tracking-wider text-[#aa7942]">{req.category}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Цель: {req.goal}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-medium">{req.format}</div>
                          {req.budget && <div className="text-xs text-muted-foreground mt-0.5">Бюджет: {req.budget}</div>}
                        </TableCell>
                        <TableCell>
                          {statusBadge(req.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={req.status}
                            onValueChange={(val: any) => updateStatus.mutate({ id: req.id, status: val })}
                          >
                            <SelectTrigger className="h-8 w-[140px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Новая</SelectItem>
                              <SelectItem value="reviewing">На рассмотрении</SelectItem>
                              <SelectItem value="discussion">Обсуждение</SelectItem>
                              <SelectItem value="confirmed">Подтверждено</SelectItem>
                              <SelectItem value="archived">В архив</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default BrandRequests;
