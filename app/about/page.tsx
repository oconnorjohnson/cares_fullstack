import Image from "next/image";
export default function About() {
  return (
    <>
      <div className="flex flex-col justify-center">
        <div className="flex flex-cols-2 justify-between items-center my-24 mx-36">
          <div className="w-1/3">
            <Image
              src="hero.svg"
              height="350"
              width="350"
              alt="hero illustration"
            />
          </div>
          <div className="w-2/3 flex flex-col text-end text-5xl font-bold">
            <div>Supporting the journey to health and safety.</div>
            <div className="py-4" />
            <div className="text-3xl font-extralight">
              The mission of CARES is to enhance the ability of the Yolo County
              Public Defender&apos;s Office to address the unmet social,
              financial, and behavioral health care needs of individuals
              navigating the criminal justice system.
            </div>
          </div>
        </div>
        <div className="flex lg:flex-cols-3">
          <div className="hidden lg:flex lg:flex-col lg:justify-end lg:mx-4 w-1/6">
            <Image
              src="muslim-woman.svg"
              height="250"
              width="250"
              alt="illustration of woman"
              className=""
            />
          </div>
          <div className="w-2/3">
            <div className="flex flex-col text-2xl justify-center text-start">
              <div className="">
                Hello and welcome! CARES is a charitable organization with a big
                heart and an even bigger mission. We&apos;re here to support the
                Yolo County Public Defender&apos;s Office in addressing the
                unmet social, financial, and behavioral health needs of
                individuals navigating the justice system. We see beyond the
                courtroom, recognizing the myriad of social, financial, and
                health needs that are often overlooked. We believe that everyone
                deserves a chance to rebuild and restore their lives, regardless
                of their past.
              </div>
            </div>
            <div className="flex flex-col text-2xl justify-center my-12 text-start">
              <div className="">
                Our aim is to foster a community that is not only aware but
                engaged in what we do. We strive to promote understanding about
                our resources, services, and the needs of the people we support.
                We believe everyone has a role to play in making our society
                more inclusive and compassionate.
              </div>
            </div>
            <div className="flex flex-col text-2xl justify-center text-start">
              <div className="">
                Funding our mission is a big part of what we do. We seek out
                donations, endowments and contributions, and we also actively
                participate in fundraising activities and grant opportunities.
                Every dollar we raise goes directly to help individuals navigate
                and address the challenges that led them to the justice system
                in the first place. This could range from homelessness and
                trauma to physical and behavioral health concerns.
              </div>
            </div>
            <div className="flex flex-col text-2xl justify-center my-12 text-start">
              <div className="">
                We&apos;re a nonprofit public benefit corporation, based in
                sunny Woodland, California. We&apos;re not in this for personal
                gain, but for the public good. Every move we make, every fund we
                raise, is for the purpose of creative a positive impact on the
                lives of individuals involved with the justice system.
              </div>
            </div>
            <div className="flex flex-col text-2xl justify-center text-start">
              <div className="">
                We&apos;re organized under the California Nonprofit Public
                Benefit Corporation Law and operate exclusively within the
                boundaries set by the Internal Revenue Code section
                501&#40;c&#41;&#40;3&#41;, and we do not participate or
                intervene in any legislative or political campaigns.
              </div>
            </div>
            <div className="flex flex-col text-2xl justify-center my-12 text-start">
              <div className="">
                Thank&apos;s for visiting us! We hope that you&apos;ll join us
                in our misison. Whether you choose to donate, volunteer, or
                simply spread the word about our work, you&apos;re making a
                difference. Together we can help those involved in the justice
                system find their footing and build a brighter future. Welcome
                to Yolo Public Defender CARES!
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:flex-col lg:justify-start lg:mx-4 w-1/6">
            <Image
              src="old-men-sitting-with-leg-up.svg"
              height="250"
              width="250"
              alt="illustration of sitting woman"
              className=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
