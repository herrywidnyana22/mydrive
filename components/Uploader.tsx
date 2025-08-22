'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { UploaderProps } from '@/types';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Thumbnail from './Thumbnail';
import { Progress } from './ui/progress';
import { MAX_FILE_SIZE } from '@/constants';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/actions/file.action';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Hover from './Hover';

type UploadingFile = {
  file: File;
  progress: number; // progress tiap file
};

const Uploader = ({ ownerId, accountId, className }: UploaderProps) => {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const path = usePathname();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const uploadingFiles = acceptedFiles.map(file => ({ file, progress: 0 }));
      setFiles(prev => [...prev, ...uploadingFiles]);

      const uploadPromise = acceptedFiles.map(async file => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles(prev => prev.filter(f => f.file.name !== file.name));

          return toast('Gagal menggunggah file!...', {
            description: (
              <p className='body-2 text-muted-foreground'>
                <span className='font-semibold'>{file.name}</span>
                terlalu besar. Maksimal file 50MB.
              </p>
            ),
            className: 'error-toast',
          });
        }

        // 👉 simulasi progress upload
        return new Promise<void>(resolve => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setFiles(prev =>
              prev.map(f => (f.file.name === file.name ? { ...f, progress } : f))
            );
            if (progress >= 100) {
              clearInterval(interval);

              // call API upload asli
              uploadFile({ file, ownerId, accountId, path }).then(uploadedFile => {
                if (uploadedFile) {
                  setFiles(prev => prev.filter(f => f.file.name !== file.name));
                }
                resolve();
              });
            }
          }, 200); // update setiap 200ms
        });
      });

      await Promise.all(uploadPromise);
    },
    [accountId, ownerId, path]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onRemove = useCallback(
    (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
      e.stopPropagation();
      setFiles(prevFiles => prevFiles.filter(f => f.file.name !== fileName));
    },
    []
  );

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Hover asChild text='Upload file disini'>
        <Button
          type='button'
          className={cn('uploader-button hover:bg-brand/10 cursor-pointer', className)}
        >
          <Image
            src={'/assets/icons/upload.svg'}
            height={24}
            width={24}
            alt='upload-icon'
          />
          <p>Upload File</p>
        </Button>
      </Hover>

      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Menggunggah</h4>
          {files.map(({ file, progress }, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className='flex items-center gap-3 w-full'>
                  <Thumbnail type={type} ext={extension} url={convertFileToUrl(file)} />
                  <div className='flex-col items-center w-full'>
                    <div className='preview-item-name'>{file.name}</div>
                    <Hover text={`Menggunggah: ${progress}%`} asChild>
                      <Progress value={progress} />
                    </Hover>
                  </div>
                </div>
                <Hover text='Batal menggunggah'>
                  <Image
                    alt='close-icon'
                    src={'/assets/icons/remove.svg'}
                    height={32}
                    width={32}
                    onClick={e => onRemove(e, file.name)}
                    className='p-1 hover:text-light-400'
                  />
                </Hover>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Uploader;
