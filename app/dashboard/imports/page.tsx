'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Package, Search, Calendar, Filter, X, Package2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import ImportStatusCard from '@/components/dashboard/import-status-card';

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Types for import data
interface ImportItem {
  importId: string;
  userId?: number;
  companyId?: number;
  title: string;
  status: 'pending' | 'processing' | 'customs' | 'shipping' | 'delivered' | 'issue' | 'draft';
  origin: string;
  destination: string;
  eta?: string | null;
  progress: number;
  createdAt: string;
  lastUpdated: string;
}

const statusColors: Record<ImportItem['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  customs: 'bg-purple-500/20 text-purple-400',
  shipping: 'bg-indigo-500/20 text-indigo-400',
  delivered: 'bg-green-500/20 text-green-400',
  issue: 'bg-red-500/20 text-red-400',
  draft: 'bg-gray-500/20 text-gray-400',
};

// Mock data for development
const mockImports: ImportItem[] = [
  {
    importId: '1',
    title: 'Sample Import 1',
    status: 'pending',
    origin: 'China',
    destination: 'Brazil',
    eta: '2025-04-20',
    progress: 30,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    importId: '2',
    title: 'Sample Import 2',
    status: 'delivered',
    origin: 'USA',
    destination: 'Brazil',
    eta: '2025-04-10',
    progress: 100,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

export default function ImportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [importData, setImportData] = useState<ImportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchImports = useCallback(async () => {
    if (status === 'loading' || !session?.user) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      setImportData(mockImports);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (session.user.type === 'company' && session.user.companyId) {
        headers['company-id'] = session.user.companyId;
      } else {
        headers['user-id'] = session.user.id;
      }

      const response = await fetch('/api/imports', {
        headers,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const formattedData: ImportItem[] = data.map((item: any) => ({
        importId: item.importId,
        title: item.title,
        status: item.status as ImportItem['status'],
        origin: item.origin,
        destination: item.destination,
        eta: item.eta ?? null,
        lastUpdated: new Date(item.lastUpdated || item.createdAt).toLocaleString(),
        progress: Number(item.progress) || 0,
        createdAt: item.createdAt || new Date().toISOString(),
      }));

      setImportData(formattedData);
    } catch (error) {
      console.error('Failed to fetch imports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load imports. Using mock data.',
        variant: 'destructive',
      });
      setImportData(mockImports);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    fetchImports();
    const interval = setInterval(fetchImports, 60000);
    return () => clearInterval(interval);
  }, [fetchImports, status, router]);

  const filteredImports = useMemo(() => {
    return importData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.importId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.origin.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.destination.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      let matchesDate = true;
      const itemDate = new Date(item.createdAt);
      const now = new Date();
      if (dateFilter === 'today') {
        matchesDate = itemDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = itemDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        matchesDate = itemDate >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [importData, debouncedSearch, statusFilter, dateFilter]);

  const handleImportClick = useCallback(
    (id: string) => {
      router.push(`/dashboard/imports/${id}`);
    },
    [router]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter('all');
  }, []);

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFilter !== 'all';

  if (status === 'loading' || isLoading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg border border-white/10 bg-white/5 p-5" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Imports</h1>
            <p className="mt-1 text-white/60">Manage and track all your import shipments</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:bg-white/5"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Button>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
              onClick={() => router.push('/dashboard/imports/new')}
            >
              <Package2 className="mr-2 h-4 w-4" />
              New Import
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search imports by ID, title, origin, or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
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
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-white/10 text-white hover:bg-white/20">
                  {(statusFilter !== 'all' ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-white/60">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full border-white/10 bg-white/5 text-white/80">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-white/10 backdrop-blur-lg">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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
                <label className="mb-2 block text-sm text-white/60">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full border-white/10 bg-white/5 text-white/80">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-white/10 backdrop-blur-lg">
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

        {filteredImports.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-white/60">
                Showing <span className="font-medium text-white">{filteredImports.length}</span>{' '}
                {filteredImports.length === 1 ? 'import' : 'imports'}
                {hasActiveFilters && <span> with active filters</span>}
              </div>
              <Select defaultValue="createdAt">
                <SelectTrigger className="w-[180px] border-white/10 bg-white/5 text-white/80">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-white/10 backdrop-blur-lg">
                  <SelectItem value="createdAt">Date (newest first)</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <Package className="mb-6 h-20 w-20 text-white/20" />
            <h3 className="mb-3 text-2xl font-medium text-white">No imports found</h3>
            <p className="mb-6 max-w-md text-white/60">
              {hasActiveFilters
                ? 'Try adjusting your search or filters to find what you’re looking for.'
                : 'You don’t have any imports yet. Create your first import to get started.'}
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
              <Button
                className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
                onClick={() => router.push('/dashboard/imports/new')}
              >
                <Package2 className="mr-2 h-4 w-4" />
                Create Your First Import
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}