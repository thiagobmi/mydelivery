"use client";

import MaxWidthWrapper from '../MaxWidthWrapper';
import Link from 'next/link';
import Cart from '../Cart';
import Image from 'next/image';
import Logo from "../../../public/logoSVG";
import useDeviceType from '@/hooks/use-device-type';
import { User } from '@/payload-types';
import UserAccountNav from '../UserAccountNav';
import { useTheme } from '@/context/themecontext';

interface NavbarClientProps {
  user: User | null;
}

const NavbarClient: React.FC<NavbarClientProps> = ({ user }) => {
  const isMobile = useDeviceType();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`dark:bg-[#252323] bg-white sticky top-0 inset-x-0 z-50 h-18 overflow-hidden`}>
      <header className={`relative dark:bg-[#252323] bg-transparent`}>
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <div className="flex ml-auto lg:ml-16">
                <Link href="/">
                {isMobile ? (<Logo width={140} height={55} theme={theme} />) : (<Logo width={160} height={70} theme={theme} />)}
                </Link>
              </div>

              <div className="ml-auto flex items-center">
                <div className="flex flex-1 items-center justify-end lg:space-x-5 space-x-2">
                  {isMobile || user ? null : (
                    <Link href="/sign-up" className={`text-primary hover:text-secondary dark:text-white lg:text-xl`}>
                      Sign Up
                    </Link>
                  )}
                  {user? null : <span className="h-6 w-px bg-gray-200" aria-hidden="true" />}
                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link href="/sign-in" className={`text-primary hover:text-secondary dark:text-white lg:text-xl`}>
                      Sign In
                    </Link>
                  )}
                  {user ? <span className="h-6 w-px bg-gray-200" aria-hidden="true" /> : null}
                  {user ? null : <div className="flex ml-10"><span className="h-6 w-px bg-gray-200" aria-hidden="true" /></div>}
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default NavbarClient;
