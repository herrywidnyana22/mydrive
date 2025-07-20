import React from 'react';
import Image from 'next/image';

const AuthLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex min-h-screen'>
      <section className='bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5'>
        <div className='flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12'>
          <Image
            src={'/assets/icons/logo-full.svg'}
            alt='logo'
            width={220}
            height={80}
            className='h-auto'
          />
          <div className='space-y-5 text-white'>
            <h1 className='h1'>
              Manage your files
            </h1>
            <p className='body-1'>
              This is a simple and secure way to
              store and manage your files.
            </p>
          </div>

          <Image
            src={'/assets/images/files.png'}
            alt='auth-bg'
            width={340}
            height={340}
            className='transition-all hover:rotate-3 hover:scale-110'
          />
        </div>
      </section>
      <section className=''>
        <div></div>
      </section>
      {children}
    </div>
  );
};

export default AuthLayout;
