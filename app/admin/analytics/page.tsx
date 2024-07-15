import { auth } from "@clerk/nextjs";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import PrePostAnalysis from "@/components/admin/dashboard/pre-post-analysis";
import RequestsByAgency from "@/components/admin/dashboard/reqs-by-agency";
import FundTypePopularity from "@/components/admin/dashboard/fund-type-popularity";
import DollarsSpent from "@/components/admin/dashboard/dollars-spent";
import {
  getPreScreenAverages,
  getPostScreenAverages,
  getAgencyRequestPercentages,
  GetPercentageOfRequestsByAgency,
  GetPercentageOfRequestsByFundType,
  GetDollarsSpentByFundType,
  GetTotalRFFDollarsSpent,
} from "@/server/actions/calculations/actions";
import { CountRequestsCompleted } from "@/server/actions/count/actions";
import type { AnswerCategories } from "@/server/actions/calculations/actions";
function getCategoryValue(
  prePostCategories: keyof AnswerCategories,
  data: AnswerCategories,
): number {
  return data[prePostCategories];
}

const agencyIdToNameMap: { [key: number]: string } = {
  1: "Public Defender",
  3: "Probation",
  4: "RJP",
  5: "AIC",
  6: "Other",
  7: "District Attorney",
  8: "Conflict Panel",
};

const fundTypeIdToNameMap: { [key: number]: string } = {
  1: "Walmart Gift Card",
  2: "Arco Gift Card",
  3: "Bus Pass",
  4: "Cash",
  5: "Invoice",
  6: "Check",
};

interface AgencyPercentageData {
  agencyId: number;
  percentage: number;
}

function convertAgencyData(agencyData: AgencyPercentageData[]) {
  return agencyData.map(({ agencyId, percentage }) => ({
    agencyName: agencyIdToNameMap[agencyId] || "Unknown Agency",
    percentage,
  }));
}

export default async function Analytics() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;

  const [
    totalRequests,
    percentages,
    percentagesByAssetTypeAndAgency,
    preAnswers,
    postAnswers,
    dollarsSpentByFundType,
    agencyPercentagesRaw,
    totalRFFDollarsSpent,
  ] = await Promise.all([
    CountRequestsCompleted(),
    GetPercentageOfRequestsByAgency(),
    GetPercentageOfRequestsByFundType(),
    getPreScreenAverages(),
    getPostScreenAverages(),
    GetDollarsSpentByFundType(),
    GetPercentageOfRequestsByAgency(),
    GetTotalRFFDollarsSpent(),
  ]);

  const prePostCategories: (keyof AnswerCategories)[] = [
    "housingSituation",
    "housingQuality",
    "utilityStress",
    "foodInsecurityStress",
    "foodMoneyStress",
    "transpoConfidence",
    "transpoStress",
    "financialDifficulties",
  ];
  // const agencyPercentagesRaw = await getAgencyRequestPercentages();

  const agencyPercentages = convertAgencyData(agencyPercentagesRaw);

  const prePostChartData = prePostCategories.map((category) => ({
    category,
    preValue: getCategoryValue(category, preAnswers),
    postValue: getCategoryValue(category, postAnswers),
  }));

  const fundPopChartData = percentagesByAssetTypeAndAgency.map(
    ({ fundTypeId, percentage }) => ({
      fundTypeId,
      percentage,
      fundTypeName: fundTypeIdToNameMap[fundTypeId],
    }),
  );

  const dollarsSpentChartData = dollarsSpentByFundType.map(
    ({ fundTypeId, dollars }) => ({
      fundTypeId,
      dollars,
      fundTypeName: fundTypeIdToNameMap[fundTypeId],
    }),
  );

  if (!isAdmin) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row sm:h-screen">
          <SideNavBar />
          <div className="flex flex-col sm:grid sm:grid-cols-3 border-t flex-col w-5/6 gap-4 py-4 px-4">
            <PrePostAnalysis chartData={prePostChartData} />

            <RequestsByAgency
              totalRequests={totalRequests!}
              chartData={agencyPercentages}
            />

            <FundTypePopularity chartData={fundPopChartData} />

            <DollarsSpent
              totalSpent={totalRFFDollarsSpent}
              chartData={dollarsSpentChartData}
            />

            <RequestsByAgency
              totalRequests={totalRequests!}
              chartData={agencyPercentages}
            />

            <PrePostAnalysis chartData={prePostChartData} />
            <div className="py-4" />
          </div>
        </div>
      </>
    );
  }
}
