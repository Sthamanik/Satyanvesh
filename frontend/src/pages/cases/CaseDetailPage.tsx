import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Building2,
  User,
  FileText,
  Gavel,
  Edit,
  Trash2,
} from "lucide-react";
import { useGetCaseById } from "@/hooks/useCases";
import { formatDate, getStatusColor, cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentsPage from "@/pages/documents/DocumentsPage";
import CaseHearingsPage from "../hearings/CaseHearingsPage";

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isJudge, isClerk } = useUserRole();
  const { data, isLoading, error } = useGetCaseById(id!);

  const caseData = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-background-secondary rounded animate-pulse" />
        <div className="h-64 bg-background-secondary rounded animate-pulse" />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-status-error">Failed to load case details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Link to="/cases">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
        </Link>
        {(isAdmin || isJudge || isClerk) && (
          <div className="flex gap-2">
            <Link to={`/cases/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            {isAdmin && (
              <Button variant="outline" size="sm" className="text-status-error">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Case Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm text-text-secondary">Case Number</p>
                <Badge
                  className={cn("text-xs", getStatusColor(caseData.status))}
                >
                  {caseData.status.replace("_", " ")}
                </Badge>
                {caseData.isPublic && (
                  <Badge variant="outline" className="text-xs">
                    Public
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold font-mono text-brand-primary mb-3">
                {caseData.caseNumber}
              </h1>
              <CardTitle className="text-xl">{caseData.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {caseData.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text-secondary mb-2">
                Description
              </h3>
              <p className="text-text-primary">{caseData.description}</p>
            </div>
          )}

          {/* Meta Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Building2 className="w-4 h-4" />
                  <p className="text-sm font-semibold">Court</p>
                </div>
                <p className="text-text-primary ml-6">
                  {typeof caseData.court === "string"
                    ? caseData.court
                    : caseData.court?.name || "N/A"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Gavel className="w-4 h-4" />
                  <p className="text-sm font-semibold">Case Type</p>
                </div>
                <p className="text-text-primary ml-6">
                  {typeof caseData.caseType === "string"
                    ? caseData.caseType
                    : caseData.caseType?.name || "N/A"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm font-semibold">Filing Date</p>
                </div>
                <p className="text-text-primary ml-6">
                  {formatDate(caseData.filingDate, "PPP")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {caseData.judge && (
                <div>
                  <div className="flex items-center gap-2 text-text-secondary mb-1">
                    <User className="w-4 h-4" />
                    <p className="text-sm font-semibold">Judge</p>
                  </div>
                  <p className="text-text-primary ml-6">
                    {typeof caseData.judge === "string"
                      ? caseData.judge
                      : caseData.judge?.fullName || "N/A"}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <User className="w-4 h-4" />
                  <p className="text-sm font-semibold">Registered By</p>
                </div>
                <p className="text-text-primary ml-6">
                  {typeof caseData.registeredBy === "string"
                    ? caseData.registeredBy
                    : caseData.registeredBy?.fullName || "N/A"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-text-secondary mb-1">
                  <FileText className="w-4 h-4" />
                  <p className="text-sm font-semibold">Total Views</p>
                </div>
                <p className="text-text-primary ml-6">
                  {caseData.totalViews || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for additional info */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="hearings">Hearings</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-text-secondary mb-1">
                    Created At
                  </p>
                  <p className="text-text-primary">
                    {formatDate(caseData.createdAt, "PPpp")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-secondary mb-1">
                    Last Updated
                  </p>
                  <p className="text-text-primary">
                    {formatDate(caseData.updatedAt, "PPpp")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-secondary mb-1">
                    Case ID
                  </p>
                  <p className="text-text-primary font-mono text-sm">
                    {caseData._id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parties">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-text-secondary">
                Case parties will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hearings">
          <CaseHearingsPage caseId={caseData._id} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsPage caseId={caseData._id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
