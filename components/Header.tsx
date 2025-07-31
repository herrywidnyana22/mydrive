import Upload from './Upload';
import Search from './Search';
import ButtonLogout from './ButtonLogout';

const Header = () => {
  return (
    <header className='header'>
      <Search />
      <div className='header-wrapper'>
        <Upload />
        <form>
          <ButtonLogout />
        </form>
      </div>
    </header>
  );
};

export default Header;
