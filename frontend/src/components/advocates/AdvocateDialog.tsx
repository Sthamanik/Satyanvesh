import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Advocate } from "@/types/api.types";

// Schema matching backend requirements
const advocateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  barCouncilId: z.string().min(1, "Bar Council ID is required").toUpperCase(),
  licenseNumber: z.string().min(1, "License number is required").toUpperCase(),
  specialization: z.string().optional(), // We'll handle CSV string -> array
  experience: z.number().min(0, "Experience cannot be negative"),
  firmName: z.string().optional(),
  firmAddress: z.string().optional(),
  enrollmentDate: z.string().min(1, "Enrollment Date is required"),
});

type AdvocateFormValues = z.infer<typeof advocateSchema>;

interface AdvocateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => Promise<void>; // Any because we transform specialization
  initialData?: Advocate;
  isSubmitting?: boolean;
}

export default function AdvocateDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: AdvocateDialogProps) {
  const form = useForm<AdvocateFormValues>({
    resolver: zodResolver(advocateSchema),
    defaultValues: {
      userId: "",
      barCouncilId: "",
      licenseNumber: "",
      specialization: "",
      experience: 0,
      firmName: "",
      firmAddress: "",
      enrollmentDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          userId: typeof initialData.userId === 'object' ? (initialData.userId as any)._id : initialData.userId,
          barCouncilId: initialData.barCouncilId,
          licenseNumber: initialData.licenseNumber,
          specialization: initialData.specialization?.join(", ") || "",
          experience: initialData.experience,
          firmName: initialData.firmName || "",
          firmAddress: initialData.firmAddress || "",
          // Handle date string (might com as ISO)
          enrollmentDate: initialData.enrollmentDate ? new Date(initialData.enrollmentDate).toISOString().split('T')[0] : "",
        });
      } else {
        form.reset({
          userId: "",
          barCouncilId: "",
          licenseNumber: "",
          specialization: "",
          experience: 0,
          firmName: "",
          firmAddress: "",
          enrollmentDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: AdvocateFormValues) => {
    try {
      // Transform specialization string to array
      const payload = {
        ...values,
        specialization: values.specialization 
          ? values.specialization.split(",").map(s => s.trim()).filter(s => s) 
          : [],
      };
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent
    }
  };

  const isEditing = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Advocate" : "Register Advocate"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update advocate details."
              : "Register a new advocate. Requires a valid User ID."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!isEditing && (
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="User ObjectId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="barCouncilId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bar Council ID</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. BC-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. LIC-9876" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Experience (Years)</FormLabel>
                        <FormControl>
                            <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="enrollmentDate"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Enrollment Date</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations (Comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Civil, Criminal, Corporate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="firmName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Firm Name (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Legal Firm LLC" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="firmAddress"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Firm Address (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Kathmandu, Nepal" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Save Changes" : "Register Advocate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
