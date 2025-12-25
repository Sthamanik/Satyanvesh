import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { useCreateHearing } from "@/hooks/useHearings";

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

import { HearingPurpose, HearingStatus } from "@/types/api.types";

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

interface HearingCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId?: string;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function HearingCreateDialog({
  open,
  onOpenChange,
  caseId,
}: HearingCreateDialogProps) {
  const createMutation = useCreateHearing();

  /* ---------------- Queries ---------------- */

  const { data: judgesData } = useQuery({
    queryKey: ["judges"],
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: Judge[] }>(
        "/users/role/judge"
      );
      return res.data;
    },
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
    enabled: !caseId,
  });

  const cases: CaseItem[] = casesData?.data ?? [];

  /* ---------------- Form ---------------- */

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<HearingFormData>({
    resolver: zodResolver(hearingSchema),
    defaultValues: {
      caseId: caseId ?? "",
      status: HearingStatus.SCHEDULED,
      purpose: HearingPurpose.PRELIMINARY,
    },
  });

  /* ---------------- Dynamic Defaults (PURE SAFE) ---------------- */

  useEffect(() => {
    if (!open) return;

    reset({
      caseId: caseId ?? "",
      status: HearingStatus.SCHEDULED,
      purpose: HearingPurpose.PRELIMINARY,
      hearingNumber: `H-${Date.now()}`,
    });
  }, [open, caseId, reset]);

  /* ---------------- Watchers ---------------- */

  const selectedStatus = useWatch({
    control,
    name: "status",
  });

  /* ---------------- Handlers ---------------- */

  const onSubmit = async (data: HearingFormData) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Create hearing error:", error);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  /* ---------------- Render ---------------- */

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Hearing</DialogTitle>
          <DialogDescription>
            Schedule a new hearing for a case
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Case */}
          {!caseId && (
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
            </div>
          )}

          {/* Hearing Number */}
          <div className="space-y-2">
            <Label>Hearing Number *</Label>
            <Input {...register("hearingNumber")} />
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input type="date" {...register("hearingDate")} />
            <Input type="time" {...register("hearingTime")} />
          </div>

          {/* Judge & Court Room */}
          <div className="grid md:grid-cols-2 gap-4">
            <Controller
              name="judgeId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
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
            <Input
              placeholder="Court Room (optional)"
              {...register("courtRoom")}
            />
          </div>

          {/* Purpose & Status */}
          <div className="grid md:grid-cols-2 gap-4">
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

          {/* Notes */}
          <Textarea placeholder="Notes (optional)" {...register("notes")} />

          {/* Adjournment Fields */}
          {selectedStatus === HearingStatus.ADJOURNED && (
            <>
              <Input type="date" {...register("nextHearingDate")} />
              <Textarea
                placeholder="Adjournment reason"
                {...register("adjournmentReason")}
              />
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Hearing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
