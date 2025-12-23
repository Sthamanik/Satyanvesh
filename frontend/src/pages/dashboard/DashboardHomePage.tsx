import {
  Briefcase,
  Calendar,
  FileText,
  Gavel,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/stores/auth.store";

// Stats card component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeType?: "increase" | "decrease";
}

function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-text-secondary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {change && (
          <p
            className={`text-xs mt-1 ${
              changeType === "increase"
                ? "text-status-success"
                : "text-status-error"
            }`}
          >
            {changeType === "increase" ? "↑" : "↓"} {change} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Recent activity item
interface ActivityItem {
  id: string;
  type: string;
  description: string;
  time: string;
}

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    type: "Case Filed",
    description: "New case #2024-156 filed in Supreme Court",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "Hearing Scheduled",
    description: "Hearing for case #2024-123 on Jan 15",
    time: "5 hours ago",
  },
  {
    id: "3",
    type: "Document Added",
    description: "New evidence uploaded to case #2024-098",
    time: "1 day ago",
  },
  {
    id: "4",
    type: "Status Update",
    description: 'Case #2024-067 moved to "Under Hearing"',
    time: "2 days ago",
  },
];

export default function DashboardHomePage() {
  const user = useUser();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-text-secondary mt-1">
          Here's what's happening with your cases today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Cases"
          value="2,456"
          icon={Briefcase}
          change="12%"
          changeType="increase"
        />
        <StatsCard
          title="Active Hearings"
          value="48"
          icon={Calendar}
          change="8%"
          changeType="increase"
        />
        <StatsCard
          title="Pending Cases"
          value="892"
          icon={Gavel}
          change="5%"
          changeType="decrease"
        />
        <StatsCard
          title="Documents"
          value="12,453"
          icon={FileText}
          change="20%"
          changeType="increase"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {activity.type}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {activity.description}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Hearings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Hearings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Case #2024-123
                  </p>
                  <p className="text-xs text-text-secondary">Supreme Court</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-brand-primary">
                    Jan 15
                  </p>
                  <p className="text-xs text-text-secondary">10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Case #2024-098
                  </p>
                  <p className="text-xs text-text-secondary">High Court</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-brand-primary">
                    Jan 16
                  </p>
                  <p className="text-xs text-text-secondary">2:30 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Case #2024-067
                  </p>
                  <p className="text-xs text-text-secondary">District Court</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-brand-primary">
                    Jan 18
                  </p>
                  <p className="text-xs text-text-secondary">11:15 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Case Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">342</p>
              <p className="text-xs text-blue-600 mt-1">Registered</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">892</p>
              <p className="text-xs text-yellow-600 mt-1">Pending</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">456</p>
              <p className="text-xs text-purple-600 mt-1">Under Hearing</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">678</p>
              <p className="text-xs text-green-600 mt-1">Decided</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">88</p>
              <p className="text-xs text-gray-600 mt-1">Disposed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
