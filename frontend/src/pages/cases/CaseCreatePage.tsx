import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCreateCase } from "@/hooks/useCases";
import { useGetCourts } from "@/hooks/useCourts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { CaseStatus, CasePriority, CaseStage, type Court } from "@/types/api.types";

// FIXED Schema to match backend model exactly
const caseSchema = z.object({
  caseNumber: z.string().min(1, "Case number is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  caseTypeId: z.string().min(1, "Case type is required"),
  courtId: z.string().min(1, "Court is required"),
  filingDate: z.string().min(1, "Filing date is required"),
  status: z.enum([
    CaseStatus.FILED,
    CaseStatus.ADMITTED,
    CaseStatus.HEARING,
    CaseStatus.JUDGMENT,
    CaseStatus.CLOSED,
    CaseStatus.ARCHIVED,
  ]),
  priority: z.enum([
    CasePriority.NORMAL,
    CasePriority.URGENT,
    CasePriority.HIGH,
  ]),
  stage: z.enum([CaseStage.PRELIMINARY, CaseStage.TRIAL, CaseStage.FINAL]),
  isPublic: z.boolean(),
  isSensitive: z.boolean(),
});

type CaseFormData = z.infer<typeof caseSchema>;

export default function CaseCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCase();

  // Fetch Courts
  const { data: courtsData } = useGetCourts();
  const courts = courtsData?.data ?? [];

  // Fetch Case Types
  const { data: caseTypesData } = useQuery({
    queryKey: ["case-types"],
    queryFn: async () => {
      const res = await axiosInstance.get("/case-types");
      return res.data;
    },
  });
  const caseTypes = caseTypesData?.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      status: CaseStatus.FILED,
      priority: CasePriority.NORMAL,
      stage: CaseStage.PRELIMINARY,
      isPublic: true,
      isSensitive: false,
      filingDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: CaseFormData) => {
    try {
      await createMutation.mutateAsync(data);
      navigate("/cases");
    } catch (err) {
      console.error("Create case error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/cases">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Create New Case
          </h1>
          <p className="text-text-secondary">
            Register a new case in the system
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Case Number & Filing Date */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="caseNumber">
                  Case Number <span className="text-status-error">*</span>
                </Label>
                <Input
                  id="caseNumber"
                  placeholder="e.g., CASE/2024/001"
                  {...register("caseNumber")}
                  className={errors.caseNumber ? "border-status-error" : ""}
                />
                {errors.caseNumber && (
                  <p className="text-sm text-status-error">
                    {errors.caseNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="filingDate">
                  Filing Date <span className="text-status-error">*</span>
                </Label>
                <Input
                  id="filingDate"
                  type="date"
                  {...register("filingDate")}
                  className={errors.filingDate ? "border-status-error" : ""}
                />
                {errors.filingDate && (
                  <p className="text-sm text-status-error">
                    {errors.filingDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Case Title <span className="text-status-error">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter case title"
                {...register("title")}
                className={errors.title ? "border-status-error" : ""}
              />
              {errors.title && (
                <p className="text-sm text-status-error">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Brief description of the case..."
                {...register("description")}
              />
            </div>

            {/* Court & Case Type */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  Court <span className="text-status-error">*</span>
                </Label>
                <Controller
                  name="courtId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={errors.courtId ? "border-status-error" : ""}
                      >
                        <SelectValue placeholder="Select court" />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((court: Court) => (
                          <SelectItem key={court._id} value={court._id}>
                            {court.name} ({court.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.courtId && (
                  <p className="text-sm text-status-error">
                    {errors.courtId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Case Type <span className="text-status-error">*</span>
                </Label>
                <Controller
                  name="caseTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          errors.caseTypeId ? "border-status-error" : ""
                        }
                      >
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        {caseTypes.map(
                          (type: {
                            _id: string;
                            name: string;
                            category: string;
                          }) => (
                            <SelectItem key={type._id} value={type._id}>
                              {type.name} - {type.category}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.caseTypeId && (
                  <p className="text-sm text-status-error">
                    {errors.caseTypeId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Status, Priority, Stage */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CaseStatus.FILED}>Filed</SelectItem>
                        <SelectItem value={CaseStatus.ADMITTED}>
                          Admitted
                        </SelectItem>
                        <SelectItem value={CaseStatus.HEARING}>
                          Hearing
                        </SelectItem>
                        <SelectItem value={CaseStatus.JUDGMENT}>
                          Judgment
                        </SelectItem>
                        <SelectItem value={CaseStatus.CLOSED}>
                          Closed
                        </SelectItem>
                        <SelectItem value={CaseStatus.ARCHIVED}>
                          Archived
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CasePriority.NORMAL}>
                          Normal
                        </SelectItem>
                        <SelectItem value={CasePriority.URGENT}>
                          Urgent
                        </SelectItem>
                        <SelectItem value={CasePriority.HIGH}>High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Stage</Label>
                <Controller
                  name="stage"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CaseStage.PRELIMINARY}>
                          Preliminary
                        </SelectItem>
                        <SelectItem value={CaseStage.TRIAL}>Trial</SelectItem>
                        <SelectItem value={CaseStage.FINAL}>Final</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                <div>
                  <Label htmlFor="isPublic" className="text-base font-medium">
                    Public Case
                  </Label>
                  <p className="text-sm text-text-secondary">
                    Make this case visible to the public
                  </p>
                </div>
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isPublic"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                <div>
                  <Label
                    htmlFor="isSensitive"
                    className="text-base font-medium"
                  >
                    Sensitive Case
                  </Label>
                  <p className="text-sm text-text-secondary">
                    Mark this case as sensitive (restricted access)
                  </p>
                </div>
                <Controller
                  name="isSensitive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isSensitive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/cases")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                {isSubmitting ? "Creating..." : "Create Case"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
