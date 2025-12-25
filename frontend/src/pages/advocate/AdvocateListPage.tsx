import { useState } from "react";
import { Users, Award, Plus, Edit, Trash2 } from "lucide-react";
import { 
  useGetAdvocates, 
  useCreateAdvocate, 
  useUpdateAdvocate, 
  useDeleteAdvocate 
} from "@/hooks/useAdvocates";
import { useUserRole } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import AdvocateDialog from "@/components/advocates/AdvocateDialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Advocate, User } from "@/types/api.types";

/* ------------------------------------------------------------------ */
/* Type Guards */
/* ------------------------------------------------------------------ */

function isUser(user: string | User | undefined): user is User {
  return typeof user === "object" && user !== null;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function AdvocatesListPage() {
  const { isAdmin } = useUserRole();
  const [search, setSearch] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);

  const { data, isLoading } = useGetAdvocates();
  const createMutation = useCreateAdvocate();
  const updateMutation = useUpdateAdvocate(selectedAdvocate?._id ?? "");
  const deleteMutation = useDeleteAdvocate();

  const advocates: Advocate[] = data?.data?.advocates || [];

  // Helper to get user object from advocate
  const getUser = (adv: Advocate): User | undefined => {
    // Check if userId is expanded/populated
    if (typeof adv.userId === 'object' && adv.userId !== null) {
      return adv.userId as unknown as User;
    }
    // Check if user field exists (virtual)
    if (isUser(adv.user)) {
      return adv.user;
    }
    return undefined;
  };

  const filteredAdvocates = advocates.filter((adv) => {
    const user = getUser(adv);
    if (!search) return true;
    if (!user) return false;
    return user.fullName.toLowerCase().includes(search.toLowerCase());
  });

   const handleCreate = async (values: Partial<Advocate>) => {
    await createMutation.mutateAsync(values);
    setCreateDialogOpen(false);
  };

  const handleUpdate = async (values: Partial<Advocate>) => {
    if (selectedAdvocate) {
      await updateMutation.mutateAsync(values);
      setCreateDialogOpen(false);
      setSelectedAdvocate(null);
    }
  };

  const handleDelete = async () => {
    if (selectedAdvocate) {
      await deleteMutation.mutateAsync(selectedAdvocate._id);
      setDeleteDialogOpen(false);
      setSelectedAdvocate(null);
    }
  };

  const handleSubmit = async (values: Partial<Advocate>) => {
    if (selectedAdvocate) {
      await handleUpdate(values);
    } else {
      await handleCreate(values);
    }
  };

  const openValidDeleteDialog = (adv: Advocate) => {
    setSelectedAdvocate(adv);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (adv: Advocate) => {
    setSelectedAdvocate(adv);
    setCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advocates</h1>
          <p className="text-gray-600 mt-1">Browse registered advocates</p>
        </div>
        {isAdmin && (
          <Button 
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => {
              setSelectedAdvocate(null);
              setCreateDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Register Advocate
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search advocates by name..."
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
                        <Skeleton className="h-12 w-12 rounded-full mb-4"/>
                        <Skeleton className="h-6 w-3/4 mb-2"/>
                        <Skeleton className="h-4 w-1/2"/>
                    </CardContent>
                 </Card>
             ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAdvocates.map((adv) => {
            const user = getUser(adv);

            return (
              <Card key={adv._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-purple-900" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate" title={user?.fullName ?? "Unknown Advocate"}>
                        {user?.fullName ?? "Unknown Advocate"}
                      </h3>
                      {user?.email && (
                         <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm flex-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{adv.experience} years experience</span>
                    </div>

                    {adv.specialization && adv.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {adv.specialization.slice(0, 3).map((spec, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                         {adv.specialization.length > 3 && (
                            <Badge variant="secondary" className="text-xs">+{adv.specialization.length - 3}</Badge>
                         )}
                      </div>
                    )}
                  </div>
                  
                  {isAdmin && (
                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1 h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => openEditDialog(adv)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                            onClick={() => openValidDeleteDialog(adv)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
           {filteredAdvocates.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                  No advocates found matching your search.
              </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AdvocateDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (!open) setSelectedAdvocate(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedAdvocate || undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Advocate?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this advocate registration? 
              This will not delete the associated user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
