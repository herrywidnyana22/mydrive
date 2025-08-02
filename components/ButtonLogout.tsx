import React from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { MobileConditionProps } from '@/types';
import { logout } from '@/lib/actions/user.actions';

const ButtonLogout = ({ isMobile = false }: MobileConditionProps) => {
  return (
    <Button
      type='submit'
      onClick={async () => await logout()}
      className='sign-out-button bg-brand/10 hover:bg-brand/20 cursor-pointer'
    >
      <LogOut size={24} className={isMobile ? '' : 'w-4'} />
      {isMobile && <p>Log out</p>}
    </Button>
  );
};

export default ButtonLogout;
