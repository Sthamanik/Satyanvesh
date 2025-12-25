import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCreateCase } from "@/hooks/useCases";
import { useGetCourts } from "@/hooks/useCourts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

import { CaseStatus } from "@/types/api.types";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface Court {
  _id: string;
  name: string;
}

interface CaseType {
  _id: string;
  name: string;
  category: string;
}

interface Judge {
  _id: string;
  fullName: string;
}

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

/* ------------------------------------------------------------------ */
/* Zod Schema (NO nativeEnum – NOT deprecated) */
/* ------------------------------------------------------------------ */

const caseSchema = z.object({
  caseNumber: z.string().min(1, "Case number is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  filingDate: z.string().min(1, "Filing date is required"),
  status: z.enum([
    CaseStatus.REGISTERED,
    CaseStatus.PENDING,
    CaseStatus.UNDER_HEARING,
    CaseStatus.RESERVED,
    CaseStatus.DECIDED,
    CaseStatus.DISPOSED,
  ]),
  caseType: z.string().min(1, "Case type is required"),
  court: z.string().min(1, "Court is required"),
  judge: z.string().optional(),
  isPublic: z.boolean(),
});

type CaseFormData = z.infer<typeof caseSchema>;

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function CaseCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCase();

  /* ---------------------------- Fetch Courts ---------------------------- */

  const { data: courtsData } = useGetCourts();
  const courts: Court[] = courtsData?.data ?? [];

  /* -------------------------- Fetch Case Types -------------------------- */

  const { data: caseTypesData } = useQuery<{ data: CaseType[] }>({
    queryKey: ["case-types"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_URL}/case-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const caseTypes = caseTypesData?.data ?? [];

  /* ---------------------------- Fetch Judges ---------------------------- */

  const { data: judgesData } = useQuery<{ data: Judge[] }>({
    queryKey: ["judges"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_URL}/users/role/judge`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const judges = judgesData?.data ?? [];

  /* ---------------------------- React Hook Form ---------------------------- */

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      status: CaseStatus.REGISTERED,
      isPublic: false,
      filingDate: new Date().toISOString().split("T")[0],
    },
  });

  /* ---------------------------- Submit ---------------------------- */

  const onSubmit = async (data: CaseFormData) => {
    try {
      await createMutation.mutateAsync(data);
      navigate("/cases");
    } catch (err) {
      console.error("Create case error:", err);
    }
  };

  /* ------------------------------------------------------------------ */
  /* UI */
  /* ------------------------------------------------------------------ */

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
          <h1 className="text-3xl font-bold">Create New Case</h1>
          <p className="text-gray-600">Register a new case</p>
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
              <div>
                <Label>Case Number *</Label>
                <Input {...register("caseNumber")} />
                {errors.caseNumber && (
                  <p className="text-red-600 text-sm">
                    {errors.caseNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Filing Date *</Label>
                <Input type="date" {...register("filingDate")} />
              </div>
            </div>

            {/* Title */}
            <div>
              <Label>Title *</Label>
              <Input {...register("title")} />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea rows={4} {...register("description")} />
            </div>

            {/* Court & Case Type */}
            <div className="grid md:grid-cols-2 gap-6">
              <Controller
                name="court"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((court) => (
                        <SelectItem key={court._id} value={court._id}>
                          {court.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="caseType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((type) => (
                        <SelectItem key={type._id} value={type._id}>
                          {type.name} ({type.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Status & Judge */}
            <div className="grid md:grid-cols-2 gap-6">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CaseStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="judge"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select judge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {judges.map((judge) => (
                        <SelectItem key={judge._id} value={judge._id}>
                          {judge.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Public */}
            <Controller
              name="isPublic"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/cases")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Case"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
