import Link from 'next/link';
import Logo from '../Logo';

export default function Footer() {
  return <footer className="border-t border-[#eee6de] bg-white">
    <div className="shop-shell grid gap-10 py-12 md:grid-cols-[1fr_auto_auto] md:gap-20">
      <div>
        <Logo />
        <p className="mt-4 max-w-sm text-sm leading-7 text-main-medium">Peças especiais para a casa, para oferecer e para descobrir todos os dias.</p>
        <p className="mt-4 text-xs text-main-medium">Benguela, Angola</p>
      </div>
      <div>
        <h2 className="text-sm font-bold text-main-regular">Navegação</h2>
        <ul className="mt-4 space-y-3 text-sm text-main-medium">
          <li><Link href="/" className="hover:text-main-primary">Início</Link></li>
          <li><Link href="/products" className="hover:text-main-primary">Produtos</Link></li>
        </ul>
      </div>
      <div>
        <h2 className="text-sm font-bold text-main-regular">Conta</h2>
        <ul className="mt-4 space-y-3 text-sm text-main-medium">
          <li><Link href="/login" className="hover:text-main-primary">Iniciar sessão</Link></li>
          <li><Link href="/registration" className="hover:text-main-primary">Criar conta</Link></li>
        </ul>
      </div>
    </div>
    <div className="shop-shell flex flex-wrap items-center justify-between gap-3 border-t border-[#eee6de] py-5 text-xs text-main-medium">
      <span>© {new Date().getFullYear()} Nishop. Todos os direitos reservados.</span>
      <a href="#top" className="font-semibold text-main-primary hover:underline">Voltar ao topo ↑</a>
    </div>
  </footer>;
}
