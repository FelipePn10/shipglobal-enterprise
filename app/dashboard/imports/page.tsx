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

// Types
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

interface APIImportResponse {
  importId: string;
  title: string;
  status: string;
  origin: string;
  destination: string;
  eta?: string | null;
  progress?: number;
  createdAt: string;
  lastUpdated?: string;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
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
  const [sortBy, setSortBy] = useState<string>('createdAt');
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
        headers['company-id'] = session.user.companyId.toString();
      } else {
        headers['user-id'] = session.user.id.toString();
      }

      const response = await fetch('/api/imports', {
        headers,
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: APIImportResponse[] = await response.json();
      const formattedData: ImportItem[] = data.map((item) => ({
        importId: item.importId,
        title: item.title,
        status: item.status as ImportItem['status'],
        origin: item.origin,
        destination: item.destination,
        eta: item.eta ?? null,
        lastUpdated: new Date(item.lastUpdated || item.createdAt).toLocaleString(),
        progress: Number(item.progress) || 0,
        createdAt: item.createdAt,
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

  const filteredAndSortedImports = useMemo(() => {
    const filtered = importData.filter((item) => {
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
        const weekAgo = new Date(now.getDate() - 7);
        matchesDate = itemDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        matchesDate = itemDate >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'progress') {
        return b.progress - a.progress;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [importData, debouncedSearch, statusFilter, dateFilter, sortBy]);

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
    setSortBy('createdAt');
  }, []);

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFilter !== 'all' || sortBy !== 'createdAt';

  if (status === 'loading' || isLoading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              aria-label="Current date"
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
              aria-label="Create new import"
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
                className="w-full rounded-md border border-white/10 bg-white/5 py-2 pl-9 pr-9 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                aria-label="Search imports"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  aria-label="Clear search"
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
              aria-label={showFilters ? 'Hide filters' : 'Show filters'}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-white/10 text-white hover:bg-white/20">
                  {(searchQuery ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-white/60" htmlFor="status-filter">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    id="status-filter"
                    className="w-full border-white/10 bg-white/5 text-white/80"
                    aria-label="Filter by status"
                  >
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-white/10 backdrop-blur-lg">
                    <SelectItem value="all" className="text-white/80 hover:text-white">
                      All Statuses
                    </SelectItem>
                    <SelectItem value="draft" className="text-white/80 hover:text-white">
                      Draft
                    </SelectItem>
                    <SelectItem value="pending" className="text-white/80 hover:text-white">
                      Pending
                    </SelectItem>
                    <SelectItem value="processing" className="text-white/80 hover:text-white">
                      Processing
                    </SelectItem>
                    <SelectItem value="customs" className="text-white/80 hover:text-white">
                      In Customs
                    </SelectItem>
                    <SelectItem value="shipping" className="text-white/80 hover:text-white">
                      Shipping
                    </SelectItem>
                    <SelectItem value="delivered" className="text-white/80 hover:text-white">
                      Delivered
                    </SelectItem>
                    <SelectItem value="issue" className="text-white/80 hover:text-white">
                      Issues
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/60" htmlFor="date-filter">
                  Date Range
                </label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger
                    id="date-filter"
                    className="w-full border-white/10 bg-white/5 text-white/80"
                    aria-label="Filter by date"
                  >
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-white/10 backdrop-blur-lg">
                    <SelectItem value="all" className="text-white/80 hover:text-white">
                      All Time
                    </SelectItem>
                    <SelectItem value="today" className="text-white/80 hover:text-white">
                      Today
                    </SelectItem>
                    <SelectItem value="week" className="text-white/80 hover:text-white">
                      Last 7 Days
                    </SelectItem>
                    <SelectItem value="month" className="text-white/80 hover:text-white">
                      Last 30 Days
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white/80 hover:bg-white/5"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  aria-label="Clear all filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {filteredAndSortedImports.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-white/60">
                Showing{' '}
                <span className="font-medium text-white">{filteredAndSortedImports.length}</span>{' '}
                {filteredAndSortedImports.length === 1 ? 'import' : 'imports'}
                {hasActiveFilters && <span> with active filters</span>}
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className="w-[180px] border-white/10 bg-white/5 text-white/80"
                  aria-label="Sort imports"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-white/10 backdrop-blur-lg">
                  <SelectItem value="createdAt" className="text-white/80 hover:text-white">
                    Date (newest first)
                  </SelectItem>
                  <SelectItem value="title" className="text-white/80 hover:text-white">
                    Title (A-Z)
                  </SelectItem>
                  <SelectItem value="progress" className="text-white/80 hover:text-white">
                    Progress
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedImports.map((item) => (
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
                aria-label="Clear all filters"
              >
                Clear All Filters
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
                onClick={() => router.push('/dashboard/imports/new')}
                aria-label="Create your first import"
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