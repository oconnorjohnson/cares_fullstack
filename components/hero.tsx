import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <div className="flex flex-col items-center">
        {/* <h1 className="text-5xl">CARES</h1> */}

        <Image
          src="/hero.svg"
          alt="hand sketch of a diverse group of friends"
          height="500"
          width="600"
        />
        <div className="flex flex-row items-center">
          <Image
            src="/logo.png"
            alt="hand sketch of a diverse group of friends"
            height="100"
            width="100"
          />
          <h1 className="font-extrabold text-7xl">We&apos;re here to help.</h1>
        </div>
        <h2 className="font-extralight text-3xl w-1/2 text-center p-4">
          Enabling the Yolo County Public Defender's Office to address the unmet
          social, financial, and health care needs of individuals navigating the
          justice system.
        </h2>
      </div>
    </>
  );
}
