import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function About() {
  return (
    <>
      <div className="flex flex-col justify-center w-3/4 space-y-4 py-8 lg:pt-16 lg:w-1/2 lg:space-y-12 mx-auto ">
        <Card>
          <CardHeader>
            <CardTitle>Supporting the Journey to Health & Safety</CardTitle>
            {/* <CardDescription className="text-sm lg:text-lg">
              The mission of CARES is to enhance the ability of the Yolo County
              Public Defender&apos;s Office to address the unmet social,
              financial, and behavioral health care needs of individuals
              navigating the criminal justice system.
            </CardDescription> */}
          </CardHeader>
          <CardContent className="grid gap=4">
            <div className="space-y-6">
              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">Welcome to CARES!</h3>
                <p className="">
                  CARES is a charitable organization with a big heart and an
                  even bigger mission. We&apos;re here to support the Yolo
                  County Public Defender&apos;s Office in addressing the unmet
                  social, financial, and behavioral health needs of individuals
                  navigating the justice system.
                </p>
              </div>

              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">Engaging the Community</h3>
                <p className="">
                  Our aim is to foster a community that is not only aware but
                  engaged in what we do. We strive to promote understanding
                  about our resources, services, and the needs of the people we
                  support.
                </p>
              </div>

              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">Supporting Our Mission</h3>
                <p className="">
                  Funding our mission is a big part of what we do. We seek out
                  donations, endowments, and contributions, and we also actively
                  participate in fundraising activities and grant opportunities.
                </p>
              </div>

              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">Our Foundation</h3>
                <p className="">
                  We&apos;re a nonprofit public benefit corporation, based in
                  sunny Woodland, California. We&apos;re not in this for
                  personal gain, but for the public good. Every move we make,
                  every fund we raise, is for the purpose of creating a positive
                  impact on the lives of individuals involved with the justice
                  system.
                </p>
              </div>

              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">Compliance and Integrity</h3>
                <p className="">
                  We&apos;re organized under the California Nonprofit Public
                  Benefit Corporation Law and operate exclusively within the
                  boundaries set by the Internal Revenue Code section 501(c)(3),
                  and we do not participate or intervene in any legislative or
                  political campaigns.
                </p>
              </div>

              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">Join Us!</h3>
                <p className="">
                  Thanks for visiting us! We hope that you&apos;ll join us in
                  our mission. Whether you choose to donate, volunteer, or
                  simply spread the word about our work, you&apos;re making a
                  difference. Together we can help those involved in the justice
                  system find their footing and build a brighter future. Welcome
                  to Yolo Public Defender CARES!
                </p>
              </div>
            </div>
          </CardContent>
          {/* <CardFooter>CARES copyright 2021</CardFooter> */}
        </Card>
      </div>
    </>
  );
}
