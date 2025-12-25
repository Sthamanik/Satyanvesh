import { useState } from "react";
import { Users, Award } from "lucide-react";
import { useGetAdvocates } from "@/hooks/useAdvocates";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Advocate, User } from "@/types/api.types";

/* ------------------------------------------------------------------ */
/* Type Guards */
/* ------------------------------------------------------------------ */

function isUser(user: string | User | undefined): user is User {
  return typeof user === "object" && user !== null;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function AdvocatesListPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAdvocates();

  const advocates: Advocate[] = Array.isArray(data?.data) ? data.data : [];

  const filteredAdvocates = advocates.filter((adv) => {
    if (!isUser(adv.user)) return false;
    return adv.user.fullName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Advocates</h1>
        <p className="text-gray-600 mt-1">Browse registered advocates</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search advocates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div>Loading advocates...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAdvocates.map((adv) => {
            const user = isUser(adv.user) ? adv.user : undefined;

            return (
              <Card key={adv._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-900" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {user?.fullName ?? "Unknown Advocate"}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span>{adv.experience} years experience</span>
                    </div>

                    {adv.specialization && adv.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {adv.specialization.slice(0, 3).map((spec) => (
                          <Badge
                            key={spec}
                            variant="outline"
                            className="text-xs"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
