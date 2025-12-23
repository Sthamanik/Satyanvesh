import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, Eye, Calendar, Building2 } from "lucide-react";
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

export default function CasesListPage() {
  const { isAdmin, isJudge, isClerk } = useUserRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch cases with filters
  const { data, isLoading } = useGetCases({
    page,
    limit,
    search: searchQuery,
    filter: statusFilter !== "all" ? { status: statusFilter } : undefined,
  });

  const cases = data?.data || [];

  const totalPages = data?.meta?.totalPages || 1;

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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-background-secondary rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 bg-background-secondary rounded animate-pulse"
            />
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
        {(isAdmin || isJudge || isClerk) && (
          <Link to="/cases/create">
            <Button className="bg-brand-primary hover:bg-brand-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Case
            </Button>
          </Link>
        )}
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
                <SelectItem value={CaseStatus.REGISTERED}>
                  Registered
                </SelectItem>
                <SelectItem value={CaseStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={CaseStatus.UNDER_HEARING}>
                  Under Hearing
                </SelectItem>
                <SelectItem value={CaseStatus.RESERVED}>Reserved</SelectItem>
                <SelectItem value={CaseStatus.DECIDED}>Decided</SelectItem>
                <SelectItem value={CaseStatus.DISPOSED}>Disposed</SelectItem>
                <SelectItem value={CaseStatus.DISMISSED}>Dismissed</SelectItem>
                <SelectItem value={CaseStatus.WITHDRAWN}>Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      {cases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">No cases found</p>
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
                        <span>{caseItem.totalViews || 0} views</span>
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
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-text-secondary">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
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
