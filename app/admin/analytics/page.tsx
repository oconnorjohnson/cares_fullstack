import { auth } from "@clerk/nextjs";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import PrePostAnalysis from "@/components/admin/dashboard/pre-post-analysis";
import RequestsByAgency from "@/components/admin/dashboard/reqs-by-agency";
import FundTypePopularity from "@/components/admin/dashboard/fund-type-popularity";
import DollarsSpent from "@/components/admin/dashboard/dollars-spent";
import PercentRequestStatus from "@/components/admin/dashboard/percent-request-status";
import AnalyticsDateFilter from "@/components/admin/dashboard/analytics-date-filter";
import {
  getPreScreenAverages,
  getPostScreenAverages,
  getAgencyRequestPercentages,
  GetPercentageOfRequestsByAgency,
  GetPercentageOfRequestsByFundType,
  GetDollarsSpentByFundType,
  GetTotalRFFDollarsSpent,
  GetPercentageOfRequestsByStatus,
  GetSDOHPercentages,
  GetPaidFundPercentagesByRace,
  GetPrePostScreenChanges,
  GetIncreasedScoresAnalysis,
  GetPrePostPostChangeClientCount,
} from "@/server/actions/calculations/actions";
import { CountRequestsCompleted } from "@/server/actions/count/actions";
import type { AnswerCategories } from "@/server/actions/calculations/actions";
import SDOHCategoryDistribution from "@/components/admin/dashboard/sdoh-category-distribution";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default async function Analytics({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string };
}) {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;

  // Extract date params from URL
  const startDate = searchParams.startDate || null;
  const endDate = searchParams.endDate || null;

  const [
    totalRequests,
    percentagesByAssetTypeAndAgency,
    preAnswers,
    postAnswers,
    dollarsSpentByFundType,
    agencyPercentagesRaw,
    totalRFFDollarsSpent,
    percentagesByStatus,
    sdohPercentages,
    prePostChanges,
    paidFundsByRace,
    scoreAnalysis,
    prePostPostChangeClientCount,
  ] = await Promise.all([
    CountRequestsCompleted(),
    GetPercentageOfRequestsByFundType(),
    getPreScreenAverages(startDate, endDate),
    getPostScreenAverages(startDate, endDate),
    GetDollarsSpentByFundType(),
    GetPercentageOfRequestsByAgency(),
    GetTotalRFFDollarsSpent(),
    GetPercentageOfRequestsByStatus(),
    GetSDOHPercentages(),
    GetPrePostScreenChanges(),
    GetPaidFundPercentagesByRace(),
    GetIncreasedScoresAnalysis(),
    GetPrePostPostChangeClientCount(),
  ]);
  console.log(sdohPercentages);
  console.log(
    "total clients who saw a decrease in their scores:",
    prePostPostChangeClientCount,
  );
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
  console.log("prePostChanges", prePostChanges);
  console.log("paidFundsByRace", paidFundsByRace);
  const agencyPercentages = convertAgencyData(agencyPercentagesRaw);
  console.log("scoreAnalysis", scoreAnalysis);
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
        <div className="flex flex-row sm:h-screen w-screen">
          <SideNavBar />
          <ScrollArea className="w-full h-full">
            <AnalyticsDateFilter />
            <div className="flex flex-col sm:grid sm:grid-cols-3 w-full gap-4 py-4 px-4">
              <DollarsSpent
                totalSpent={totalRFFDollarsSpent}
                chartData={dollarsSpentChartData}
              />
              <PercentRequestStatus chartData={percentagesByStatus} />
              <SDOHCategoryDistribution chartData={sdohPercentages} />
              <PrePostAnalysis chartData={prePostChartData} />
              <RequestsByAgency
                totalRequests={totalRequests!}
                chartData={agencyPercentages}
              />
              <FundTypePopularity chartData={fundPopChartData} />
              <div className="py-2" />
            </div>
          </ScrollArea>
        </div>
      </>
    );
  }
}
