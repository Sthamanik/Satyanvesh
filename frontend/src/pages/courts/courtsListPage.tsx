import { useState } from "react";
import { Building2, MapPin } from "lucide-react";
import { useGetCourts } from "@/hooks/useCourts";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface Court {
  _id: string;
  name: string;
  type: string;
  state?: string;
  city?: string;
  description?: string;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function CourtsListPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetCourts();

  const courts: Court[] = Array.isArray(data?.data) ? data.data : [];

  const filteredCourts = courts.filter((court) =>
    court.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Courts</h1>
        <p className="text-text-secondary mt-1">
          Browse all courts in the system
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Search courts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div>Loading courts...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourts.map((court) => (
            <Card key={court._id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-900" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{court.name}</h3>
                    <span className="text-xs text-gray-500 uppercase">
                      {court.type}
                    </span>
                  </div>
                </div>

                {court.state && court.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {court.state}, {court.city}
                  </div>
                )}

                {court.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {court.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
