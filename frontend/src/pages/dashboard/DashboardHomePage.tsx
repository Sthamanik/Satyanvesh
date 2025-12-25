import { Briefcase, Calendar, FileText, Gavel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { casesApi } from "@/api/cases.api";
import { hearingsApi } from "@/api/hearings.api";
import { documentsApi } from "@/api/documents.api";
import { formatRelativeTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Case, Hearing } from "@/types/api.types";
import { HearingStatus } from "@/types/api.types";
import { Skeleton } from "@/components/ui/skeleton";
import ApiErrorFallback from "@/components/shared/ApiErrorFallback";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type CaseStatus =
  | "filed"
  | "admitted"
  | "hearing"
  | "judgment"
  | "closed"
  | "archived";

interface DashboardStats {
  totalCases: number;
  activeHearings: number;
  pendingCases: number;
  documents: number;
  recentCases: Case[];
  upcomingHearings: Hearing[];
  statusBreakdown: Partial<Record<CaseStatus, number>>;
}

/* ------------------------------------------------------------------ */
/* Stats Card */
/* ------------------------------------------------------------------ */

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
}

function StatsCard({ title, value, icon: Icon, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-text-secondary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* API Fetcher */
/* ------------------------------------------------------------------ */

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const [casesRes, upcomingHearingsRes, todaysHearingsRes] = await Promise.all([
    casesApi.getAllCases({ limit: 1000 }),
    hearingsApi.getUpcomingHearings({ limit: 100 }),
    hearingsApi.getTodaysHearings(),
  ]);

  // API responses have structure: { statusCode, data, message, success }
  // Cases return paginated data: { cases: [...], pagination: {...} }
  // Hearings return arrays directly
  const casesData = casesRes.data as { cases?: unknown[]; pagination?: unknown } | unknown[];
  const cases = Array.isArray(casesData)
    ? casesData
    : (Array.isArray((casesData as { cases?: unknown[] })?.cases)
        ? (casesData as { cases: unknown[] }).cases
        : []);
  const upcomingHearings = Array.isArray(upcomingHearingsRes.data)
    ? upcomingHearingsRes.data
    : [];
  const todaysHearings = Array.isArray(todaysHearingsRes.data)
    ? todaysHearingsRes.data
    : [];
  const allHearings = [...upcomingHearings, ...todaysHearings];

  const totalCases = cases.length;

  const activeHearings = allHearings.filter(
    (h) =>
      h.status === HearingStatus.SCHEDULED || h.status === HearingStatus.ONGOING
  ).length;

  const pendingCases = cases.filter(
    (c) => c.status === "filed" || c.status === "admitted"
  ).length;

  const recentCases = [...cases]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  const sortedUpcomingHearings = upcomingHearings
    .filter((h) => h.status === HearingStatus.SCHEDULED)
    .sort(
      (a, b) =>
        new Date(a.hearingDate).getTime() - new Date(b.hearingDate).getTime()
    )
    .slice(0, 3);

  const statusBreakdown = cases.reduce<Partial<Record<CaseStatus, number>>>(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    },
    {}
  );

  // Get total documents count (approximate from cases)
  const documents = 0; // Will be calculated if we have document statistics

  return {
    totalCases,
    activeHearings,
    pendingCases,
    documents,
    recentCases,
    upcomingHearings: sortedUpcomingHearings,
    statusBreakdown,
  };
};

/* ------------------------------------------------------------------ */
/* Page */
/* ------------------------------------------------------------------ */

export default function DashboardHomePage() {
  const user = useUser();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-text-secondary mt-1">
            Here's what's happening with your cases today.
          </p>
        </div>
        <ApiErrorFallback
          error={error}
          resetError={() => window.location.reload()}
          showBackButton={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-text-secondary mt-1">
          Here's what's happening with your cases today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Cases"
          value={stats?.totalCases ?? 0}
          icon={Briefcase}
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Hearings"
          value={stats?.activeHearings ?? 0}
          icon={Calendar}
          isLoading={isLoading}
        />
        <StatsCard
          title="Pending Cases"
          value={stats?.pendingCases ?? 0}
          icon={Gavel}
          isLoading={isLoading}
        />
        <StatsCard
          title="Documents"
          value={stats?.documents ?? 0}
          icon={FileText}
          isLoading={isLoading}
        />
      </div>

      {/* Activity + Hearings */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded" />
                ))}
              </div>
            ) : stats?.recentCases.length ? (
              <div className="space-y-4">
                {stats.recentCases.map((caseItem) => (
                  <Link
                    key={caseItem._id}
                    to={`/cases/${caseItem._id}`}
                    className="flex items-start gap-3 p-2 rounded hover:bg-background-secondary transition"
                  >
                    <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {caseItem.title}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {caseItem.caseNumber} ·{" "}
                        {formatRelativeTime(caseItem.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary text-center py-6">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Hearings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Hearings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded" />
                ))}
              </div>
            ) : stats?.upcomingHearings.length ? (
              <div className="space-y-4">
                {stats.upcomingHearings.map((h) => {
                  const caseData =
                    typeof h.case === "object" && h.case
                      ? h.case
                      : { caseNumber: "N/A" };

                  return (
                    <Link
                      key={h._id}
                      to={`/cases/${h.caseId}`}
                      className="flex justify-between p-3 bg-background-secondary rounded hover:bg-background-secondary/80 transition"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {caseData.caseNumber || "N/A"}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {h.courtRoom || "Court Room TBA"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-brand-primary font-medium">
                          {new Date(h.hearingDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {h.hearingTime}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-secondary text-center py-6">
                No upcoming hearings
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Case Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            {(
              [
                "filed",
                "admitted",
                "hearing",
                "judgment",
                "closed",
                "archived",
              ] as CaseStatus[]
            ).map((status) => (
              <div
                key={status}
                className="text-center p-4 bg-background-secondary rounded"
              >
                <p className="text-2xl font-bold">
                  {stats?.statusBreakdown?.[status] ?? 0}
                </p>
                <p className="text-xs capitalize mt-1 text-text-secondary">
                  {status.replace("_", " ")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
