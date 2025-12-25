import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Clock, 
  Search, 
  Gavel, 
  Plus, 
  Edit, 
  Trash2 
} from "lucide-react";
import { useUserRole } from "@/hooks/useAuth";
import { 
  useGetAllHearings, 
  useCreateHearing, 
  useUpdateHearing, 
  useDeleteHearing 
} from "@/hooks/useHearings";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import HearingDialog from "@/components/hearings/HearingDialog";

import { HearingStatus } from "@/types/api.types";
import type { Hearing, Case, User as APIUser } from "@/types/api.types";
import { format } from "date-fns";

/* ------------------------------------------------------------------ */
/* Helper to safely access nested objects */
/* ------------------------------------------------------------------ */
function getJudgeName(hearing: Hearing): string {
    if (typeof hearing.judgeId === 'object' && hearing.judgeId !== null) {
        return (hearing.judgeId as unknown as APIUser).fullName;
    }
    return "Unknown Judge";
}

function getCase(hearing: Hearing): Case | null {
    if (typeof hearing.caseId === 'object' && hearing.caseId !== null) {
        return hearing.caseId as unknown as Case;
    }
    return null;
}

export default function HearingsListPage() {
  const { isAdmin, isJudge } = useUserRole();
  const canManage = isAdmin || isJudge;

  /* ---------------- State ---------------- */
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState<Hearing | null>(null);

  /* ---------------- Queries & Mutations ---------------- */
  const { data, isLoading } = useGetAllHearings({
    page: page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const createMutation = useCreateHearing();
  const updateMutation = useUpdateHearing(selectedHearing?._id ?? "");
  const deleteMutation = useDeleteHearing();

  const hearings: Hearing[] = data?.data?.hearings || [];
  const totalPages = data?.data?.pagination?.pages || 1;

  /* ---------------- Handlers ---------------- */

  const handleSubmit = async (values: any) => {
    if (selectedHearing) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
    setDialogOpen(false);
    setSelectedHearing(null);
  };

  const handleDelete = async () => {
    if (selectedHearing) {
      await deleteMutation.mutateAsync(selectedHearing._id);
      setDeleteDialogOpen(false);
      setSelectedHearing(null);
    }
  };

  const openCreateDialog = () => {
    setSelectedHearing(null);
    setDialogOpen(true);
  };

  const openEditDialog = (hearing: Hearing) => {
    setSelectedHearing(hearing);
    setDialogOpen(true);
  };

  const openDeleteDialog = (hearing: Hearing) => {
    setSelectedHearing(hearing);
    setDeleteDialogOpen(true);
  };

  const getStatusColor = (status: HearingStatus) => {
    switch (status) {
      case HearingStatus.SCHEDULED: return "bg-blue-100 text-blue-800";
      case HearingStatus.COMPLETED: return "bg-green-100 text-green-800";
      case HearingStatus.ADJOURNED: return "bg-yellow-100 text-yellow-800";
      case HearingStatus.CANCELLED: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hearings</h1>
          <p className="text-gray-600 mt-1">
            Manage court hearings and schedules
          </p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog} className="bg-brand-primary">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Hearing
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search (Not fully implemented on backend filter yet)..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(HearingStatus).map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
             {[1,2,3].map(i => (
                 <Skeleton key={i} className="h-32 w-full rounded-lg" />
             ))}
        </div>
      ) : (
        <div className="space-y-4">
          {hearings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                  No hearings found.
              </div>
          ) : (
            hearings.map((hearing) => {
              const caseData = getCase(hearing);
              const judgeName = getJudgeName(hearing);

              return (
                <Card key={hearing._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Date Box */}
                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg min-w-[100px]">
                        <span className="text-sm font-medium text-gray-500 uppercase">
                          {format(new Date(hearing.hearingDate), "MMM")}
                        </span>
                        <span className="text-3xl font-bold text-gray-900">
                          {format(new Date(hearing.hearingDate), "dd")}
                        </span>
                         <span className="text-sm text-gray-500">
                           {hearing.hearingTime}
                         </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">
                                {caseData ? (
                                    <Link to={`/admin/cases/${caseData._id}`} className="hover:underline text-brand-primary">
                                        {caseData.caseNumber}
                                    </Link>
                                ) : "Unknown Case"}
                              </h3>
                              <Badge className={getStatusColor(hearing.status)}>
                                {hearing.status}
                              </Badge>
                            </div>
                            <p className="font-medium text-gray-900">
                               {caseData?.title || "Untitled Case"}
                            </p>
                          </div>
                          
                          {canManage && (
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => openEditDialog(hearing)}>
                                    <Edit className="w-4 h-4 text-gray-500" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => openDeleteDialog(hearing)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                          )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Gavel className="w-4 h-4" />
                            <span>Judge: {judgeName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <MapPin className="w-4 h-4" />
                             <span>Room: {hearing.courtRoom || "N/A"}</span>
                          </div>
                           <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4" />
                             <span>Purpose: {hearing.purpose}</span>
                          </div>
                        </div>

                        {hearing.notes && (
                            <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                                {hearing.notes}
                            </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
            <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
            >
                Previous
            </Button>
            <span className="flex items-center px-4">
                Page {page} of {totalPages}
            </span>
             <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
            >
                Next
            </Button>
        </div>
      )}

      {/* Dialogs */}
      <HearingDialog 
        open={dialogOpen}
        onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setSelectedHearing(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedHearing || undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hearing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hearing record?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
