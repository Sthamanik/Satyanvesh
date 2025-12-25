import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Gavel,
  Trash2,
  Eye,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import toast from "react-hot-toast";

interface CaseBookmark {
  _id: string;
  userId: string;
  caseId: {
    _id: string;
    caseNumber: string;
    title: string;
    status: string;
    nextHearingDate?: string;
  };
  notes?: string;
  createdAt: string;
}

export default function BookmarksPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch bookmarks
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user-bookmarks"],
    queryFn: async () => {
      const response = await axiosInstance.get("/case-bookmarks/my-bookmarks");
      return response.data;
    },
  });

  // Delete bookmark mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/case-bookmarks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookmarks"] });
      toast.success("Bookmark removed successfully");
      setDeleteDialogOpen(false);
      setSelectedBookmarkId(null);
    },
    onError: () => {
      toast.error("Failed to remove bookmark");
    },
  });

  const handleDelete = async () => {
    if (selectedBookmarkId) {
      await deleteMutation.mutateAsync(selectedBookmarkId);
    }
  };

  // Extract bookmarks from response
  const bookmarks: CaseBookmark[] = data?.data || [];

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Bookmarks</h1>
          <p className="text-text-secondary mt-1">
            Manage your bookmarked cases
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-status-error mb-4">Failed to load bookmarks</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Bookmarks</h1>
          <p className="text-text-secondary mt-1">
            Manage your bookmarked cases
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
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
      <div>
        <h1 className="text-3xl font-bold text-text-primary">My Bookmarks</h1>
        <p className="text-text-secondary mt-1">
          Manage your bookmarked cases ({bookmarks.length} total)
        </p>
      </div>

      {/* Bookmarks Grid */}
      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary mb-2">No bookmarks yet</p>
            <p className="text-sm text-text-secondary mb-4">
              Start bookmarking cases to keep track of important matters
            </p>
            <Link to="/cases">
              <Button variant="outline" size="sm">
                Browse Cases
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => {
            const caseData = bookmark.caseId;
            if (!caseData) return null;

            return (
              <Card
                key={bookmark._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link to={`/cases/${caseData._id}`}>
                        <h3 className="font-semibold text-text-primary hover:text-brand-primary transition-colors line-clamp-2">
                          {caseData.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-text-secondary mt-1">
                        {caseData.caseNumber}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBookmarkId(bookmark._id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Gavel className="w-4 h-4 text-text-secondary" />
                      <span className="text-text-secondary">Status:</span>
                      <Badge variant="outline">{caseData.status}</Badge>
                    </div>

                    {caseData.nextHearingDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-text-secondary" />
                        <span className="text-text-secondary">
                          Next Hearing:
                        </span>
                        <span className="text-text-primary">
                          {formatDate(caseData.nextHearingDate, "PPP")}
                        </span>
                      </div>
                    )}

                    {bookmark.notes && (
                      <div className="mt-3 pt-3 border-t border-background-secondary">
                        <p className="text-xs text-text-secondary mb-1">Notes</p>
                        <p className="text-sm text-text-primary line-clamp-2">
                          {bookmark.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-background-secondary">
                      <Link to={`/cases/${caseData._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Case
                        </Button>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <BookmarkCheck className="w-3 h-3" />
                        <span>
                          Bookmarked{" "}
                          {formatDate(bookmark.createdAt, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bookmark?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this bookmark? You can always
              bookmark it again later.
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
