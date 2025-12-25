import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGetCaseById, useUpdateCase } from "@/hooks/useCases";
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

import { CaseStatus, CasePriority, CaseStage } from "@/types/api.types";

// Schema for editing (same as create but with verdict)
const caseEditSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  caseTypeId: z.string().min(1, "Case type is required"),
  courtId: z.string().min(1, "Court is required"),
  status: z.nativeEnum(CaseStatus),
  priority: z.nativeEnum(CasePriority),
  stage: z.nativeEnum(CaseStage),
  isPublic: z.boolean(),
  isSensitive: z.boolean(),
  verdict: z.string().optional(),
  nextHearingDate: z.string().optional(), // Date string from input type="date"
});

type CaseEditFormData = z.infer<typeof caseEditSchema>;

export default function CaseEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { isJudge, isAdmin } = useUserRole(); // Removed unused
  
  const { data: caseRes, isLoading: isLoadingCase } = useGetCaseById(id!);
  const updateMutation = useUpdateCase(id!);

  const caseData = caseRes?.data;

  // Fetch Courts
  const { data: courtsData } = useGetCourts({}); 
  // Access defaults to empty array if data missing
  const courts = courtsData?.data?.courts ?? []; 

  // Fetch Case Types
  const { data: caseTypesData } = useQuery({
    queryKey: ["case-types"],
    queryFn: async () => {
      const res = await axiosInstance.get("/case-types");
      return res.data;
    },
  });
  const caseTypes = caseTypesData?.data?.caseTypes ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CaseEditFormData>({
    resolver: zodResolver(caseEditSchema),
    defaultValues: {
      isPublic: true,
      isSensitive: false,
    },
  });

  // Watch status to conditionally show verdict field
  const status = watch("status");
  const isClosed = status === CaseStatus.JUDGMENT || status === CaseStatus.CLOSED;

  // Populate form when data loads
  useEffect(() => {
    if (caseData) {
      reset({
        title: caseData.title,
        description: caseData.description || "",
        caseTypeId: typeof caseData.caseTypeId === 'object' ? (caseData.caseTypeId as any)._id : caseData.caseTypeId,
        courtId: typeof caseData.courtId === 'object' ? (caseData.courtId as any)._id : caseData.courtId,
        status: caseData.status,
        priority: caseData.priority,
        stage: caseData.stage,
        isPublic: caseData.isPublic,
        isSensitive: caseData.isSensitive,
        verdict: caseData.verdict || "",
        nextHearingDate: caseData.nextHearingDate ? new Date(caseData.nextHearingDate).toISOString().split('T')[0] : "",
      });
    }
  }, [caseData, reset]);

  const onSubmit = async (data: CaseEditFormData) => {
    if (!id) return;
    try {
      // Filter out empty strings for dates
      const payload: any = { ...data };
      if (!payload.nextHearingDate) delete payload.nextHearingDate;
      if (!payload.verdict) delete payload.verdict;

      await updateMutation.mutateAsync(payload);
      navigate(`/cases/${id}`);
    } catch (err) {
      console.error("Update case error:", err);
    }
  };

  if (isLoadingCase) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!caseData) {
    return <div>Case not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/cases/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Edit Case
          </h1>
          <p className="text-text-secondary">
            {caseData.caseNumber}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Case Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Case Title <span className="text-status-error">*</span>
              </Label>
              <Input
                id="title"
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.courtId ? "border-status-error" : ""}>
                        <SelectValue placeholder="Select Court" />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((court: any) => (
                          <SelectItem key={court._id} value={court._id}>
                            {court.name} ({court.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Case Type <span className="text-status-error">*</span>
                </Label>
                <Controller
                  name="caseTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.caseTypeId ? "border-status-error" : ""}>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {caseTypes.map((type: any) => (
                          <SelectItem key={type._id} value={type._id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Status & Priority & Stage */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CaseStatus).map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s.replace("_", " ")}
                          </SelectItem>
                        ))}
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CasePriority).map((p) => (
                          <SelectItem key={p} value={p} className="capitalize">
                            {p}
                          </SelectItem>
                        ))}
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CaseStage).map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

             {/* Next Hearing Date */}
             <div className="space-y-2">
                <Label htmlFor="nextHearingDate">Next Hearing Date</Label>
                <Input
                  id="nextHearingDate"
                  type="date"
                  {...register("nextHearingDate")}
                />
              </div>

            {/* Verdict (Conditional) */}
            {isClosed && (
              <div className="space-y-2 border-l-4 border-brand-primary pl-4 py-2 bg-brand-primary/5 rounded-r">
                <Label htmlFor="verdict" className="text-brand-primary font-bold">
                  Final Verdict / Judgment Summary
                </Label>
                <Textarea
                  id="verdict"
                  rows={6}
                  placeholder="Enter the final verdict or summary of the judgment..."
                  {...register("verdict")}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-text-secondary">
                  Required when status is Judgment or Closed.
                </p>
              </div>
            )}

            {/* Toggles */}
            <div className="flex gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isPublic"
                    />
                  )}
                />
                <Label htmlFor="isPublic">Public Case</Label>
              </div>

              <div className="flex items-center gap-2">
                <Controller
                  name="isSensitive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isSensitive"
                    />
                  )}
                />
                <Label htmlFor="isSensitive">Sensitive Case</Label>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
                {isSubmitting || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
