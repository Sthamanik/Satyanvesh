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
import { CaseCategory } from "@/types/api.types";
import { Loader2 } from "lucide-react";
import type { CaseType } from "@/types/api.types";

const caseTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required").max(10, "Code is too long"),
  category: z.nativeEnum(CaseCategory),
  description: z.string().optional(),
});

type CaseTypeFormValues = z.infer<typeof caseTypeSchema>;

interface CaseTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CaseTypeFormValues) => Promise<void>;
  initialData?: CaseType;
  isSubmitting?: boolean;
}

export default function CaseTypeDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}: CaseTypeDialogProps) {
  const form = useForm<CaseTypeFormValues>({
    resolver: zodResolver(caseTypeSchema),
    defaultValues: {
      name: "",
      code: "",
      category: CaseCategory.CIVIL,
      description: "",
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          code: initialData.code,
          category: initialData.category,
          description: initialData.description || "",
        });
      } else {
        form.reset({
          name: "",
          code: "",
          category: CaseCategory.CIVIL,
          description: "",
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: CaseTypeFormValues) => {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Case Type" : "Add Case Type"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the case type here."
              : "Add a new case type to the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Writ Petition" {...field} />
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
                    <Input placeholder="e.g. WP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CaseCategory.CIVIL}>Civil</SelectItem>
                      <SelectItem value={CaseCategory.CRIMINAL}>
                        Criminal
                      </SelectItem>
                      <SelectItem value={CaseCategory.FAMILY}>Family</SelectItem>
                      <SelectItem value={CaseCategory.CONSTITUTIONAL}>
                        Constitutional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this case type..."
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
                {isEditing ? "Save Changes" : "Create Case Type"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
