import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { sortTypes } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';

const Sort = () => {
  const router = useRouter();
  const pathName = usePathname();

  const onSort = (value: string) => {
    router.push(`${pathName}/?sort=${value}`);
  };
  return (
    <Select onValueChange={onSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className='sort-select no-focus'>
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className='sort-select-content'>
        {sortTypes.map((sort, i) => (
          <SelectItem
            key={`${sort.value}-${i}`}
            value={sort.value}
            className='select-item'
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
