'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Hover from './Hover';
import { buildUrlWithParams } from '@/lib/utils';

export default function ToggleViewButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const isList = currentParams.view === 'list';

  const url = buildUrlWithParams(pathname, currentParams, {
    view: isList ? 'card' : 'list',
  });

  return (
    <Hover text={`Switch to ${isList ? 'Card' : 'List'} view`} asChild>
      <Link href={url} className='rounded-lg bg-brand p-2 hover:bg-brand/80 transition'>
        <Image
          src={isList ? '/assets/icons/list.png' : '/assets/icons/grid.svg'}
          alt='toggle view'
          width={20}
          height={20}
          className='dark:invert'
        />
      </Link>
    </Hover>
  );
}
