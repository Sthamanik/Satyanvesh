import { Briefcase, Calendar, FileText, Gavel } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { useUser } from "@/routes/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { casesApi } from "@/api/cases.api";
import { hearingsApi } from "@/api/hearings.api";
import { documentsApi } from "@/api/documents.api";
import { formatRelativeTime } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Case, Hearing } from "@/types/api.types";
import { CaseStatus, HearingStatus } from "@/types/api.types";
import ApiErrorFallback from "@/components/shared/ApiErrorFallback";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

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

const COLORS = {
  filed: "#3b82f6", // Blue
  admitted: "#6366f1", // Indigo
  hearing: "#f97316", // Orange
  judgment: "#a855f7", // Purple
  closed: "#22c55e", // Green
  archived: "#64748b", // Slate
};

function StatsCard({ title, value, icon: Icon, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
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

  // Properly type the cases data extraction
  let cases: Case[] = [];
  const rawCasesData = casesRes.data;

  if (Array.isArray(rawCasesData)) {
    cases = rawCasesData as Case[];
  } else if (
    typeof rawCasesData === "object" &&
    rawCasesData !== null &&
    "cases" in rawCasesData &&
    Array.isArray((rawCasesData as { cases: unknown[] }).cases)
  ) {
    cases = (rawCasesData as { cases: Case[] }).cases;
  }

  const upcomingHearings = (
    Array.isArray(upcomingHearingsRes.data) ? upcomingHearingsRes.data : []
  ) as Hearing[];

  const todaysHearings = (
    Array.isArray(todaysHearingsRes.data) ? todaysHearingsRes.data : []
  ) as Hearing[];

  const allHearings = [...upcomingHearings, ...todaysHearings];
  const totalCases = cases.length;

  const activeHearings = allHearings.filter(
    (h) =>
      h.status === HearingStatus.SCHEDULED || h.status === HearingStatus.ONGOING
  ).length;

  const pendingCases = cases.filter(
    (c) => c.status === CaseStatus.FILED || c.status === CaseStatus.ADMITTED
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
      const status = c.status as CaseStatus;
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    },
    {}
  );

  // Get document statistics (may fail for non-admin users)
  let documents = 0;
  try {
    const documentsRes = await documentsApi.getDocumentStatistics();
    if (
      documentsRes.data &&
      typeof documentsRes.data.totalDocuments === "number"
    ) {
      documents = documentsRes.data.totalDocuments;
    }
  } catch (error) {
    // Ignore error, default to 0
    console.warn("Failed to fetch document stats:", error);
  }

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
                  /* Backend populates caseId, not case */
                  const caseData =
                    typeof h.caseId === "object" && h.caseId
                      ? (h.caseId as any)
                      : { caseNumber: "N/A", title: "Untitled Case" };

                  return (
                    <Link
                      key={h._id}
                      to={`/cases/${caseData._id}`}
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
      {/* Status Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Case Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of cases by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded" />
            ) : stats?.totalCases ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.statusBreakdown || {}).map(
                        ([key, value]) => ({
                          name: key.charAt(0).toUpperCase() + key.slice(1),
                          value,
                          status: key,
                        })
                      )}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {Object.keys(stats.statusBreakdown || {}).map(
                        (key, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[key as keyof typeof COLORS] || "#8884d8"
                            }
                          />
                        )
                      )}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Breakdown Table */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Status details</CardTitle>
            <CardDescription>
              Detailed count of cases in each stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(COLORS).map(([status, color]) => {
                const count =
                  stats?.statusBreakdown?.[status as CaseStatus] || 0;
                return (
                  <div
                    key={status}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <p className="text-sm font-medium capitalize text-foreground">
                        {status.replace("_", " ")}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {count}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
