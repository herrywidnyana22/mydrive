import React from 'react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Upload from './Upload';
import Search from './Search';

const Header = () => {
  return (
    <header className='header'>
      <Search />
      <div className='header-wrapper'>
        <Upload />
        <form>
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
