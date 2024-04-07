import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardOne from "@/components/admin/dashboard/news-card-one";
import CardTwo from "@/components/admin/dashboard/news-card-two";
import CardThree from "@/components/admin/dashboard/news-card-three";
import {
  getNewsCardOne,
  getNewsCardTwo,
  getNewsCardThree,
} from "@/server/supabase/functions/read";

export type NewsCard = {
  card_title: string;
  card_description: string;
  card_content: string;
};

export default async function NewsUpdater() {
  const newsCardOneData = await getNewsCardOne();
  const newsCardTwoData = await getNewsCardTwo();
  const newsCardThreeData = await getNewsCardThree();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="">
          User Dashboard News &amp; Updates Portal
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row items-center justify-center align-center space-x-6 text-xl font-bold pt-6">
        <CardOne newsCardOneData={newsCardOneData} />
        <CardTwo newsCardTwoData={newsCardTwoData} />
        <CardThree newsCardThreeData={newsCardThreeData} />
      </CardContent>
    </Card>
  );
}
