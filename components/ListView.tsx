import Link from 'next/link';
import Thumbnail from './Thumbnail';
import FileTime from './FileTime';
import FileOption from './FileOption';

import { FileProps } from '@/types';
import { constructFileUrl, convertFileSize } from '@/lib/utils';
import { Separator } from './ui/separator';

const ListView = async ({ file }: FileProps) => {
  const imageURL = constructFileUrl(file.bucketFileId);
  return (
    <>
      <Link
        href={imageURL}
        target='_blank'
        className='flex items-center px-4 py-2 text-sm hover:bg-brand/10 hover:text-brand cursor-pointer'
      >
        <Thumbnail
          type={file.type}
          ext={file.extension}
          url={imageURL}
          className='size-2'
        />

        {/* File info */}
        <div className='flex-1 grid grid-cols-4 gap-2 ml-3 items-center'>
          <p className='subtitle-2 line-clamp-1'>{file.name}</p>
          <p className='caption line-clamp-1 text-light-200'>{file.owner.fullName}</p>
          <p className='text-muted-foreground text-sm'>{convertFileSize(file.size)}</p>
          <FileTime
            date={file.$createdAt}
            className={'caption line-clamp-1 text-light-200'}
          />
        </div>
        <FileOption file={file} />
      </Link>
      <Separator />
    </>
  );
};

export default ListView;
