import { TrendingUp, FileText, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { casesApi } from "@/api/cases.api";
import { hearingsApi } from "@/api/hearings.api";
import { usersApi } from "@/api/users.api";
import { Skeleton } from "@/components/ui/skeleton";
import ApiErrorFallback from "@/components/shared/ApiErrorFallback";
import { CaseStatus, HearingStatus } from "@/types/api.types";

interface AnalyticsStats {
  totalCases: number;
  activeHearings: number;
  totalDocuments: number;
  totalUsers: number;
  casesByStatus: Record<CaseStatus, number>;
  completionRate: number;
}

const fetchAnalyticsStats = async (): Promise<AnalyticsStats> => {
  const [casesRes, upcomingHearingsRes, todaysHearingsRes, usersRes] =
    await Promise.all([
      casesApi.getAllCases({ limit: 10000 }),
      hearingsApi.getUpcomingHearings({ limit: 1000 }),
      hearingsApi.getTodaysHearings(),
      usersApi.getAllUsers({ limit: 10000 }),
    ]);

  // API responses have structure: { statusCode, data, message, success }
  // Cases and Users return paginated data: { cases: [...], pagination: {...} }
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
  const usersData = usersRes.data as { users?: unknown[]; pagination?: unknown } | unknown[];
  const users = Array.isArray(usersData)
    ? usersData
    : (Array.isArray((usersData as { users?: unknown[] })?.users)
        ? (usersData as { users: unknown[] }).users
        : []);

  const totalCases = cases.length;
  const activeHearings = [...upcomingHearings, ...todaysHearings].filter(
    (h) =>
      h.status === HearingStatus.SCHEDULED || h.status === HearingStatus.ONGOING
  ).length;

  // Calculate cases by status
  const casesByStatus = (cases as Array<{ status: CaseStatus }>).reduce<Record<CaseStatus, number>>(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    {
      [CaseStatus.FILED]: 0,
      [CaseStatus.ADMITTED]: 0,
      [CaseStatus.HEARING]: 0,
      [CaseStatus.JUDGMENT]: 0,
      [CaseStatus.CLOSED]: 0,
      [CaseStatus.ARCHIVED]: 0,
    } as Record<CaseStatus, number>
  );

  // Calculate completion rate (closed + archived / total)
  const completedCases = casesByStatus.closed + casesByStatus.archived;
  const completionRate =
    totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0;

  // Estimate documents (we can't get exact count without statistics endpoint)
  const totalDocuments = 0; // Will be updated when document statistics is available

  return {
    totalCases,
    activeHearings,
    totalDocuments,
    totalUsers: users.length,
    casesByStatus,
    completionRate,
  };
};

export default function AnalyticsPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: fetchAnalyticsStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Analytics Dashboard
          </h1>
          <p className="text-text-secondary mt-1">
            System-wide statistics and insights
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Analytics Dashboard
          </h1>
          <p className="text-text-secondary mt-1">
            System-wide statistics and insights
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statusOrder: CaseStatus[] = [
    CaseStatus.FILED,
    CaseStatus.ADMITTED,
    CaseStatus.HEARING,
    CaseStatus.JUDGMENT,
    CaseStatus.CLOSED,
    CaseStatus.ARCHIVED,
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Analytics Dashboard
        </h1>
        <p className="text-text-secondary mt-1">
          System-wide statistics and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalCases ?? 0}</p>
                <p className="text-sm text-text-secondary">Total Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.activeHearings ?? 0}
                </p>
                <p className="text-sm text-text-secondary">Active Hearings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.completionRate ?? 0}%
                </p>
                <p className="text-sm text-text-secondary">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalUsers ?? 0}</p>
                <p className="text-sm text-text-secondary">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Cases by Status</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.totalCases ? (
            <div className="space-y-4">
              {statusOrder.map((status) => {
                const count = stats.casesByStatus[status] || 0;
                const percentage =
                  stats.totalCases > 0
                    ? (count / stats.totalCases) * 100
                    : 0;

                return (
                  <div key={status}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary capitalize">
                        {status.replace("_", " ")}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {count} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-secondary text-center py-6">
              No cases data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Additional Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-secondary">
              Filed Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary">
              {stats?.casesByStatus[CaseStatus.FILED] ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-secondary">
              Cases in Hearing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary">
              {stats?.casesByStatus[CaseStatus.HEARING] ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-text-secondary">
              Closed Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary">
              {(stats?.casesByStatus[CaseStatus.CLOSED] ?? 0) +
                (stats?.casesByStatus[CaseStatus.ARCHIVED] ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
