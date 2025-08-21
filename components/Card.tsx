import { FileProps } from '@/types';
import Link from 'next/link';
import Thumbnail from './Thumbnail';
import { constructFileUrl, convertFileSize } from '@/lib/utils';
import FileTime from './FileTime';

const Card = async ({ file }: FileProps) => {
  const imageURL = constructFileUrl(file.bucketFileId);
  return (
    <Link href={file.url} target='_blank' className='file-card'>
      <div className='flex justify-between'>
        <Thumbnail
          type={file.type}
          ext={file.extention}
          url={imageURL}
          className='!size-20'
        />
        <div className='flex flex-col items-end justify-between'>
          ...
          <p className='body-1'>{convertFileSize(file.size)}</p>
        </div>
      </div>
      <div className='file-card-details'>
        <p className='subtitle-2 line-clamp-1'>{file.name}</p>
        <FileTime date={file.$createdAt} className={'body-2 text-light-100'} />
        <p className='caption line-clamp-1 text-light-200'>By: {file.owner.fullName}</p>
      </div>
    </Link>
  );
};

export default Card;
