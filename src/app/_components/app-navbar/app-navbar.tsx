'use client';

import { trpc } from '~/trpc/react';
import { ProfileDropdown } from './profile-dropdown';

export const AppNavbar = () => {
  const user = trpc.user.me.useQuery();

  return (
    <nav className="sticky left-0 right-0 top-0 z-50 flex h-24 w-full flex-row items-center justify-between bg-white px-12 py-2 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.10)]">
      <div className="ml-auto">
        <ProfileDropdown userInitial={user?.data?.firstName?.[0] || ''} />
      </div>
    </nav>
  );
};
