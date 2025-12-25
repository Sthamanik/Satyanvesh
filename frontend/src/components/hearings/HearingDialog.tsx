import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { HearingPurpose, HearingStatus } from "@/types/api.types";
import type { Hearing } from "@/types/api.types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface Judge {
  _id: string;
  fullName: string;
}

interface CaseItem {
  _id: string;
  caseNumber: string;
  title: string;
}

/* ------------------------------------------------------------------ */
/* Schema */
/* ------------------------------------------------------------------ */

const hearingSchema = z.object({
  caseId: z.string().min(1, "Case is required"),
  hearingNumber: z.string().min(1, "Hearing number is required"),
  hearingDate: z.string().min(1, "Hearing date is required"),
  hearingTime: z.string().min(1, "Hearing time is required"),
  judgeId: z.string().min(1, "Judge is required"),
  courtRoom: z.string().optional(),
  purpose: z.nativeEnum(HearingPurpose),
  status: z.nativeEnum(HearingStatus),
  notes: z.string().optional(),
  nextHearingDate: z.string().optional(),
  adjournmentReason: z.string().optional(),
});

type HearingFormData = z.infer<typeof hearingSchema>;

interface HearingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HearingFormData) => Promise<void>;
  initialData?: Hearing;
  caseId?: string; // Pre-selected case ID if coming from Case Details
  isSubmitting?: boolean;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function HearingDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  caseId,
  isSubmitting = false,
}: HearingDialogProps) {
  
  /* ---------------- Queries ---------------- */

  const { data: judgesData } = useQuery({
    queryKey: ["judges"],
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: Judge[] }>(
        "/users/role/judge"
      );
      return res.data;
    },
    enabled: open, // Only fetch when dialog is open
  });

  const judges: Judge[] = judgesData?.data ?? [];

  const { data: casesData } = useQuery({
    queryKey: ["cases-list"],
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: CaseItem[] }>("/cases", {
        params: { limit: 100 },
      });
      return res.data;
    },
    enabled: open && !initialData && !caseId, // Only fetch if we need to select a case
  });

  const cases: CaseItem[] = casesData?.data ?? [];

  /* ---------------- Form ---------------- */

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<HearingFormData>({
    resolver: zodResolver(hearingSchema),
    defaultValues: {
      caseId: caseId ?? "",
      status: HearingStatus.SCHEDULED,
      purpose: HearingPurpose.PRELIMINARY,
      hearingNumber: "",
      hearingDate: "",
      hearingTime: "", 
      judgeId: "",
      courtRoom: "",
      notes: "",
    },
  });

  const selectedStatus = useWatch({ control, name: "status" });

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit Mode
        const date = new Date(initialData.hearingDate);
        const dateStr = date.toISOString().split('T')[0];
        // Time might be separate or part of date. Assuming separate or we extract it.
        // If backend stores full ISO in hearingDate, we extract time.
        // Let's assume we extract HH:MM from the ISO if needed, but schema asks for hearingTime string.
        // If API returns hearingTime separately, good. If not, we parse.
        // Based on previous code, it expects hearingTime field.
         
        reset({
          caseId: typeof initialData.caseId === 'object' ? (initialData.caseId as any)._id : initialData.caseId,
          hearingNumber: initialData.hearingNumber,
          hearingDate: dateStr,
          hearingTime: initialData.hearingTime || "10:00", // Default or from data
          judgeId: typeof initialData.judgeId === 'object' ? (initialData.judgeId as any)._id : initialData.judgeId,
          courtRoom: initialData.courtRoom || "",
          purpose: initialData.purpose,
          status: initialData.status,
          notes: initialData.notes || "",
          nextHearingDate: initialData.nextHearingDate ? new Date(initialData.nextHearingDate).toISOString().split('T')[0] : "",
          adjournmentReason: initialData.adjournmentReason || "",
        });
      } else {
        // Create Mode
        reset({
          caseId: caseId ?? "",
          status: HearingStatus.SCHEDULED,
          purpose: HearingPurpose.PRELIMINARY,
          hearingNumber: `H-${Date.now()}`, // Auto-gen suggestion
          hearingDate: "",
          hearingTime: "",
          judgeId: "",
          courtRoom: "",
          notes: "",
        });
      }
    }
  }, [open, initialData, caseId, reset]);

  /* ---------------- Handlers ---------------- */

  const handleFormSubmit = async (data: HearingFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  const isEditing = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Hearing Details" : "Schedule New Hearing"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
                ? "Update the details for this hearing record." 
                : "Schedule a new hearing session for a case."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Case Selection - only if creates and no caseId provided */}
          {!isEditing && !caseId && (
            <div className="space-y-2">
              <Label>Case *</Label>
              <Controller
                name="caseId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.caseId ? "border-status-error" : ""}
                    >
                      <SelectValue placeholder="Select case" />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.caseNumber} — {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.caseId && <p className="text-sm text-red-500">{errors.caseId.message}</p>}
            </div>
          )}

          {/* Hearing Number */}
          <div className="space-y-2">
            <Label>Hearing Number *</Label>
            <Input {...register("hearingNumber")} />
             {errors.hearingNumber && <p className="text-sm text-red-500">{errors.hearingNumber.message}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" {...register("hearingDate")} />
                 {errors.hearingDate && <p className="text-sm text-red-500">{errors.hearingDate.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>Time *</Label>
                <Input type="time" {...register("hearingTime")} />
                 {errors.hearingTime && <p className="text-sm text-red-500">{errors.hearingTime.message}</p>}
            </div>
          </div>

          {/* Judge & Court Room */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Judge *</Label>
                <Controller
                name="judgeId"
                control={control}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.judgeId ? "border-status-error" : ""}>
                        <SelectValue placeholder="Select judge" />
                    </SelectTrigger>
                    <SelectContent>
                        {judges.map((j) => (
                        <SelectItem key={j._id} value={j._id}>
                            {j.fullName}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )}
                />
                 {errors.judgeId && <p className="text-sm text-red-500">{errors.judgeId.message}</p>}
            </div>
            
            <div className="space-y-2">
                <Label>Court Room</Label>
                 <Input
                    placeholder="e.g. Room 302"
                    {...register("courtRoom")}
                    />
            </div>
          </div>

          {/* Purpose & Status */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Purpose</Label>
                <Controller
                name="purpose"
                control={control}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(HearingPurpose).map((p) => (
                        <SelectItem key={p} value={p}>
                            {p}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )}
                />
            </div>

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
                        {Object.values(HearingStatus).map((s) => (
                        <SelectItem key={s} value={s}>
                            {s}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )}
                />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes..." {...register("notes")} />
          </div>

          {/* Adjournment Fields */}
          {selectedStatus === HearingStatus.ADJOURNED && (
            <div className="p-4 bg-gray-50 rounded-md space-y-4 border">
               <h4 className="text-sm font-medium text-gray-700">Adjournment Details</h4>
               <div className="space-y-2">
                  <Label>Next Hearing Date</Label>
                  <Input type="date" {...register("nextHearingDate")} />
               </div>
               <div className="space-y-2">
                 <Label>Reason</Label>
                  <Textarea
                    placeholder="Reason for adjournment..."
                    {...register("adjournmentReason")}
                />
               </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Schedule Hearing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
