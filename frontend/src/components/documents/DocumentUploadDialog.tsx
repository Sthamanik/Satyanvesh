import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, FileText } from "lucide-react";
import { useUploadDocument } from "@/hooks/useDocument";
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
import { Switch } from "@/components/ui/switch";
import { DocumentType } from "@/types/api.types";
import {
  formatFileSize,
  validateFileSize,
  validateFileType,
} from "@/lib/utils";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  type: z.string().min(1, "Document type is required"),
  description: z.string().max(500, "Description is too long").optional(),
  isPublic: z.boolean(),
  document: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Document file is required")
    .refine(
      (files) => validateFileSize(files[0], 10),
      "Document must be less than 10MB"
    )
    .refine(
      (files) =>
        validateFileType(files[0], [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/jpg",
          "image/png",
        ]),
      "Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed"
    ),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface DocumentUploadDialogProps {
  caseId: string;
  hearingId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DocumentUploadDialog({
  caseId,
  hearingId,
  open,
  onOpenChange,
}: DocumentUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadMutation = useUploadDocument();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      isPublic: false,
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    // Reset the file input by creating an empty FileList
    const fileInput = document.getElementById("document") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle form submission
  const onSubmit = async (data: UploadFormData) => {
    const payload = {
      caseId,
      hearingId,
      title: data.title,
      type: data.type,
      isPublic: data.isPublic,
      description: data.description,
      document: data.document[0],
    };

    await uploadMutation.mutateAsync(payload);

    // Reset form and close dialog
    reset();
    setSelectedFile(null);
    onOpenChange(false);
  };

  // Handle dialog close
  const handleClose = () => {
    reset();
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document for this case. Maximum file size is 10MB.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Document Title <span className="text-status-error">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Petition for Special Leave"
              {...register("title")}
              className={errors.title ? "border-status-error" : ""}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-status-error">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Document Type <span className="text-status-error">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("type", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.type ? "border-status-error" : ""}
              >
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DocumentType.PETITION}>Petition</SelectItem>
                <SelectItem value={DocumentType.RESPONSE}>Response</SelectItem>
                <SelectItem value={DocumentType.EVIDENCE}>Evidence</SelectItem>
                <SelectItem value={DocumentType.ORDER}>Order</SelectItem>
                <SelectItem value={DocumentType.JUDGMENT}>Judgment</SelectItem>
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
            {errors.type && (
              <p className="text-sm text-status-error">{errors.type.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document..."
              rows={3}
              {...register("description")}
              className={errors.description ? "border-status-error" : ""}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-status-error">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="document">
              Document File <span className="text-status-error">*</span>
            </Label>

            {!selectedFile ? (
              <div className="border-2 border-dashed border-background-secondary rounded-lg p-8 text-center hover:border-brand-primary transition-colors">
                <Upload className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-sm text-text-secondary mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-text-secondary mb-4">
                  PDF, DOC, DOCX, JPG, JPEG, PNG (max 10MB)
                </p>
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  {...register("document")}
                  onChange={(e) => {
                    register("document").onChange(e);
                    handleFileChange(e);
                  }}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <Label htmlFor="document">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>Choose File</span>
                  </Button>
                </Label>
              </div>
            ) : (
              <div className="border border-background-secondary rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-background-secondary rounded flex items-center justify-center">
                      <FileText className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            {errors.document && (
              <p className="text-sm text-status-error">
                {errors.document.message}
              </p>
            )}
          </div>

          {/* Public Visibility Toggle */}
          <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic" className="text-base font-medium">
                Public Document
              </Label>
              <p className="text-sm text-text-secondary">
                Make this document visible to the public
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
                  disabled={isSubmitting}
                />
              )}
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
              {isSubmitting ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
