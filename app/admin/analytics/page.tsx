import { auth } from "@clerk/nextjs";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import PrePostAnalysis from "@/components/admin/dashboard/pre-post-analysis";
import RequestsByAgency from "@/components/admin/dashboard/reqs-by-agency";
import FundTypePopularity from "@/components/admin/dashboard/fund-type-popularity";
import {
  getPreScreenAverages,
  getPostScreenAverages,
  getAgencyRequestPercentages,
  GetPercentageOfRequestsByAgency,
  GetPercentageOfRequestsByFundType,
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
  const totalRequests = await CountRequestsCompleted();
  const percentages = await GetPercentageOfRequestsByAgency();
  const percentagesByAssetTypeAndAgency =
    await GetPercentageOfRequestsByFundType();
  const preAnswers: AnswerCategories = await getPreScreenAverages();
  const postAnswers: AnswerCategories = await getPostScreenAverages();
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
  const agencyPercentagesRaw = await GetPercentageOfRequestsByAgency();
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

  if (!isAdmin) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex flex-col border-t flex-col w-5/6">
            <div className="flex flex-col sm:flex-row py-8 w-full px-10 ">
              <PrePostAnalysis chartData={prePostChartData} />
              <div className="px-4" />
              <RequestsByAgency
                totalRequests={totalRequests!}
                chartData={agencyPercentages}
              />
              <div className="px-4" />
              <FundTypePopularity chartData={fundPopChartData} />
            </div>
            <div className="flex flex-col sm:flex-row pb-4 w-full px-10 ">
              <PrePostAnalysis chartData={prePostChartData} />
              <div className="px-4" />
              <RequestsByAgency
                totalRequests={totalRequests!}
                chartData={agencyPercentages}
              />
              <div className="px-4" />
              <PrePostAnalysis chartData={prePostChartData} />
            </div>
          </div>
        </div>
      </>
    );
  }
}
