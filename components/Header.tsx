import Search from './Search';
import { Button } from './ui/button';
import { logout } from '@/lib/actions/user.actions';
import Uploader from './Uploader';
import { HeaderProps } from '@/types';
import Image from 'next/image';
import Hover from './Hover';

const Header = ({ userId, accountId }: HeaderProps) => {
  return (
    <header className='header'>
      <Search />
      <div className='header-wrapper'>
        <Uploader ownerId={userId} accountId={accountId} />
        <Hover asChild text='Logout'>
          <form
            action={async () => {
              'use server';

              await logout();
            }}
          >
            <Button
              type='submit'
              className='sign-out-button bg-brand/10 hover:bg-brand/20 cursor-pointer rotate-180'
            >
              <Image
                src={'assets/icons/logout.svg'}
                alt='logout-icon'
                height={28}
                width={28}
              />
            </Button>
          </form>
        </Hover>
      </div>
    </header>
  );
};

export default Header;
