'use client';

import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
  fullName: string;
  avatar: string;
  email?: string;
};

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

      <nav className='sidebar-nav h5'>
        <ul className='flex flex-col flex-1 gap-4'>
          {navItems.map((item, i) => (
            <Link key={i} href={item.url} className='lg:w-full'>
              <li
                className={cn('sidebar-nav-item h5', pathname === item.url && 'active')}
              >
                {item.icon && (
                  <item.icon
                    size={28}
                    className={cn('nav-icon', pathname === item.url && 'nav-icon-active')}
                  />
                )}
                <span className='hidden lg:block'>{item.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <Image
        src={'/assets/images/files.png'}
        alt='file image'
        width={340}
        height={340}
        className='transition-all hover:rotate-3 hover:scale-110'
      />

      <div className='sidebar-user-info bg-brand/10'>
        <Image
          alt='User Avatar'
          src={avatar}
          height={44}
          width={44}
          className='sidebar-user-avatar'
        />
        <div className='hidden lg:block'>
          <p className='subtitle-2 capitalize'>{fullName}</p>
          <p className='caption'>{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
