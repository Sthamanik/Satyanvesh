import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Building2,
  Plus,
  Trash2,
} from "lucide-react";
import { useGetCaseHearings, useDeleteHearing } from "@/hooks/useHearings";
import { formatDate, cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import HearingCreateDialog from "@/components/hearings/HearingCreateDialog";

interface CaseHearingsPageProps {
  caseId?: string;
}

export default function CaseHearingsPage({ caseId: propCaseId }: CaseHearingsPageProps = {}) {
  const { id: routeCaseId } = useParams<{ id: string }>();
  const caseId = propCaseId || routeCaseId;
  
  const { isAdmin, isJudge, isClerk } = useUserRole();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHearingId, setSelectedHearingId] = useState<string | null>(
    null
  );

  if (!caseId) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Case ID is required</p>
      </div>
    );
  }

  const { data, isLoading, error } = useGetCaseHearings(caseId);
  const deleteMutation = useDeleteHearing();

  const hearings = data?.data || [];
  const canCreate = isAdmin || isJudge || isClerk;
  const canDelete = isAdmin;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      postponed: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = (id: string) => {
    setSelectedHearingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedHearingId) {
      deleteMutation.mutate(selectedHearingId);
      setDeleteDialogOpen(false);
      setSelectedHearingId(null);
    }
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
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hearings</CardTitle>
              <p className="text-sm text-text-secondary mt-1">
                {hearings.length} hearing(s) scheduled
              </p>
            </div>
            {canCreate && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                size="sm"
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Hearing
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hearings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">No hearings scheduled yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hearings.map((hearing) => (
                <div
                  key={hearing._id}
                  className="border border-background-secondary rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-brand-primary">
                        <Calendar className="w-4 h-4" />
                        <p className="font-semibold">
                          {formatDate(hearing.hearingDate, "PPP")}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs",
                          getStatusColor(hearing.status)
                        )}
                      >
                        {hearing.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(hearing._id)}
                        className="text-status-error hover:text-status-error hover:bg-status-error/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock className="w-4 h-4" />
                      <span>{hearing.hearingTime}</span>
                    </div>

                    {hearing.courtRoom && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Building2 className="w-4 h-4" />
                        <span>{hearing.courtRoom}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-text-secondary">
                      <User className="w-4 h-4" />
                      <span>
                        {typeof hearing.judge === "string"
                          ? hearing.judge
                          : hearing.judge?.fullName || "N/A"}
                      </span>
                    </div>
                  </div>

                  {hearing.purpose && (
                    <div className="mt-3 pt-3 border-t border-background-secondary">
                      <p className="text-xs text-text-secondary mb-1">
                        Purpose
                      </p>
                      <p className="text-sm text-text-primary">
                        {hearing.purpose}
                      </p>
                    </div>
                  )}

                  {hearing.remarks && (
                    <div className="mt-2">
                      <p className="text-xs text-text-secondary mb-1">
                        Remarks
                      </p>
                      <p className="text-sm text-text-primary">
                        {hearing.remarks}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <HearingCreateDialog
        caseId={caseId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hearing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hearing? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-status-error hover:bg-status-error/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
