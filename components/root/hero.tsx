import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <div className="flex flex-col items-center h-full space-y-10 py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28 2xl:py-40">
        {/* <div className="py-2" /> */}
        <Image
          src="/hero.svg"
          alt="hand sketch of a diverse group of friends"
          height="500"
          width="600"
        />
        {/* <div className="py-4" /> */}
        <div className="flex flex-row items-center">
          {/* <Image
            src="/logo.png"
            alt="CARES logo"
            height="100"
            width="100"
          />
          <div className="px-2" /> */}
          <h1 className="font-extrabold pt-2 text-7xl">
            We&apos;re here to help.
          </h1>
        </div>
        {/* <div className="py-4" /> */}
        <h2 className="font-extralight text-3xl w-1/2 text-center p-4">
          CARES enables the Yolo County Public Defender's Office to address the
          unmet social, financial, and health care needs of individuals
          navigating the justice system.
        </h2>
      </div>
    </>
  );
}
