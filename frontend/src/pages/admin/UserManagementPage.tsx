import { useState, useEffect } from "react";
import { Users, CheckCircle, XCircle, Shield, RefreshCw, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  useGetAllUsers,
  useVerifyUser,
  useUpdateUserRole,
  useGetUserStatistics,
} from "@/hooks/useUsers";
import { Card, CardContent } from "@/components/ui/card";
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
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Custom debounce
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users with filters and pagination
  const { data, isLoading, error, refetch, isRefetching } = useGetAllUsers({
    search: debouncedSearch || undefined,
    filter: roleFilter !== "all" ? { role: roleFilter } : undefined,
    page: page,
    limit: 10,
  });

  // Fetch statistics
  const { 
    data: statsData, 
    isLoading: isLoadingStats,
    error: statsError 
  } = useGetUserStatistics();
  
  const stats = statsData?.data;

  // Debug stats error
  useEffect(() => {
    if (statsError) {
      console.error("User Statistics Error:", statsError);
      // Optional: Add toast notification if needed, but console log is key for debugging
    }
  }, [statsError]);

  const verifyMutation = useVerifyUser();
  const updateRoleMutation = useUpdateUserRole();

  // Extract data
  const users: User[] = (data?.data as any)?.users ?? [];
  const pagination = (data?.data as any)?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleVerifyUser = (userId: string) => {
    verifyMutation.mutate(userId);
  };

  const handleUpdateRole = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role: role as UserRole });
  };

  const handleRetry = () => {
    refetch();
  };

  // Helper for stats display
  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgClass}`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
          <div>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : statsError ? (
               <p className="text-sm text-red-500 font-medium">Error</p>
            ) : (
              <p className="text-2xl font-bold text-text-primary">{value ?? 0}</p>
            )}
            <p className="text-sm text-text-secondary">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
            <p className="text-text-secondary mt-1">Manage users, verify accounts, and assign roles</p>
          </div>
        </div>
        <ApiErrorFallback error={error} resetError={handleRetry} showBackButton={false} />
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
          <p className="text-text-secondary mt-1">Manage users, verify accounts, and assign roles</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRetry} disabled={isRefetching}>
          <RefreshCw className={cn("w-4 h-4 mr-2", isRefetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers} 
          icon={Users} 
          colorClass="text-blue-600 dark:text-blue-300" 
          bgClass="bg-blue-100 dark:bg-blue-900" 
        />
        <StatCard 
          title="Verified" 
          value={stats?.verifiedUsers} 
          icon={CheckCircle} 
          colorClass="text-green-600 dark:text-green-300" 
          bgClass="bg-green-100 dark:bg-green-900" 
        />
        <StatCard 
          title="Pending" 
          value={stats?.unverifiedUsers} 
          icon={XCircle} 
          colorClass="text-yellow-600 dark:text-yellow-300" 
          bgClass="bg-yellow-100 dark:bg-yellow-900" 
        />
        <StatCard 
          title="Staff" 
          value={stats?.usersByRole?.reduce((acc: number, cur: any) => 
            ['admin', 'judge', 'clerk'].includes(cur._id) ? acc + cur.count : acc, 0) ?? 0}
          icon={Shield} 
          colorClass="text-purple-600 dark:text-purple-300" 
          bgClass="bg-purple-100 dark:bg-purple-900" 
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search by name, email, or username..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select 
              value={roleFilter} 
              onValueChange={(val) => {
                setRoleFilter(val);
                setPage(1);
              }}
            >
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
        <CardContent className="p-0">
          {isLoading ? (
             <div className="p-6 space-y-4">
               {[1, 2, 3, 4, 5].map((i) => (
                 <Skeleton key={i} className="h-12 w-full" />
               ))}
             </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">
                {searchInput || roleFilter !== "all"
                  ? "No users found matching your filters"
                  : "No users found"}
              </p>
            </div>
          ) : (
            <>
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
                            <SelectTrigger className="w-32 h-8 text-xs">
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
                              className="bg-brand-primary hover:bg-brand-primary/90 h-8 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verify
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-4 py-4 border-t border-border">
                  <div className="text-sm text-text-secondary">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || isLoading}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages || isLoading}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
