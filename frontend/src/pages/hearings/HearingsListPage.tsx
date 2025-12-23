import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Plus,
  Filter,
  Clock,
  Building2,
  User,
  Gavel,
  RefreshCw,
} from "lucide-react";
import { useGetHearings } from "@/hooks/useHearings";
import { formatDate, cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HearingCreateDialog from "@/components/hearings/HearingCreateDialog";
import { HearingStatus } from "@/types/api.types";
import ApiErrorFallback from "@/components/shared/ApiErrorFallback";
import { Skeleton } from "@/components/ui/skeleton";

export default function HearingsListPage() {
  const { isAdmin, isJudge, isClerk } = useUserRole();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch hearings with filters
  const { data, isLoading, error, refetch, isRefetching } = useGetHearings({
    page,
    limit,
    filter: statusFilter !== "all" ? { status: statusFilter } : undefined,
  });

  const hearings = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      postponed: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Hearings</h1>
            <p className="text-text-secondary mt-1">
              View and manage all scheduled hearings
            </p>
          </div>
        </div>

        {/* Error Display */}
        <ApiErrorFallback
          error={error}
          resetError={handleRetry}
          showBackButton={false}
          customMessage="Unable to load hearings. This might be because the hearings API endpoint is not available yet."
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
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-10 w-48" />
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
          <h1 className="text-3xl font-bold text-text-primary">Hearings</h1>
          <p className="text-text-secondary mt-1">
            View and manage all scheduled hearings
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
          <Link to="/hearings/calendar">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar View
            </Button>
          </Link>
          {(isAdmin || isJudge || isClerk) && (
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-brand-primary hover:bg-brand-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Hearing
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={HearingStatus.SCHEDULED}>
                  Scheduled
                </SelectItem>
                <SelectItem value={HearingStatus.IN_PROGRESS}>
                  In Progress
                </SelectItem>
                <SelectItem value={HearingStatus.COMPLETED}>
                  Completed
                </SelectItem>
                <SelectItem value={HearingStatus.POSTPONED}>
                  Postponed
                </SelectItem>
                <SelectItem value={HearingStatus.CANCELLED}>
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Hearings Grid */}
      {hearings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary mb-2">
              {statusFilter === "all"
                ? "No hearings scheduled"
                : `No ${statusFilter.replace("_", " ")} hearings found`}
            </p>
            {(isAdmin || isJudge || isClerk) && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule First Hearing
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hearings.map((hearing) => (
              <Card
                key={hearing._id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="pt-6">
                  {/* Date & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-brand-primary mb-1">
                        <Calendar className="w-4 h-4" />
                        <p className="font-semibold">
                          {formatDate(hearing.hearingDate, "PPP")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Clock className="w-3 h-3" />
                        <p>{hearing.hearingTime}</p>
                      </div>
                    </div>
                    <Badge
                      className={cn("text-xs", getStatusColor(hearing.status))}
                    >
                      {hearing.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Case Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Gavel className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-text-secondary">Case</p>
                        <p className="font-medium text-text-primary truncate">
                          {typeof hearing.case === "string"
                            ? hearing.case
                            : hearing.case?.caseNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    {hearing.courtRoom && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-text-secondary" />
                        <div>
                          <p className="text-xs text-text-secondary">
                            Court Room
                          </p>
                          <p className="text-text-primary">
                            {hearing.courtRoom}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-text-secondary" />
                      <div>
                        <p className="text-xs text-text-secondary">Judge</p>
                        <p className="text-text-primary truncate">
                          {typeof hearing.judge === "string"
                            ? hearing.judge
                            : hearing.judge?.fullName || "N/A"}
                        </p>
                      </div>
                    </div>

                    {hearing.purpose && (
                      <div className="mt-3 pt-3 border-t border-background-secondary">
                        <p className="text-xs text-text-secondary mb-1">
                          Purpose
                        </p>
                        <p className="text-sm text-text-primary line-clamp-2">
                          {hearing.purpose}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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

      {/* Create Dialog */}
      <HearingCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
