import Search from './Search';
import { Button } from './ui/button';
import { logout } from '@/lib/actions/user.actions';
import { LogOut } from 'lucide-react';
import Uploader from './Uploader';
import { HeaderProps } from '@/types';

const Header = ({ userId, accountId }: HeaderProps) => {
  return (
    <header className='header'>
      <Search />
      <div className='header-wrapper'>
        <Uploader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
            'use server';

            await logout();
          }}
        >
          <Button
            type='submit'
            className='sign-out-button bg-brand/10 hover:bg-brand/20 cursor-pointer'
          >
            <LogOut size={24} className='w-4' />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
