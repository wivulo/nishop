import React from 'react';
import Image from "next/image";
import Wrapper from "@/app/components/Wrapper";

interface Section2Props {
    // Define the props for Section2 here
}

const Section2: React.FC<Section2Props> = (props) => {
    // Implement the logic for Section2 here

    return (
        <Wrapper className="h-[174px] flex gap-x-6 mb-10 px-2">
        <div className="basis-1/3 bg-base-graybackground flex">
          <div className="basis-2/3 px-6 flex flex-col gap-y-3 justify-center">
            <p className="text-base font-semibold">A community<br />doing good</p>
            <p className="text-xs">Commerce is a global online <br /> marketplace, where people.</p>
          </div>
          <div className="basis-1/3 grid place-content-center">
            <Image
              src="./images/unsplash-bu-8-te-xhs-pc-y.svg"
              width={500}
              height={500}
              alt="unsplash"
              className="w-32 h-32" />
          </div>
        </div>

        <div className="basis-1/3 bg-base-graybackground flex">
          <div className="basis-2/3 px-6 flex flex-col gap-y-3 justify-center">
            <p className="text-base font-semibold">Support independent<br />creators</p>
            <p className="text-xs">
              Just millions of people selling<br /> the things they love.
            </p>
          </div>
          <div className="basis-1/3 grid place-content-center">
            <Image
              src="./images/unsplash-es-r-jt-esv-jh-u.svg"
              width={500}
              height={500}
              alt="unsplash"
              className="w-32 h-32" />
          </div>
        </div>

        <div className="basis-1/3 bg-base-graybackground flex">
          <div className="basis-2/3 px-6 flex flex-col gap-y-3 justify-center">
            <p className="text-base font-semibold">Peace <br />of mind</p>
            <p className="text-xs">
              Privacy is the highest priority<br /> of our dedicated team.
            </p>
          </div>
          <div className="basis-1/3 grid place-content-center">
            <Image
              src="./images/unsplash-m-7-p-45-jf-x-qo.svg"
              width={500}
              height={500}
              alt="unsplash"
              className="w-32 h-32" />
          </div>
        </div>
      </Wrapper>
    );
};

export default Section2;
