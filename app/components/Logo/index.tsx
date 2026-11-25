import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface iLogoProps extends React.HTMLAttributes<HTMLDivElement> {

}

export default function Logo({ ...rest }: iLogoProps) {
    return (
        <div {...rest} className={twMerge(`logo w-auto`, rest.className)}>
            <Link href={"/"} className='group'>
                <span className='whitespace-nowrap text-xl font-extrabold tracking-[.15em] text-main-primary sm:text-2xl'>
                    NI·SHOP
                </span>
            </Link>
        </div>
    )
}
