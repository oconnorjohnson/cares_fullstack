import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpButton } from "@clerk/nextjs";

export default function GetHelp() {
  return (
    <>
      <div className="flex flex-col justify-center w-3/4 space-y-4 py-8 lg:pt-16 lg:w-1/2 lg:space-y-12 mx-auto ">
        <Card>
          <CardHeader>
            <CardTitle>The Resilient Futures Fund</CardTitle>
          </CardHeader>
          <CardContent className="grid gap=4">
            <div className="space-y-6">
              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">What is it?</h3>
                <p className="">
                  The Resilient Futures Fund (RFF) is a pivotal grant secured by
                  CARES, aimed at providing essential assistance to indigent
                  defendants across Yolo County. This fund is specifically
                  designed to support those being represented by various
                  agencies, ensuring they have access to the resources needed
                  for a fair representation. Through RFF, CARES is able to
                  extend its support beyond traditional boundaries, offering a
                  lifeline to those in the most critical need and fostering a
                  more equitable justice system.
                </p>
              </div>
              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">Who can it help?</h3>
                <p className="">
                  RFF is available to anyone representing a client in Yolo
                  County who is experiencing financial, physical health, or
                  mental health difficulties while navigating the criminal
                  justice system. This includes public defenders, appointed
                  counsel, and other legal representatives who are working
                  tirelessly to ensure fair and just representation for all,
                  regardless of their client&apos;s ability to pay. By providing
                  this crucial support, the RFF aims to level the playing field
                  and ensure that every individual has access to the resources
                  they need for a fair trial and the opportunity for a better
                  future.
                </p>
              </div>
              <div className="prose lg:prose-xl max-w-none pb-4">
                <h3 className="font-bold ">How do I get access?</h3>
                <p className="">
                  Sign up for an account below! Once you do, navigate to the
                  dashboard and add a new client profile. Once you&apos;ve done
                  that, you can submit a request on their behalf.
                </p>
              </div>

              <SignUpButton mode="modal" afterSignUpUrl="/dashboard">
                <Button className="text-xl">Sign Up</Button>
              </SignUpButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
