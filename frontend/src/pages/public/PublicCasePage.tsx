import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Building2, Eye, Scale } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/* =======================
   Types
======================= */

interface Court {
  name: string;
}

type CaseStatus =
  | "registered"
  | "pending"
  | "under_hearing"
  | "decided"
  | "disposed";

interface PublicCase {
  _id: string;
  caseNumber: string;
  title: string;
  status: CaseStatus;
  court?: Court;
  totalViews?: number;
}

interface FetchCasesParams {
  page: number;
  limit: number;
  search?: string;
  status?: CaseStatus;
}

/* =======================
   API
======================= */

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const fetchPublicCases = async (params: FetchCasesParams) => {
  const response = await axios.get(`${API_URL}/cases`, {
    params: {
      ...params,
      filter: JSON.stringify({ isPublic: true }),
    },
  });

  return response.data as {
    data: PublicCase[];
    total: number;
  };
};

/* =======================
   Helpers
======================= */

const getStatusColor = (status: CaseStatus) => {
  const colors: Record<CaseStatus, string> = {
    registered: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    under_hearing: "bg-purple-100 text-purple-800",
    decided: "bg-green-100 text-green-800",
    disposed: "bg-gray-100 text-gray-800",
  };
  return colors[status];
};

/* =======================
   Component
======================= */

export default function PublicCasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page] = useState(1); // pagination UI not implemented yet

  const { data, isLoading } = useQuery({
    queryKey: ["public-cases", page, searchQuery],
    queryFn: () =>
      fetchPublicCases({
        page,
        limit: 12,
        search: searchQuery || undefined,
      }),
  });

  const cases = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Satyanvesh</h1>
          </Link>

          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-gray-700">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-900 text-white rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Public Case Records</h1>
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {cases.map((item) => (
              <Link key={item._id} to={`/public/cases/${item._id}`}>
                <div className="bg-white rounded-lg p-6 border hover:shadow-lg transition">
                  <div className="flex justify-between mb-3">
                    <span className="font-mono font-bold text-blue-900">
                      {item.caseNumber}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {item.court?.name ?? "Unknown Court"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {item.totalViews ?? 0} views
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
