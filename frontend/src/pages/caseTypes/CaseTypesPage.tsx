import { useState } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react";
import {
  useGetCaseTypes,
  useDeleteCaseType,
  useToggleCaseTypeStatus,
} from "@/hooks/useCaseTypes";
import { useUserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import ApiErrorFallback from "@/components/shared/ApiErrorFallback";
import { CaseCategory } from "@/types/api.types";
import type { CaseType } from "@/types/api.types";

export default function CaseTypesPage() {
  const { isAdmin } = useUserRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType | null>(
    null
  );

  const { data, isLoading, error, refetch } = useGetCaseTypes();
  const deleteMutation = useDeleteCaseType();
  const toggleMutation = useToggleCaseTypeStatus();

  const caseTypes: CaseType[] = Array.isArray(data?.data) ? data.data : [];

  const filteredCaseTypes = caseTypes.filter((ct) => {
    const matchesSearch =
      ct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ct.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || ct.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async () => {
    if (selectedCaseType) {
      await deleteMutation.mutateAsync(selectedCaseType._id);
      setDeleteDialogOpen(false);
      setSelectedCaseType(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    await toggleMutation.mutateAsync(id);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Case Types</h1>
          <p className="text-text-secondary mt-1">
            Manage case types and categories
          </p>
        </div>
        <ApiErrorFallback
          error={error}
          resetError={() => refetch()}
          showBackButton={false}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Case Types</h1>
          <p className="text-text-secondary mt-1">
            Manage case types and categories
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Case Types</h1>
          <p className="text-text-secondary mt-1">
            Manage case types and categories ({filteredCaseTypes.length} total)
          </p>
        </div>
        {isAdmin && (
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Case Type
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search case types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={CaseCategory.CIVIL}>Civil</SelectItem>
                <SelectItem value={CaseCategory.CRIMINAL}>Criminal</SelectItem>
                <SelectItem value={CaseCategory.FAMILY}>Family</SelectItem>
                <SelectItem value={CaseCategory.CONSTITUTIONAL}>
                  Constitutional
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Case Types Grid */}
      {filteredCaseTypes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary mb-2">No case types found</p>
            {isAdmin && (
              <Button variant="outline" size="sm" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add First Case Type
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCaseTypes.map((caseType) => (
            <Card key={caseType._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{caseType.name}</CardTitle>
                    <p className="text-sm text-text-secondary mt-1">
                      Code: {caseType.code}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(caseType._id)}
                        title={caseType.isActive ? "Deactivate" : "Activate"}
                      >
                        {caseType.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant="outline">{caseType.category}</Badge>
                    <Badge
                      variant={caseType.isActive ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {caseType.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {caseType.description && (
                    <p className="text-sm text-text-secondary line-clamp-3">
                      {caseType.description}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="flex items-center gap-2 pt-3 border-t border-background-secondary">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCaseType(caseType);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Case Type?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCaseType?.name}"? This
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

