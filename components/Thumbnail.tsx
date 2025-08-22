'use client';

import { cn, getFileIcon } from '@/lib/utils';
import { ThumbnailProps } from '@/types';
import Image from 'next/image';

const Thumbnail = ({ type, ext, url, imageClassName, className }: ThumbnailProps) => {
  const isImage = type === 'image' && ext !== 'svg';
  return (
    <figure className={cn('thumbnail flex-center', className)}>
      <Image
        src={isImage ? url : getFileIcon(ext, type)}
        alt='File Thumbnail'
        height={100}
        width={100}
        className={cn(
          'size-8 object-contain',
          imageClassName,
          isImage && 'thumbnail-image'
        )}
      />
    </figure>
  );
};

export default Thumbnail;
