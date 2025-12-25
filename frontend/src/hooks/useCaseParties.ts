import { useQuery } from "@tanstack/react-query";
import { casePartiesApi } from "@/api/caseParties.api";
import { queryKeys } from "@/lib/react-query";

export const useGetCaseParties = (caseId: string) => {
  return useQuery({
    queryKey: queryKeys.caseParties.byCase(caseId),
    queryFn: () => casePartiesApi.getCaseParties(caseId),
    enabled: !!caseId,
  });
};

