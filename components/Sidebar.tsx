'use client';

import { SidebarProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserAvatar from './UserAvatar';
import NavItem from './NavItem';

const Sidebar = ({ fullName, email, avatar }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className='sidebar remove-scrollbar'>
      <Link href={'/'}>
        <Image
          src='/assets/icons/logo-full-brand.svg'
          alt='MyDrive Logo'
          width={160}
          height={50}
          className='hidden h-auto lg:block'
        />

        <Image
          src='/assets/icons/logo-brand.svg'
          alt='MyDrive Logo'
          width={50}
          height={50}
          className='lg:hidden'
        />
      </Link>

      <NavItem isMobile={false} />

      <Image
        src={'/assets/images/files.png'}
        alt='file image'
        width={340}
        height={340}
        className='transition-all hover:rotate-4 mb-10'
      />

      <div className='sidebar-user-info bg-brand/10'>
        <UserAvatar fullName={fullName} email={email} avatar={avatar} />
      </div>
    </aside>
  );
};

export default Sidebar;
