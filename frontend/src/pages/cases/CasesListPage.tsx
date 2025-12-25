import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Building2,
  RefreshCw,
} from "lucide-react";
import { useGetCases } from "@/hooks/useCases";
import { debounce, formatDate, getStatusColor, cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseStatus } from "@/types/api.types";
import ApiErrorFallback from "@/components/shared/ApiErrorFallback";
import { Skeleton } from "@/components/ui/skeleton";

export default function CasesListPage() {
  const { isAdmin, isJudge, isClerk } = useUserRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch cases with filters
  const { data, isLoading, error, refetch, isRefetching } = useGetCases({
    page,
    limit,
    search: searchQuery,
    filter: statusFilter !== "all" ? { status: statusFilter } : undefined,
  });

  // Safely extract cases array
  console.log('Cases Debug Data:', data);
  const cases = data?.data?.cases || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  // Debounced search handler
  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setPage(1); // Reset to first page on search
      }, 500),
    []
  );

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  // Error state with detailed fallback
  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Cases</h1>
            <p className="text-text-secondary mt-1">
              Browse and search all cases in the system
            </p>
          </div>
        </div>

        {/* Error Display */}
        <ApiErrorFallback
          error={error}
          resetError={handleRetry}
          showBackButton={false}
          customMessage="Unable to load cases. This might be because the cases API endpoint is not available yet or there's a connection issue."
        />
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Search & Filters Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-48" />
            </div>
          </CardContent>
        </Card>

        {/* Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Cases</h1>
          <p className="text-text-secondary mt-1">
            Browse and search all cases in the system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRefetching}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", isRefetching && "animate-spin")}
            />
            Refresh
          </Button>
          {(isAdmin || isJudge || isClerk) && (
            <Link to="/cases/create">
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Case
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                type="search"
                placeholder="Search by case number, title, or description..."
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={CaseStatus.FILED}>Filed</SelectItem>
                <SelectItem value={CaseStatus.ADMITTED}>Admitted</SelectItem>
                <SelectItem value={CaseStatus.HEARING}>Hearing</SelectItem>
                <SelectItem value={CaseStatus.JUDGMENT}>Judgment</SelectItem>
                <SelectItem value={CaseStatus.CLOSED}>Closed</SelectItem>
                <SelectItem value={CaseStatus.ARCHIVED}>Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      {cases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary mb-2">
              {searchQuery
                ? `No cases found matching "${searchQuery}"`
                : statusFilter !== "all"
                ? `No ${statusFilter.replace("_", " ")} cases found`
                : "No cases available yet"}
            </p>
            {(isAdmin || isJudge || isClerk) && !searchQuery && (
              <Link to="/cases/create">
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Case
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseItem) => (
              <Link key={caseItem._id} to={`/cases/${caseItem._id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    {/* Case Number & Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-text-secondary mb-1">
                          Case Number
                        </p>
                        <p className="font-mono font-semibold text-brand-primary">
                          {caseItem.caseNumber}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs",
                          getStatusColor(caseItem.status)
                        )}
                      >
                        {caseItem.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                      {caseItem.title}
                    </h3>

                    {/* Description */}
                    {caseItem.description && (
                      <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                        {caseItem.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="space-y-2 text-xs text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3" />
                        <span>
                          {typeof caseItem.court === "string"
                            ? caseItem.court
                            : caseItem.court?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Filed: {formatDate(caseItem.filingDate, "PP")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        <span>{caseItem.viewCount || 0} views</span>
                      </div>
                    </div>

                    {/* Public Badge */}
                    {caseItem.isPublic && (
                      <Badge variant="outline" className="mt-3 text-xs">
                        Public
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isRefetching}
              >
                Previous
              </Button>
              <span className="text-sm text-text-secondary">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isRefetching}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
