'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';

import { sortTypes } from '@/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { buildUrlWithParams, cn } from '@/lib/utils';

const Sort = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  // Ambil sort dari query (contoh: "size-asc")
  const sortQuery = searchParams.get('sort') || '';
  const [sortValue, sortDirection] = sortQuery.split('-'); // ["size", "asc"]

  // Cari match sortType berdasarkan query, kalau ga ada fallback ke index 0
  const defaultSelected = sortTypes.find(s => s.value === sortValue) || sortTypes[0];

  const defaultDirection =
    sortDirection === 'desc' || sortDirection === 'asc'
      ? (sortDirection as 'asc' | 'desc')
      : 'asc';

  const [selected, setSelected] = useState(defaultSelected);
  const [direction, setDirection] = useState<'asc' | 'desc'>(defaultDirection);

  const onSelect = (field: { label: string; value: string }) => {
    setSelected(field);

    const url = buildUrlWithParams(pathName, currentParams, {
      sort: field.value,
    });
    // reset ke asc setiap kali ganti field
    setDirection('asc');
    router.push(`${url}-asc`);
  };

  const onToggleUpDown = () => {
    const newDir = direction === 'asc' ? 'desc' : 'asc';
    setDirection(newDir);
    const url = buildUrlWithParams(pathName, currentParams, {
      sort: selected.value,
    });
    router.push(`${url}-${newDir}`);
  };
  return (
    <div className='flex items-center gap-2'>
      {/* Label */}

      {/* Icon toggle up/down */}
      <Button variant={'ghost'} onClick={onToggleUpDown} className='cursor-pointer'>
        <span className='subtitle-1 hidden sm:block'>{selected.label}</span>
        <Image
          src={'assets/icons/arrow-up.svg'}
          alt='sorting icon'
          width={16}
          height={16}
          className={cn(
            'dark:invert transition',
            direction === 'asc' ? '' : 'rotate-180'
          )}
        />
      </Button>

      {/* Dropdown trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant='outline' className='rounded-lg cursor-pointer'>
            <ListFilter className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortTypes.map(field => (
            <DropdownMenuItem
              key={field.value}
              onClick={() => onSelect(field)}
              className={
                field.value === selected.value ? 'bg-brand/10 text-brand-100' : ''
              }
            >
              {field.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Sort;
