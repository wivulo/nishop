import { FiBox, FiHeart, FiShield } from 'react-icons/fi';

const values = [
  { icon: FiHeart, title: 'Escolhas especiais', description: 'Produtos com personalidade para oferecer ou guardar.' },
  { icon: FiBox, title: 'Compra simples', description: 'Explora a coleção e finaliza tudo num só lugar.' },
  { icon: FiShield, title: 'Pagamento seguro', description: 'Confirma o pagamento com a BayQi Wallet.' },
];

export default function Section2() {
  return (
    <section className="shop-shell py-12" aria-label="Vantagens da Nishop">
      <div className="grid gap-4 md:grid-cols-3">
        {values.map(({ icon: Icon, title, description }) => (
          <div key={title} className="shop-feature flex items-start gap-4 rounded-[1.4rem] border border-[#eee6de] bg-white p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff0e5] text-main-primary"><Icon size={22} aria-hidden="true" /></span>
            <div>
              <h2 className="text-base font-semibold text-main-regular">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-main-medium">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
