import { useGetCaseParties } from "@/hooks/useCaseParties";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Mail, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CasePartiesPageProps {
  caseId: string;
}

export default function CasePartiesPage({ caseId }: CasePartiesPageProps) {
  const { data, isLoading, error } = useGetCaseParties(caseId);

  const parties = data?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-status-error">Failed to load case parties</p>
        </CardContent>
      </Card>
    );
  }

  if (parties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-text-secondary">
            No parties have been added to this case yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {parties.map((party: any) => (
        <Card key={party._id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {party.partyType === "organization" ? (
                    <Building2 className="w-5 h-5 text-blue-700" />
                  ) : (
                    <User className="w-5 h-5 text-blue-700" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{party.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {party.role}
                  </Badge>
                </div>
              </div>
              <Badge className={party.partyType === "individual" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}>
                {party.partyType}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              {party.email && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="w-4 h-4" />
                  <span>{party.email}</span>
                </div>
              )}
              {party.phone && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Phone className="w-4 h-4" />
                  <span>{party.phone}</span>
                </div>
              )}
              {party.address && (
                <p className="text-text-secondary mt-2">
                  <span className="font-medium">Address:</span> {party.address}
                </p>
              )}
            </div>

            {party.advocate && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-text-secondary">
                  <span className="font-medium">Represented by:</span>{" "}
                  {typeof party.advocate === "object"
                    ? (party.advocate as any).userId?.fullName || "N/A"
                    : party.advocate}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
