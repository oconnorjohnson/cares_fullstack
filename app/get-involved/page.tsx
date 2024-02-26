import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function GiveBack() {
  return (
    <>
      <div className="flex flex-col justify-center w-3/4 space-y-4 py-8 lg:pt-16 lg:w-1/2 lg:space-y-12 mx-auto ">
        <Card>
          <CardHeader>
            <CardTitle>
              Supporting Your Community is Just a Click Away
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap=4">
            <div className="space-y-6">
              <div className="prose lg:prose-xl max-w-none pb-4">
                <p className="text-lg">
                  100% of your donations directly contribute to supporting
                  members of your community in need, through CARES, a 501(c)(3)
                  non-profit organization. We ensure that every dollar goes
                  towards addressing the unmet social, financial, and behavioral
                  health care needs of individuals navigating the criminal
                  justice system.
                </p>
              </div>
              <Link href="https://www.paypal.com/paypalme/yolocares">
                <Button>Donate</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
