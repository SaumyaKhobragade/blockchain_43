"use client"
import Image from "next/image";
import Link from 'next/link'
import { WalletConnect } from './walletConnect';

const Header = () => {

  return (
    <div className="fixed top-0 w-full h-20 flex items-center z-10 bg-transparent">
      <div className="w-full flex items-center justify-between px-4 lg:px-8">
        <div className="relative">
          <Link href="/">
            <Image
              className="cursor-pointer hidden lg:block"
              src="/assets/logos/lightLogo.svg"
              width={150}
              height={150}
              alt="IntelliX Logo"
            />
            <div
              className="lg:hidden justify-center items-center flex"
            >
              <Image
                className="cursor-pointer"
                src="/assets/logos/lightLogo.svg"
                width={150}
                height={150}
                alt="IntelliX Logo"
              />
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <WalletConnect />
        </div>
      </div>
    </div >
  );
};

export default Header;

