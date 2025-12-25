import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Gavel,
  Eye,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export default function PublicCaseDetailPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["public-case", id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/cases/${id}`);
      return response.data;
    },
  });

  const caseData = data?.data;

  if (isLoading) return <div>Loading...</div>;
  if (!caseData) return <div>Case not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/public/cases"
            className="flex items-center gap-2 text-blue-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cases
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-8 border">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Case Number</p>
              <h1 className="text-3xl font-bold font-mono text-blue-900">
                {caseData.caseNumber}
              </h1>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
              {caseData.status}
            </span>
          </div>

          <h2 className="text-2xl font-semibold mb-4">{caseData.title}</h2>

          {caseData.description && (
            <p className="text-gray-700 mb-6">{caseData.description}</p>
          )}

          <div className="grid md:grid-cols-2 gap-6 py-6 border-t">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Court</p>
                <p className="font-semibold">{caseData.court?.name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Gavel className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Case Type</p>
                <p className="font-semibold">
                  {caseData.caseType?.name || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Filing Date</p>
                <p className="font-semibold">
                  {new Date(caseData.filingDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="font-semibold">{caseData.totalViews || 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This is a public case record. For full case
              details including documents and hearings, please{" "}
              <Link to="/login" className="underline">
                sign in
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
