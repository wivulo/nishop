"use client";
import { Product } from "@prisma/client";
import { Productcard } from "../ProductCard"

interface iProductListItem {
    product: Product;
    onOpenProductDetail: (product: Product) => void;
    index?: number;
}

export const ProductListItem = ({ product, onOpenProductDetail, index }: iProductListItem) => {
    if (product.Emphasis) {
        if (index == 0) {
            return (
                <li key={product.id} onClick={() => onOpenProductDetail(product)}>
                    <Productcard.Root className='w-[295px] h-96 flex justify-center items-center p-0'>
                        <Productcard.Image
                            src={product.imageSrc}
                            width={600}
                            height={600}
                            alt={product.name}
                            className='w-full h-full object-cover'
                        />
                    </Productcard.Root>
                </li>
            )
        } else {
            return (
                <li key={product.id} onClick={() => onOpenProductDetail(product)}>
                    <Productcard.Root className='w-[295px] h-96'>
                        <Productcard.Like />
                        <Productcard.Image
                            src={product.imageSrc}
                            width={500}
                            height={500}
                            alt={product.name}
                            className='w-[200px] h-[200px]'
                        />
                        <Productcard.Description text={product.description} />
                        <Productcard.Colors>
                            {product.colors.split("#").filter(color => color.length > 0).map(
                                (color, i) => (
                                    <Productcard.Color
                                        key={i}
                                        color={"#" + color.replace(",", "")}
                                    />
                                )
                            )}
                        </Productcard.Colors>
                        <Productcard.Price price={product.price} />
                    </Productcard.Root>
                </li>
            )
        }
    } else {
        return (
            <li key={product.id} onClick={() => onOpenProductDetail(product)}>
                <Productcard.Root className='w-[188px]'>
                    <Productcard.Like />
                    <Productcard.Image
                        src={product.imageSrc}
                        width={500}
                        height={500}
                        alt={product.name}
                    />
                    <Productcard.Description text={product.description} />
                    <Productcard.Price price={product.price} />
                </Productcard.Root>
            </li>
        )
    }
}