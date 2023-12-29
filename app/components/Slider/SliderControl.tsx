import { ElementType, HTMLAttributes, ReactNode } from "react";


interface iInputProps extends HTMLAttributes<HTMLAnchorElement> {
    icon: ElementType,
    action: () => void,
    dirx: number
}

function SliderControl({ icon: Icon, action, dirx }: iInputProps) {
    return (
        <a className={`slider__arrow ${dirx == 0 ? "slider__arrow_prev" : "slider__arrow_next"} text-white`}
                onClick={action}>
            <Icon />
        </a>
    )
}

export default SliderControl;