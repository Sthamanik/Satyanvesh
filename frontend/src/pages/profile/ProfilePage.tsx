import { useState } from "react";
import { Mail, Phone, Calendar, Shield, Edit, Camera } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { UserRole } from "@/types/api.types";

export default function ProfilePage() {
  const { data: userData, isLoading } = useCurrentUser();
  const user = userData?.data;
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
          <p className="text-text-secondary mt-1">View and edit your profile</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
          <p className="text-text-secondary mt-1">View and edit your profile</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      [UserRole.ADMIN]: "bg-red-100 text-red-800",
      [UserRole.JUDGE]: "bg-purple-100 text-purple-800",
      [UserRole.LAWYER]: "bg-blue-100 text-blue-800",
      [UserRole.CLERK]: "bg-green-100 text-green-800",
      [UserRole.LITIGANT]: "bg-yellow-100 text-yellow-800",
      [UserRole.PUBLIC]: "bg-gray-100 text-gray-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
          <p className="text-text-secondary mt-1">View and edit your profile</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
                <AvatarFallback className="text-2xl">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                {user.fullName}
              </h2>
              <p className="text-text-secondary">@{user.username}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
                {user.isVerified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-text-secondary mt-0.5" />
              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <p className="text-text-primary">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-text-secondary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Phone</p>
                  <p className="text-text-primary">{user.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-text-secondary mt-0.5" />
              <div>
                <p className="text-sm text-text-secondary">Member Since</p>
                <p className="text-text-primary">
                  {formatDate(user.createdAt, "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            {user.barCouncilId && (
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-text-secondary mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Bar Council ID</p>
                  <p className="text-text-primary">{user.barCouncilId}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">
              {user.isVerified ? "Active" : "Pending"}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {user.isVerified
                ? "Your account is verified"
                : "Verification pending"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary capitalize">
              {user.role}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Your current role in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-text-secondary">
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">
              {formatDate(user.updatedAt, "MMM d")}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Profile last updated
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

