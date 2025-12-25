import { BarChart3, TrendingUp, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AnalyticsPage() {
  // Mock data for visualization
  const mockData = {
    totalCases: 2456,
    activeHearings: 48,
    completionRate: 65,
    avgResolutionTime: "8.5 months",
    casesByStatus: {
      registered: 342,
      pending: 892,
      under_hearing: 456,
      decided: 678,
      disposed: 88,
    },
  };

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
                <p className="text-2xl font-bold">{mockData.totalCases}</p>
                <p className="text-sm text-gray-600">Total Cases</p>
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
                <p className="text-2xl font-bold">{mockData.activeHearings}</p>
                <p className="text-sm text-gray-600">Active Hearings</p>
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
                <p className="text-2xl font-bold">{mockData.completionRate}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockData.avgResolutionTime}
                </p>
                <p className="text-sm text-gray-600">Avg Resolution</p>
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
          <div className="space-y-4">
            {Object.entries(mockData.casesByStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {status.replace("_", " ")}
                  </span>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
                <Progress value={(count / mockData.totalCases) * 100} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
