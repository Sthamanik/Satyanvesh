import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2 
} from "lucide-react";
import { useUserRole } from "@/hooks/useAuth";
import { 
  useGetCourts, 
  useCreateCourt, 
  useUpdateCourt, 
  useDeleteCourt 
} from "@/hooks/useCourts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import CourtDialog from "@/components/courts/CourtDialog";
import type { Court } from "@/types/api.types";

export default function CourtsListPage() {
  const { isAdmin } = useUserRole();

  /* ---------------- State ---------------- */
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  /* ---------------- Queries & Mutations ---------------- */
  const { data, isLoading } = useGetCourts();
  const createMutation = useCreateCourt();
  const updateMutation = useUpdateCourt(selectedCourt?._id ?? "");
  const deleteMutation = useDeleteCourt();

  /* ---------------- Logic ---------------- */

  const courts: Court[] = data?.data?.courts || [];

  const filteredCourts = courts.filter((court) =>
    court.name.toLowerCase().includes(search.toLowerCase()) || 
    court.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (values: Partial<Court>) => {
    await createMutation.mutateAsync(values);
    setCreateDialogOpen(false);
  };

  const handleUpdate = async (values: Partial<Court>) => {
    if (selectedCourt) {
      await updateMutation.mutateAsync(values);
      setCreateDialogOpen(false);
      setSelectedCourt(null);
    }
  };

  const handleDelete = async () => {
    if (selectedCourt) {
      await deleteMutation.mutateAsync(selectedCourt._id);
      setDeleteDialogOpen(false);
      setSelectedCourt(null);
    }
  };

  const handleSubmit = async (values: any) => {
    // values matches CourtFormValues which is compatible with Partial<Court> structure for API
    if (selectedCourt) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  };

  const openValidDeleteDialog = (court: Court) => {
    setSelectedCourt(court);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (court: Court) => {
    setSelectedCourt(court);
    setCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Courts</h1>
          <p className="text-text-secondary mt-1">
            Browse and manage courts in the system
          </p>
        </div>
        {isAdmin && (
          <Button 
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => {
              setSelectedCourt(null);
              setCreateDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Court
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search courts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1,2,3].map(i => (
                 <Card key={i}>
                    <CardContent className="pt-6">
                        <Skeleton className="h-12 w-12 rounded-lg mb-4"/>
                        <Skeleton className="h-6 w-3/4 mb-2"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </CardContent>
                 </Card>
             ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourts.map((court) => (
            <Card key={court._id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-900" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate" title={court.name}>{court.name}</h3>
                    <div className="flex gap-2">
                        <span className="text-xs text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                        {court.type}
                        </span>
                        <span className="text-xs text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        {court.code}
                        </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                    {court.state && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{court.city ? `${court.city}, ` : ''}{court.state}</span>
                    </div>
                    )}

                    {court.address && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {court.address}
                    </p>
                    )}
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => openEditDialog(court)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                            onClick={() => openValidDeleteDialog(court)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredCourts.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                  No courts found matching your search.
              </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <CourtDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
             setCreateDialogOpen(open);
             if (!open) setSelectedCourt(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedCourt || undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Court?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCourt?.name}"? This
              action cannot be undone.
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
