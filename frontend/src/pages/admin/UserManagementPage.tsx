import { useState } from "react";
import { Users, CheckCircle, XCircle, Shield, RefreshCw } from "lucide-react";
import {
  useGetAllUsers,
  useVerifyUser,
  useUpdateUserRole,
} from "@/hooks/useUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApiErrorFallback from "@/components/shared/ApiErrorFallback";
import { formatDate, cn } from "@/lib/utils";
import type { User, UserRole } from "@/types/api.types";

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Fetch users with filters
  const { data, isLoading, error, refetch, isRefetching } = useGetAllUsers({
    search: search || undefined,
    filter: roleFilter !== "all" ? { role: roleFilter } : undefined,
  });

  const verifyMutation = useVerifyUser();
  const updateRoleMutation = useUpdateUserRole();

  // Ensure users is always an array
  const users: User[] = Array.isArray(data?.data) ? data.data : [];
  const totalUsers = data?.meta?.total || 0;

  // Calculate stats safely
  const verifiedUsers = users.filter((u: User) => u.isVerified).length;
  const pendingUsers = users.filter((u: User) => !u.isVerified).length;
  const staffUsers = users.filter((u: User) =>
    ["admin", "judge", "clerk"].includes(u.role)
  ).length;

  const handleVerifyUser = (userId: string) => {
    verifyMutation.mutate(userId);
  };

  const handleUpdateRole = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role: role as UserRole });
  };

  const handleRetry = () => {
    refetch();
  };

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage users, verify accounts, and assign roles
          </p>
        </div>
        <ApiErrorFallback
          error={error}
          resetError={handleRetry}
          showBackButton={false}
        />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage users, verify accounts, and assign roles
          </p>
        </div>

        {/* Stats Skeleton */}
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage users, verify accounts, and assign roles
          </p>
        </div>
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
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {totalUsers}
                </p>
                <p className="text-sm text-text-secondary">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {verifiedUsers}
                </p>
                <p className="text-sm text-text-secondary">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {pendingUsers}
                </p>
                <p className="text-sm text-text-secondary">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {staffUsers}
                </p>
                <p className="text-sm text-text-secondary">Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by name, email, or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="judge">Judge</SelectItem>
                <SelectItem value="clerk">Clerk</SelectItem>
                <SelectItem value="lawyer">Lawyer</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">
                {search || roleFilter !== "all"
                  ? "No users found matching your filters"
                  : "No users found"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-text-primary">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-text-secondary">
                            @{user.username}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-text-secondary">
                          {user.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(role) =>
                            handleUpdateRole(user._id, role)
                          }
                          disabled={updateRoleMutation.isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="judge">Judge</SelectItem>
                            <SelectItem value="clerk">Clerk</SelectItem>
                            <SelectItem value="lawyer">Lawyer</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {user.isVerified ? (
                            <Badge
                              className={cn(
                                "text-xs w-fit",
                                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              )}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge
                              className={cn(
                                "text-xs w-fit",
                                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              )}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {user.isActive ? (
                            <Badge variant="outline" className="text-xs w-fit">
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs w-fit opacity-50"
                            >
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-text-secondary">
                          {formatDate(user.createdAt, "PP")}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        {!user.isVerified && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyUser(user._id)}
                            disabled={verifyMutation.isPending}
                            className="bg-brand-primary hover:bg-brand-primary/90"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
