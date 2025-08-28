import { Button } from './ui/button';
import { MobileConditionProps } from '@/types';
import { logout } from '@/lib/actions/user.actions';
import Image from 'next/image';

const ButtonLogout = ({ isMobile = false }: MobileConditionProps) => {
  return (
    <Button
      type='submit'
      onClick={async () => await logout()}
      className='sign-out-button bg-brand/10 hover:bg-brand/20 cursor-pointer'
    >
      <Image src={'assets/icons/logout.svg'} alt='logout-icon' height={28} width={28} />
      {isMobile && <p>Log out</p>}
    </Button>
  );
};

export default ButtonLogout;
