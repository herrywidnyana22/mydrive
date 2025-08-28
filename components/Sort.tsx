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
import { ArrowUp, ArrowDown, ListFilter, Dot } from 'lucide-react';

import { sortTypes } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const Sort = () => {
  const router = useRouter();
  const pathName = usePathname();

  const [selected, setSelected] = useState(sortTypes[0]); // default Date Created
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const onSelect = (field: { label: string; value: string }) => {
    setSelected(field);
    // reset ke asc setiap kali ganti field
    setDirection('asc');
    router.push(`${pathName}?sort=${field.value}-asc`);
  };

  const onToggleUpDown = () => {
    const newDir = direction === 'asc' ? 'desc' : 'asc';
    setDirection(newDir);
    router.push(`${pathName}?sort=${selected.value}-${newDir}`);
  };
  return (
    <div className='flex items-center gap-3'>
      {/* Label */}

      {/* Icon toggle up/down */}
      <Button variant={'ghost'} onClick={onToggleUpDown} className='p-1 cursor-pointer'>
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
          <Button size='icon' variant='outline' className='cursor-pointer'>
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
