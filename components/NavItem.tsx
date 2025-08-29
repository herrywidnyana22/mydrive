import { navItems } from '@/constants';
import { buildUrlWithParams, cn } from '@/lib/utils';
import { MobileConditionProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const NavItem = ({ isMobile }: MobileConditionProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());
  return (
    <nav className={cn(isMobile ? 'mobile-nav' : 'sidebar-nav h5')}>
      <ul className={cn(isMobile ? 'mobile-nav-list' : 'flex flex-col flex-1 gap-4')}>
        {navItems.map((item, i) => {
          const url = buildUrlWithParams(item.url, currentParams, {});
          return (
            <Link key={i} href={url} className='lg:w-full'>
              <li
                className={cn(
                  'hover:bg-accent',
                  isMobile ? 'mobile-nav-item' : 'sidebar-nav-item h5',
                  pathname === item.url && 'active'
                )}
              >
                {item.icon && (
                  <Image
                    src={item.icon}
                    height={30}
                    width={30}
                    alt='menu-icon'
                    className={cn('nav-icon', pathname === item.url && 'nav-icon-active')}
                  />
                )}
                <span className={cn(isMobile ? null : 'hidden lg:block')}>
                  {item.name}
                </span>
              </li>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavItem;
