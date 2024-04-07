import { auth } from "@clerk/nextjs";
import SideNavBar from "@/components/admin/dashboard/side-nav";
import PrePostAnalysis from "@/components/admin/dashboard/pre-post-analysis";
import {
  getPreScreenAverages,
  getPostScreenAverages,
} from "@/server/actions/calculations/actions";
import type { AnswerCategories } from "@/server/actions/calculations/actions";
function getCategoryValue(
  category: keyof AnswerCategories,
  data: AnswerCategories,
): number {
  return data[category];
}
export default async function Analytics() {
  const { sessionClaims } = auth();
  const isAdmin = (sessionClaims?.publicMetadata as any)?.admin;
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
  if (!isAdmin) {
    return <div>Not authenticated</div>;
  } else {
    return (
      <>
        <div className="flex flex-row">
          <SideNavBar />
          <div className="flex border-t flex-col w-5/6">
            <div className="flex flex-col pb-10 w-full px-10">
              <PrePostAnalysis chartData={chartData} />
              {/* <RequestsTimeGraph AgencyData={agencyDataWithNames} /> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}
