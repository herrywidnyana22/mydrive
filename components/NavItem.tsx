import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import { MobileConditionProps } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavItem = ({ isMobile }: MobileConditionProps) => {
  const pathname = usePathname();
  return (
    <nav className={cn(isMobile ? 'mobile-nav' : 'sidebar-nav h5')}>
      <ul className={cn(isMobile ? 'mobile-nav-list' : 'flex flex-col flex-1 gap-4')}>
        {navItems.map((item, i) => (
          <Link key={i} href={item.url} className='lg:w-full'>
            <li
              className={cn(
                isMobile ? 'mobile-nav-item' : 'sidebar-nav-item h5',
                pathname === item.url && 'active'
              )}
            >
              {item.icon && (
                <item.icon
                  size={28}
                  className={cn('nav-icon', pathname === item.url && 'nav-icon-active')}
                />
              )}
              <span className={cn(isMobile ? null : 'hidden lg:block')}>{item.name}</span>
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavItem;
