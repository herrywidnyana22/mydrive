'use client';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserProps } from '@/types';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import UserAvatar from './UserAvatar';
import { Separator } from './ui/separator';
import NavItem from './NavItem';
import ButtonLogout from './ButtonLogout';
import Uploader from './Uploader';

const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullName,
  email,
  avatar,
}: UserProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  return (
    <header className='mobile-header'>
      <Image
        src={'/assets/icons/logo-full-brand.svg'}
        alt='MyDrive Logo'
        width={120}
        height={120}
        className='h-auto'
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image
            src={'/assets/icons/menu.svg'}
            alt='Menu Icon'
            width={30}
            height={30}
            className='cursor-pointer'
          />
        </SheetTrigger>
        <SheetContent className='h-screen px-3 sheet'>
          <SheetTitle>
            <div className='header-user'>
              <UserAvatar fullName={fullName} email={email} avatar={avatar} isMobile />
            </div>
            <Separator className='mb-4 bg-light-200/20' />
          </SheetTitle>
          <NavItem isMobile={true} />
          <Uploader ownerId={ownerId} accountId={accountId} />
          <Separator className='my-4 bg-light-200/20' />
          <div className='flex flex-col justify-between gap-4 pb-4'>
            <ButtonLogout isMobile />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
