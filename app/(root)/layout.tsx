import Header from '@/components/Header';
import MobileNavigation from '@/components/MobileNavigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  console.log({ currentUser });

  if (!currentUser) return redirect('/login');
  return (
    <main className='flex h-screen'>
      <Sidebar
        fullName={currentUser.fullName}
        avatar={currentUser.avatar}
        email={currentUser.email}
      />
      <section className='flex h-full flex-1 flex-col'>
        <MobileNavigation {...currentUser} />
        <Header {...currentUser} />
        <div className='main-content'>{children}</div>
      </section>
    </main>
  );
};

export default layout;
