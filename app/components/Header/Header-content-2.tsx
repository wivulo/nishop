"use client"

import Link from "next/link";
import { useEffect, useRef } from "react"
import { Button } from '../Button';
import { usePathname } from "next/navigation";
import anime from "animejs";

export default function HeaderContent2() {
  const pathname = usePathname()
  const followLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeLink = document.querySelector(`a[href='${pathname}']`)!;

    followLineRef.current
      &&
      anime({
        targets: followLineRef.current,
        translateX: activeLink && activeLink.getBoundingClientRect().left - 10,
        easing: 'easeInOutExpo'
      });
  }, [pathname])

  return (
    <div className="flex gap-x-7 z-10 justify-start items-center text-base text-main-regular py-2 relative">

      <Button.Root >
        <Button.Link
          href={`/Accessories`}
          isActiveLink
          text='Jewelry & Accessories'
        />
      </Button.Root>


      <Button.Root >
        <Button.Link href={"/shoes"} text="Clothing & Shoes" isActiveLink />
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/living"} text="Home & Living" isActiveLink />
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/party"} text="Wedding & Party" isActiveLink />
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/entertaiment"} text="Toys & Entertainment" isActiveLink />
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/collectibles"} text="Art & Collectibles" isActiveLink />
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/tools"} text="Craft Supplies & Tools" isActiveLink />
      </Button.Root>

      <div ref={followLineRef} className='w-20 h-1 bg-main-primary absolute left-1 -bottom-2'></div>
    </div>
  )
}