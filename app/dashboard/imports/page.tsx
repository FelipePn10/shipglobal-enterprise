"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ImportStatusCard from "@/components/dashboard/import-status-card";
import { Button } from "@/components/ui/button";
import { Package, Search, Calendar, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImportButton } from "../../../components/imports/import-button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

// Hook de debounce personalizado
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Tipos para os dados de importação
interface ImportItem {
  importId: string;
  userId?: number;
  companyId?: number;
  title: string;
  status: "pending" | "processing" | "customs" | "shipping" | "delivered" | "issue";
  origin: string;
  destination: string;
  eta?: string;
  progress: number;
  createdAt: string;
  lastUpdated: string;
}

// Mapeamento de cores por status
const statusColors: Record<ImportItem["status"], string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  customs: "bg-purple-500/20 text-purple-400",
  shipping: "bg-indigo-500/20 text-indigo-400",
  delivered: "bg-green-500/20 text-green-400",
  issue: "bg-red-500/20 text-red-400",
};

const mockImports: ImportItem[] = [];

export default function ImportsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [importData, setImportData] = useState<ImportItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const importStatusData = [];

  const debouncedSearch = useDebounce<string>(searchQuery, 300);

  // Função para buscar importações
  const fetchImports = useCallback(async () => {
    const headers = {
      ...(session?.user?.type === "company" 
        ? { "company-id": session.user.id }
        : { "user-id": session?.user?.id }
      )
    };
    setIsLoading(true);
    try {
      const response = await fetch("/api/imports");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch imports: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const formattedData: ImportItem[] = data.map((item: any) => ({
        importId: item.importId,
        title: item.title,
        status: item.status as ImportItem["status"],
        origin: item.origin,
        destination: item.destination,
        eta: item.eta,
        lastUpdated: new Date(item.lastUpdated).toLocaleString(),
        progress: item.progress,
        createdAt: item.createdAt || new Date().toISOString(),
      }));
      setImportData(formattedData);
    } catch (error) {
      console.error("Error fetching imports:", error);
      // Usar dados mockados como fallback até a API estar funcionando
      setImportData(mockImports);
      toast({
        title: "Error fetching imports",
        description: "Using mock data. Please check the API status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efeito para carregar os dados iniciais e configurar polling
  useEffect(() => {
    fetchImports();
    const pollingInterval = setInterval(fetchImports, 60000); // Atualiza a cada 1 minuto
    return () => clearInterval(pollingInterval);
  }, [fetchImports]);

  // Filtragem dos dados
  const filteredImports = useMemo(() => {
    return importData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.importId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.origin.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.destination.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      let matchesDate = true;
      const itemDate = new Date(item.createdAt);
      const now = new Date();
      if (dateFilter === "today") {
        matchesDate = itemDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = itemDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        matchesDate = itemDate >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [importData, debouncedSearch, statusFilter, dateFilter]);

  // Função para navegar para detalhes de uma importação
  const handleImportClick = useCallback(
    (id: string) => router.push(`/dashboard/imports/${id}`),
    [router]
  );

  // Função para criar uma nova importação
  const handleNewImport = useCallback(async () => {
    setIsCreating(true);
    try {
      if (!session?.user) {
        throw new Error("Acesso não autorizado");
      }
  
      const isCompany = session.user.type === "company";
      const headers = {
        "Content-Type": "application/json",
        ...(isCompany 
          ? { "company-id": session.user.id }
          : { "user-id": session.user.id }
        )
      };
  
      const response = await fetch("/api/imports", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: "Nova Importação",
          origin: "Local padrão",
          destination: "Destino padrão",
          status: "draft",
          progress: 0
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha na criação');
      }
  
      const newImport = await response.json();
      router.push(`/dashboard/imports/${newImport.importId}`);
      
    } catch (error) {
      console.error("Error creating import:", error);
      toast({
        title: "Erro na criação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  }, [router, session]);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
  }, []);

  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateFilter !== "all";

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Imports</h1>
            <p className="text-white/60 mt-1">Manage and track all your import shipments</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </Button>
            <ImportButton onImport={handleNewImport} isLoading={isCreating} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Search imports by ID, title, origin, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md pl-9 pr-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white/80 hover:bg-white/5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-white/10 text-white hover:bg-white/20">
                  {(statusFilter !== "all" ? 1 : 0) + (dateFilter !== "all" ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/60 text-sm block mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white/80">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="customs">In Customs</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="issue">Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-white/60 text-sm block mb-2">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white/80">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white/80 hover:bg-white/5"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="bg-white/5 rounded-lg p-5 border border-white/10 h-64" />
          ))}
        </div>
      ) : filteredImports.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-white/60">
              Showing <span className="text-white font-medium">{filteredImports.length}</span>{" "}
              {filteredImports.length === 1 ? "import" : "imports"}
              {hasActiveFilters && <span> with active filters</span>}
            </div>
            <Select defaultValue="createdAt">
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white/80">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                <SelectItem value="createdAt">Date (newest first)</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImports.map((item) => (
              <ImportStatusCard
                key={item.importId}
                importId={item.importId}
                title={item.title}
                status={item.status}
                className={statusColors[item.status]}
                origin={item.origin}
                destination={item.destination}
                eta={item.eta}
                lastUpdated={item.lastUpdated}
                progress={item.progress}
                onClick={() => handleImportClick(item.importId)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-20 w-20 text-white/20 mb-6" />
          <h3 className="text-2xl font-medium text-white mb-3">No imports found</h3>
          <p className="text-white/60 max-w-md mb-6">
            {hasActiveFilters
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You don't have any imports yet. Create your first import to get started."}
          </p>
          {hasActiveFilters ? (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-white/10 text-white/80 hover:bg-white/5"
            >
              Clear All Filters
            </Button>
          ) : (
            <ImportButton onImport={handleNewImport} isLoading={isCreating} />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}