import { MobileConditionProps, SidebarProps } from '@/types';
import Image from 'next/image';

const UserAvatar = ({
  fullName,
  email,
  avatar,
  isMobile = false,
}: SidebarProps & MobileConditionProps) => {
  return (
    <>
      <Image
        alt='User Avatar'
        src={avatar}
        height={44}
        width={44}
        className='user-avatar'
      />
      <div className={isMobile ? '' : 'sm:hidden lg:block'}>
        <p className='subtitle-2 capitalize'>{fullName}</p>
        <p className='caption'>{email}</p>
      </div>
    </>
  );
};

export default UserAvatar;
