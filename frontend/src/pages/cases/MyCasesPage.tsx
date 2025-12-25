import { useState, useMemo } from "react";
import {
  Search,
  Eye,
  Calendar,
  Building2,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { useGetMyCases } from "@/hooks/useCases";
import { debounce, formatDate, getStatusColor, cn } from "@/lib/utils";
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
import ApiErrorFallback from "@/components/shared/ApiErrorFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export default function MyCasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch cases assigned to the current user
  const { data, isLoading, error, refetch, isRefetching } = useGetMyCases({
    page,
    limit,
    search: searchQuery,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const cases = data?.data?.cases || [];
  const totalPages = data?.data?.pagination?.totalPages || 1;

  // Debounced search handler
  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setPage(1);
      }, 500),
    []
  );

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">My Cases</h1>
            <p className="text-text-secondary mt-1">
              Cases assigned to you or where you are a party
            </p>
          </div>
        </div>
        <ApiErrorFallback
          error={error}
          resetError={() => refetch()}
          showBackButton={false}
          customMessage="Unable to load your cases. Please try again."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Cases</h1>
          <p className="text-text-secondary mt-1">
            Manage and track cases assigned to you
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                placeholder="Search by title, number..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="filed">Filed</SelectItem>
                  <SelectItem value="admitted">Admitted</SelectItem>
                  <SelectItem value="hearing">In Hearing</SelectItem>
                  <SelectItem value="judgment">Judgment</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoading || isRefetching}
              >
                <RefreshCw
                  className={cn("w-4 h-4", isRefetching && "animate-spin")}
                />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : cases.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-text-primary">No cases found</h3>
          <p className="text-text-secondary mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "You don't have any cases assigned to you yet"}
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem: any) => (
              <Card
                key={caseItem._id}
                className="overflow-hidden hover:shadow-md transition-shadow group border-background-secondary"
              >
                <CardContent className="p-0">
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <Badge
                        className={cn(
                          "capitalize",
                          getStatusColor(caseItem.status)
                        )}
                      >
                        {caseItem.status}
                      </Badge>
                      <span className="text-xs font-mono text-text-secondary bg-background-secondary px-2 py-1 rounded">
                        {caseItem.caseNumber}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-2 min-h-[3rem]">
                        {caseItem.title}
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {caseItem.courtId?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>Filing Date: {formatDate(caseItem.filingDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-background-secondary/50 border-t border-background-secondary flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">
                        Priority
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium capitalize",
                          caseItem.priority === "high" ||
                            caseItem.priority === "urgent"
                            ? "text-status-error"
                            : "text-status-success"
                        )}
                      >
                        {caseItem.priority}
                      </span>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/cases/${caseItem._id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
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
