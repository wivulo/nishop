export const ProductListSkelton = () => (
    <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4" role="status" aria-label="A carregar produtos">
        {[0, 1, 2, 3].map((item) => <div key={item} className="rounded-[1.4rem] border border-[#eee6de] bg-white p-3">
            <div className="aspect-[4/3] animate-pulse rounded-[1rem] bg-[#f7f2ed]" />
            <div className="mx-2 mt-5 h-3 w-1/3 animate-pulse rounded-full bg-[#f7f2ed]" />
            <div className="mx-2 mt-3 h-4 w-3/4 animate-pulse rounded-full bg-[#f7f2ed]" />
            <div className="mx-2 my-5 h-4 w-1/2 animate-pulse rounded-full bg-[#f7f2ed]" />
        </div>)}
    </div>
)
