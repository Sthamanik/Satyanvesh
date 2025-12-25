import { useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Upload, Download, Eye, Trash2, Filter } from "lucide-react";
import { useGetCaseDocuments, useDeleteDocument } from "@/hooks/useDocument";
import { formatDate, formatFileSize, cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import { DocumentType } from "@/types/api.types";

interface DocumentsPageProps {
  caseId?: string;
}

export default function DocumentsPage({ caseId: propCaseId }: DocumentsPageProps = {}) {
  const { id: routeCaseId } = useParams<{ id: string }>();
  const caseId = propCaseId || routeCaseId;
  
  const { isAdmin, isJudge, isClerk, isLawyer } = useUserRole();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  if (!caseId) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Case ID is required</p>
      </div>
    );
  }

  const { data, isLoading, error } = useGetCaseDocuments(caseId);
  const deleteMutation = useDeleteDocument();

  const documents = data?.data || [];

  // Filter documents by type
  const filteredDocuments =
    typeFilter === "all"
      ? documents
      : documents.filter((doc) => doc.type === typeFilter);

  const canUpload = isAdmin || isJudge || isClerk || isLawyer;
  const canDelete = isAdmin || isJudge || isClerk;

  const handleDelete = (id: string) => {
    setSelectedDocId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocId) {
      deleteMutation.mutate(selectedDocId);
      setDeleteDialogOpen(false);
      setSelectedDocId(null);
    }
  };

  const handleDownload = (fileUrl: string, title: string) => {
    // Open document in new tab for download
    window.open(fileUrl, "_blank");
    console.log(`Downloading document: ${title}`);
  };


  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      petition: "bg-blue-100 text-blue-800",
      response: "bg-purple-100 text-purple-800",
      evidence: "bg-yellow-100 text-yellow-800",
      order: "bg-orange-100 text-orange-800",
      judgment: "bg-green-100 text-green-800",
      notice: "bg-pink-100 text-pink-800",
      application: "bg-indigo-100 text-indigo-800",
      affidavit: "bg-teal-100 text-teal-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.other;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-background-secondary rounded w-3/4" />
            <div className="h-4 bg-background-secondary rounded w-1/2" />
            <div className="h-4 bg-background-secondary rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-status-error">Failed to load documents</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Case Documents</CardTitle>
              <p className="text-sm text-text-secondary mt-1">
                {documents.length} document(s) uploaded
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={DocumentType.PETITION}>
                    Petition
                  </SelectItem>
                  <SelectItem value={DocumentType.RESPONSE}>
                    Response
                  </SelectItem>
                  <SelectItem value={DocumentType.EVIDENCE}>
                    Evidence
                  </SelectItem>
                  <SelectItem value={DocumentType.ORDER}>Order</SelectItem>
                  <SelectItem value={DocumentType.JUDGMENT}>
                    Judgment
                  </SelectItem>
                  <SelectItem value={DocumentType.NOTICE}>Notice</SelectItem>
                  <SelectItem value={DocumentType.APPLICATION}>
                    Application
                  </SelectItem>
                  <SelectItem value={DocumentType.AFFIDAVIT}>
                    Affidavit
                  </SelectItem>
                  <SelectItem value={DocumentType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>

              {canUpload && (
                <Button
                  onClick={() => setUploadDialogOpen(true)}
                  className="bg-brand-primary hover:bg-brand-primary/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">
                {typeFilter === "all"
                  ? "No documents uploaded yet"
                  : "No documents found for this type"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-text-secondary shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-text-primary truncate">
                              {doc.title}
                            </p>
                            {doc.description && (
                              <p className="text-xs text-text-secondary truncate">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            getDocumentTypeColor(doc.type)
                          )}
                        >
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatFileSize(doc.fileSize)}
                      </TableCell>
                      <TableCell className="text-sm text-text-secondary">
                        {formatDate(doc.createdAt, "PP")}
                      </TableCell>
                      <TableCell className="text-sm">
                        {typeof doc.uploadedBy === "string"
                          ? doc.uploadedBy
                          : doc.uploadedBy?.fullName || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={doc.isPublic ? "default" : "outline"}
                          className="text-xs"
                        >
                          {doc.isPublic ? "Public" : "Private"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, "_blank")}
                            title="View Document"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownload(doc.fileUrl, doc.title)
                            }
                            title="Download Document"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(doc._id)}
                              className="text-status-error hover:text-status-error hover:bg-status-error/10"
                              title="Delete Document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <DocumentUploadDialog
        caseId={caseId}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot
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
