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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Court } from "@/types/api.types";

const courtSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required").max(10, "Code max 10 chars"),
  type: z.enum(["Supreme", "High", "District", "Magistrate"]), // Match backend specific strings
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

type CourtFormValues = z.infer<typeof courtSchema>;

interface CourtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CourtFormValues) => Promise<void>;
  initialData?: Court;
  isSubmitting?: boolean;
}

export default function CourtDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: CourtDialogProps) {
  const form = useForm<CourtFormValues>({
    resolver: zodResolver(courtSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "District",
      state: "",
      city: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          code: initialData.code || "",
          type: initialData.type as any, // Cast to match enum
          state: initialData.state,
          city: initialData.city,
          address: initialData.address || "",
          contactEmail: initialData.contactEmail || "",
          contactPhone: initialData.contactPhone || "",
        });
      } else {
        form.reset({
          name: "",
          code: "",
          type: "District",
          state: "",
          city: "",
          address: "",
          contactEmail: "",
          contactPhone: "",
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: CourtFormValues) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent
    }
  };

  const isEditing = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Court" : "Add New Court"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the court details here."
              : "Register a new court in the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Court Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Kathmandu District Court" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. KDC" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select court type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Supreme">Supreme Court</SelectItem>
                      <SelectItem value="High">High Court</SelectItem>
                      <SelectItem value="District">District Court</SelectItem>
                      <SelectItem value="Magistrate">Magistrate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Bagmati" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kathmandu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full address..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isEditing ? "Save Changes" : "Create Court"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
