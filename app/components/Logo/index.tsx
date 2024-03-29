import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface iLogoProps extends React.HTMLAttributes<HTMLDivElement> {

}

export default function Logo({ ...rest }: iLogoProps) {
    return (
        <div {...rest} className={twMerge(`logo w-auto`, rest.className)}>
            <Link href={"/"} className='group'>
                <h1 className='text-main-third text-xl font-extrabold '>
                    N I - S H O P
                </h1>
            </Link>
        </div>
    )
}