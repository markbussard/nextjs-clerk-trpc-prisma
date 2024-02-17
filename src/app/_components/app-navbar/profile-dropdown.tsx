'use client';

import { Fragment, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { Menu, Transition } from '@headlessui/react';

type ProfileDropdownProps = {
  userInitial: string;
};

export const ProfileDropdown = (props: ProfileDropdownProps) => {
  const { signOut } = useClerk();
  const router = useRouter();
  const handleSignOutClick = useCallback(
    () => signOut(() => router.push('/login')),
    [signOut, router]
  );
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#D9D9D9] text-center text-sm">
          <p className="font-montserrat font-semibold">{props.userInitial}</p>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border-none bg-white py-1 shadow-lg ">
          <Menu.Item>
            <Link
              href="/settings"
              className="block cursor-pointer px-4 py-2 text-sm"
            >
              Settings
            </Link>
          </Menu.Item>
          <Menu.Item>
            <p
              className="block cursor-pointer px-4 py-2 text-sm"
              onClick={handleSignOutClick}
            >
              Sign Out
            </p>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
