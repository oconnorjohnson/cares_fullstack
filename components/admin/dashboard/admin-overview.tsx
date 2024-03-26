import {
  PendingCard,
  CompletedCard,
  DeniedCard,
  RequestsTimeGraph,
} from "@/components/admin/dashboard/cards";
import {
  CountRequestsPendingApproval,
  CountRequestsCompleted,
  CountRequestsDenied,
  CountRequestsByAgency,
} from "@/server/actions/count/actions";
import {
  getPreScreenAverages,
  getPostScreenAverages,
} from "@/server/actions/calculations/actions";
import type { AnswerCategories } from "@/server/actions/calculations/actions";
import PrePostAnalysis from "@/components/admin/dashboard/pre-post-analysis";
function getCategoryValue(
  category: keyof AnswerCategories,
  data: AnswerCategories,
): number {
  return data[category];
}
export default async function AdminOverview() {
  const pendingRequests = (await CountRequestsPendingApproval()) ?? 0;
  const completedRequests = (await CountRequestsCompleted()) ?? 0;
  const deniedRequests = (await CountRequestsDenied()) ?? 0;
  const agencyDataWithNames = (await CountRequestsByAgency()) ?? 0;
  const preAnswers: AnswerCategories = await getPreScreenAverages();
  const postAnswers: AnswerCategories = await getPostScreenAverages();
  const categories: (keyof AnswerCategories)[] = [
    "housingSituation",
    "housingQuality",
    "utilityStress",
    "foodInsecurityStress",
    "foodMoneyStress",
    "transpoConfidence",
    "transpoStress",
    "financialDifficulties",
  ];

  const chartData = categories.map((category) => ({
    category,
    preValue: getCategoryValue(category, preAnswers),
    postValue: getCategoryValue(category, postAnswers),
  }));

  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-3 py-10 w-full gap-10 px-10">
        <PendingCard pendingRequests={pendingRequests} />
        <CompletedCard completedRequests={completedRequests} />
        <DeniedCard deniedRequests={deniedRequests} />
      </div>
      <div className="flex flex-col pb-10 w-full px-10">
        <PrePostAnalysis chartData={chartData} />
        {/* <RequestsTimeGraph AgencyData={agencyDataWithNames} /> */}
      </div>
    </>
  );
}
