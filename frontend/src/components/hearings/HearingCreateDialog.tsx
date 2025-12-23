import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { HearingStatus } from "@/types/api.types";

const hearingSchema = z.object({
  case: z.string().min(1, "Case is required"),
  hearingDate: z.string().min(1, "Hearing date is required"),
  hearingTime: z.string().min(1, "Hearing time is required"),
  courtRoom: z.string().optional(),
  judge: z.string().min(1, "Judge is required"),
  status: z.nativeEnum(HearingStatus).optional(),
  purpose: z.string().optional(),
  remarks: z.string().optional(),
  nextHearingDate: z.string().optional(),
});

type HearingFormData = z.infer<typeof hearingSchema>;

interface HearingCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId?: string; // If creating from case detail page
}

export default function HearingCreateDialog({
  open,
  onOpenChange,
  caseId,
}: HearingCreateDialogProps) {
  const createMutation = useCreateHearing();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<HearingFormData>({
    resolver: zodResolver(hearingSchema),
    defaultValues: {
      case: caseId || "",
      status: HearingStatus.SCHEDULED,
    },
  });

  const onSubmit = async (data: HearingFormData) => {
    await createMutation.mutateAsync(data);
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

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
          {/* Case ID (if not provided) */}
          {!caseId && (
            <div className="space-y-2">
              <Label htmlFor="case">
                Case ID <span className="text-status-error">*</span>
              </Label>
              <Input
                id="case"
                placeholder="Enter case ID or case number"
                {...register("case")}
                className={errors.case ? "border-status-error" : ""}
                disabled={isSubmitting}
              />
              {errors.case && (
                <p className="text-sm text-status-error">
                  {errors.case.message}
                </p>
              )}
              <p className="text-xs text-text-secondary">
                Note: In production, this should be a searchable dropdown
              </p>
            </div>
          )}

          {/* Date & Time Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hearingDate">
                Hearing Date <span className="text-status-error">*</span>
              </Label>
              <Input
                id="hearingDate"
                type="date"
                {...register("hearingDate")}
                className={errors.hearingDate ? "border-status-error" : ""}
                disabled={isSubmitting}
              />
              {errors.hearingDate && (
                <p className="text-sm text-status-error">
                  {errors.hearingDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hearingTime">
                Hearing Time <span className="text-status-error">*</span>
              </Label>
              <Input
                id="hearingTime"
                type="time"
                {...register("hearingTime")}
                className={errors.hearingTime ? "border-status-error" : ""}
                disabled={isSubmitting}
              />
              {errors.hearingTime && (
                <p className="text-sm text-status-error">
                  {errors.hearingTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Court Room */}
          <div className="space-y-2">
            <Label htmlFor="courtRoom">Court Room (Optional)</Label>
            <Input
              id="courtRoom"
              placeholder="e.g., Court Room 3"
              {...register("courtRoom")}
              disabled={isSubmitting}
            />
          </div>

          {/* Judge */}
          <div className="space-y-2">
            <Label htmlFor="judge">
              Judge <span className="text-status-error">*</span>
            </Label>
            <Input
              id="judge"
              placeholder="Enter judge ID or name"
              {...register("judge")}
              className={errors.judge ? "border-status-error" : ""}
              disabled={isSubmitting}
            />
            {errors.judge && (
              <p className="text-sm text-status-error">
                {errors.judge.message}
              </p>
            )}
            <p className="text-xs text-text-secondary">
              Note: In production, this should be a searchable dropdown
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              defaultValue={HearingStatus.SCHEDULED}
              onValueChange={(value) =>
                setValue("status", value as HearingStatus)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={HearingStatus.SCHEDULED}>
                  Scheduled
                </SelectItem>
                <SelectItem value={HearingStatus.IN_PROGRESS}>
                  In Progress
                </SelectItem>
                <SelectItem value={HearingStatus.COMPLETED}>
                  Completed
                </SelectItem>
                <SelectItem value={HearingStatus.POSTPONED}>
                  Postponed
                </SelectItem>
                <SelectItem value={HearingStatus.CANCELLED}>
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose (Optional)</Label>
            <Textarea
              id="purpose"
              placeholder="Brief description of the hearing purpose..."
              rows={3}
              {...register("purpose")}
              disabled={isSubmitting}
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Any additional notes..."
              rows={2}
              {...register("remarks")}
              disabled={isSubmitting}
            />
          </div>

          {/* Next Hearing Date */}
          <div className="space-y-2">
            <Label htmlFor="nextHearingDate">
              Next Hearing Date (Optional)
            </Label>
            <Input
              id="nextHearingDate"
              type="date"
              {...register("nextHearingDate")}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Scheduling..." : "Schedule Hearing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
