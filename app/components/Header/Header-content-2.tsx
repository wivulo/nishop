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
        >
          Jewelry & Accessories
        </Button.Link>
      </Button.Root>


      <Button.Root >
        <Button.Link href={"/shoes"} text="Clothing & Shoes" isActiveLink >
          Clothing & Shoes
        </Button.Link>
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/living"} text="Home & Living" isActiveLink >
          Home & Living
        </Button.Link>
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/party"} text="Wedding & Party" isActiveLink >
          Wedding & Party
        </Button.Link>
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/entertaiment"} text="Toys & Entertainment" isActiveLink >
          Toys & Entertainment
        </Button.Link>
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/collectibles"} text="Art & Collectibles" isActiveLink >
          Art & Collectibles
        </Button.Link>
      </Button.Root>

      <Button.Root >
        <Button.Link href={"/tools"} text="Craft Supplies & Tools" isActiveLink >
          Craft Supplies & Tools
        </Button.Link>
      </Button.Root>

      <div ref={followLineRef} className='w-20 h-1 bg-main-primary absolute left-1 -bottom-2'></div>
    </div>
  )
}