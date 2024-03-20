import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountAvailableCARESBusPasses } from "@/server/actions/count/actions";
import { CountReservedCARESBusPasses } from "@/server/actions/count/actions";
import { CountCARESWalmartCards } from "@/server/actions/count/actions";
import { CountCARESArcoCards } from "@/server/actions/count/actions";

export default async function CaresAssetCard() {
  const availableBusPasses = await CountAvailableCARESBusPasses();
  const reservedBusPasses = await CountReservedCARESBusPasses();
  const walmartCards = await CountCARESWalmartCards();
  const arcoCards = await CountCARESArcoCards();
  return (
    <>
      <Card className="flex w-full flex-col items-center align-center  p-10 space-y-4 ">
        <div className=" font-bold text-3xl text-center">CARES Assets</div>
        <Tabs defaultValue="walmart" className="w-full">
          <TabsList className="flex flex-row w-[330px] items-center justify-center mx-auto">
            <TabsTrigger value="buspass">Bus Passes</TabsTrigger>
            <TabsTrigger value="walmart">Walmart Cards</TabsTrigger>
            <TabsTrigger value="arco">Arco Cards</TabsTrigger>
          </TabsList>
          {/* Bus Passes Tab */}
          <TabsContent value="buspass">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Bus Passes</CardTitle>
                <CardDescription>
                  A summary of the available and reserved bus passes purchased
                  by the CARES General Fund.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-row space-x-4 space-y-1.5">
                    Available Bus Passes:{" "}
                    <Badge className="text-sm">{availableBusPasses}</Badge>
                  </div>
                  <div className="flex flex-row space-x-4 space-y-1.5">
                    Reserved Bus Passes:{" "}
                    <Badge className="text-sm">{reservedBusPasses}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Walmart Cards Tab */}
          <TabsContent value="walmart">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Walmart Cards</CardTitle>
                <CardDescription>
                  A summary of the total cash value and number of Walmart gift
                  cards purchased by the CARES General Fund.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-row space-x-4 space-y-1.5">
                    Total Cash Value of Walmart Cards:{" "}
                    <Badge className="text-sm">{walmartCards.totalSum}</Badge>
                  </div>
                  <div className="flex flex-row space-x-4 space-y-1.5">
                    Total Number of Walmart Cards:{" "}
                    <Badge className="text-sm">{walmartCards.count}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Arco Cards Tab */}
          <TabsContent value="arco">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Arco Cards</CardTitle>
                <CardDescription>
                  A summary of the total cash value and number of Arco gift
                  cards purchased by the CARES General Fund.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-row space-x-4 space-y-1.5">
                    Total Cash Value of Walmart Cards:{" "}
                    <Badge className="text-sm">{arcoCards.totalSum}</Badge>
                  </div>
                  <div className="flex flex-row space-x-4 space-y-1.5">
                    Total Number of Walmart Cards:{" "}
                    <Badge className="text-sm">{arcoCards.count}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
