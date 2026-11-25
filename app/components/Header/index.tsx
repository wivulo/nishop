import HeaderContent2 from './Header-content-2';
import HeaderContent1 from './Header-content-1';
import Logo from '../Logo';
import Link from 'next/link';

const Header = () => {

  return (
    <header className="Header relative z-30 w-full border-b border-[#eee6de] bg-[#fdfbf8]">
      <div className="shop-shell flex flex-col gap-y-2 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Logo />
          <HeaderContent1 />
        </div>
        <HeaderContent2 />
      </div>
    </header>
  )
}

export default Header;
