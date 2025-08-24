import { DetailProps, FileProps, ShareProps } from '@/types';
import Thumbnail from './Thumbnail';
import FileTime from './FileTime';
import { constructFileUrl, convertFileSize, formatDateTime } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Image from 'next/image';
import Hover from './Hover';
import { Loader2 } from 'lucide-react';

const ImageThumbnail = ({ file }: FileProps) => (
  <div className='file-details-thumbnail border border-light-200/40 bg-light-400/50'>
    <Thumbnail
      type={file.type}
      ext={file.extension}
      url={constructFileUrl(file.bucketFileId)}
    />
    <div className='flex flex-col'>
      <p className='subtitle-1 mb-1'>{file.name}</p>
      <FileTime date={file.$createdAt} />
    </div>
  </div>
);

const DetailInfo = ({ value, label }: DetailProps) => (
  <div className='flex'>
    <p className='w-[30%] body-2 text-light-100'>{label}</p>
    <p className='subtitle-2 flex-1'>{value}</p>
  </div>
);

export const FileDetail = ({ file }: FileProps) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className='space-y-4 px-2 pt-2'>
        <DetailInfo label='Format:' value={file.extension} />
        <DetailInfo label='Size:' value={convertFileSize(file.size)} />
        <DetailInfo label='Owner:' value={file.owner.fullName} />
        <DetailInfo label='Last edit:' value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

export const Share = ({ file, onInputChange, onRemove, isLoading }: ShareProps) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className='share-wrapper'>
        <p className='subtitle-2 pl-1 text-light-100'>
          Bagikan file ini dengan orang lain..
        </p>
        <Input
          type='email'
          placeholder='Masukan email orangnya'
          onChange={onInputChange}
          disabled={isLoading}
          className='share-input-field'
        />
        <div className='pt-4'>
          <div className='flex justify-between'>
            <p className='subtitle-2 text-light-100'>Dibagikan:</p>
            <p className='subtitle-2 text-light-200'>{file.users.length} orang</p>
          </div>
          <ul className='pt-2'>
            {file.users.map((email: string, i: number) => (
              <li
                key={`${email}-${i}`}
                className='flex items-center justify-between gap-2'
              >
                <p className='subtitle-2'>{email}</p>
                <Hover text='Berhenti berbagi dengan orang ini?' asChild>
                  <Button onClick={() => onRemove(email)} className='share-remove-user'>
                    {isLoading ? (
                      <Loader2 className='animate-spin text-light-200 size-6' />
                    ) : (
                      <Image
                        alt='remove-icon'
                        src='/assets/icons/remove.svg'
                        height={24}
                        width={24}
                        className='remove-icon'
                      />
                    )}
                  </Button>
                </Hover>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
