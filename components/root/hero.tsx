import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <div className="flex flex-col items-center h-full space-y-8 lg:space-y-10 py-4">
        {/* <div className="py-2" /> */}
        <Image
          src="/hero.svg"
          alt="hand sketch of a diverse group of friends"
          height="250"
          width="250"
          className="pt-20 lg:hidden"
        />
        <Image
          src="/hero.svg"
          alt="hand sketch of a diverse group of friends"
          height="500"
          width="500"
          className="hidden lg:block"
        />
        {/* <div className="py-4" /> */}
        <div className="flex flex-row items-center ">
          <Image
            src="/logo.png"
            alt="CARES logo"
            height="50"
            width="50"
            className=" lg:hidden"
          />
          <Image
            src="/logo.png"
            alt="CARES logo"
            height="100"
            width="100"
            className="hidden lg:block"
          />
          <div className="px-2" />
          <h1 className="font-black pt-2 text-3xl lg:text-7xl">
            We&apos;re here to help.
          </h1>
        </div>
        {/* <div className="py-4" /> */}
        <h2 className="font-extralight text-xl px-12 lg:px-0 lg:text-3xl lg:w-1/2 text-center pb-4">
          CARES enables the Yolo County Public Defender's Office to address the
          unmet social, financial, and health care needs of individuals
          navigating the justice system.
        </h2>
      </div>
    </>
  );
}
