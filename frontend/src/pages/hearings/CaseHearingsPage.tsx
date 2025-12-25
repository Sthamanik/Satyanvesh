import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Clock,
  User,
  Building2,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { 
  useGetCaseHearings, 
  useCreateHearing, 
  useUpdateHearing, 
  useDeleteHearing 
} from "@/hooks/useHearings";
import { formatDate, cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import HearingDialog from "@/components/hearings/HearingDialog";
import { HearingStatus } from "@/types/api.types";
import type { Hearing } from "@/types/api.types";

interface CaseHearingsPageProps {
  caseId?: string;
}

export default function CaseHearingsPage({ caseId: propCaseId }: CaseHearingsPageProps = {}) {
  const { id: routeCaseId } = useParams<{ id: string }>();
  const caseId = propCaseId || routeCaseId;
  
  const { isAdmin, isJudge, isClerk } = useUserRole();
  const canManage = isAdmin || isJudge || isClerk;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState<Hearing | null>(null);

  if (!caseId) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Case ID is required</p>
      </div>
    );
  }

  const { data, isLoading, error } = useGetCaseHearings(caseId);
  const createMutation = useCreateHearing();
  const updateMutation = useUpdateHearing(selectedHearing?._id ?? "");
  const deleteMutation = useDeleteHearing();

  const hearings = data?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case HearingStatus.SCHEDULED: return "bg-blue-100 text-blue-800";
      case HearingStatus.COMPLETED: return "bg-green-100 text-green-800";
      case HearingStatus.ADJOURNED: return "bg-yellow-100 text-yellow-800";
      case HearingStatus.CANCELLED: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleOpenCreate = () => {
    setSelectedHearing(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (hearing: Hearing) => {
    setSelectedHearing(hearing);
    setDialogOpen(true);
  };

  const handleDelete = (hearing: Hearing) => {
    setSelectedHearing(hearing);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedHearing) {
      await deleteMutation.mutateAsync(selectedHearing._id);
      setDeleteDialogOpen(false);
      setSelectedHearing(null);
    }
  };

  const handleSubmit = async (values: any) => {
    // If creating, ensure caseId is present
    const payload = { ...values, caseId };
    
    if (selectedHearing) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
    setDialogOpen(false);
    setSelectedHearing(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-background-secondary rounded w-3/4" />
            <div className="h-4 bg-background-secondary rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-status-error">Failed to load hearings</p>
          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Hearings</h2>
        {canManage && (
          <Button onClick={handleOpenCreate} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Hearing
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {hearings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-text-secondary">
              No hearings scheduled for this case
            </CardContent>
          </Card>
        ) : (
          hearings.map((hearing) => (
            <Card key={hearing._id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-background-secondary rounded-lg min-w-[120px]">
                    <span className="text-sm font-medium text-text-secondary uppercase">
                      {formatDate(hearing.hearingDate).split(",")[0]}
                    </span>
                    <span className="text-2xl font-bold text-text-primary my-1">
                       {/* This assumes formatDate returns "Mon, Jan 01, 2024" format approx */}
                       {new Date(hearing.hearingDate).getDate()}
                    </span>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Clock className="w-4 h-4 mr-1" />
                      {hearing.hearingTime}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-text-primary">
                            {hearing.hearingNumber}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={cn(getStatusColor(hearing.status))}
                          >
                            {hearing.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-text-secondary">{hearing.purpose}</p>
                      </div>
                      
                      {canManage && (
                          <div className="flex gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleOpenEdit(hearing)}
                                className="text-text-secondary hover:text-brand-primary"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(hearing)}
                                className="text-text-secondary hover:text-status-error"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <User className="w-4 h-4" />
                        <span>
                          Judge:{" "}
                          {typeof hearing.judgeId === "object"
                            ? (hearing.judgeId as any).fullName
                            : "U/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Building2 className="w-4 h-4" />
                        <span>Room: {hearing.courtRoom || "N/A"}</span>
                      </div>
                    </div>

                    {hearing.notes && (
                      <div className="bg-background-secondary p-3 rounded-md text-sm text-text-secondary">
                        <p className="font-medium mb-1">Notes:</p>
                        {hearing.notes}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <HearingDialog
        open={dialogOpen}
        onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setSelectedHearing(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedHearing || undefined}
        caseId={caseId}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Hearing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this hearing? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Hearing</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-status-error hover:bg-red-700"
            >
              Cancel Hearing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
