import { FaUser, FaShoppingBag, FaSearch } from 'react-icons/fa'
import { SlArrowDown } from "react-icons/sl";
import { Button } from '../Button';
import { Input } from '../CustomInput';
import HeaderContent2 from './Header-content-2';
import HeaderContent1 from './Header-content-1';
import Logo from '../Logo';

const Header = () => {
  return (
    <header className="w-full h-36 px-4 pt-5 bg-base-soft min-w-max Header">
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-row justify-between items-center">
          <Logo />
          <HeaderContent1 />
        </div>
        <HeaderContent2 />
      </div>
    </header>
  )
}

export default Header;