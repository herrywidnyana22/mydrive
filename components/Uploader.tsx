'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { UploaderProps } from '@/types';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import { UploadCloud, X } from 'lucide-react';
import Thumbnail from './Thumbnail';
import Hover from './Hover';
import { Progress } from './ui/progress';
import { MAX_FILE_SIZE } from '@/constants';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/actions/file.action';
import { usePathname } from 'next/navigation';

const Uploader = ({ ownerId, accountId, className }: UploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const path = usePathname();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      const uploadPromise = acceptedFiles.map(async file => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles(prevFile => prevFile.filter(f => f.name !== file.name));

          return toast('Gagal menggungah file!...', {
            description: (
              <p className='body-2 text-muted-foreground'>
                <span className='font-semibold'>{file.name}</span>
                terlalu besar. Maksimal file 50MB.
              </p>
            ),
            className: 'error-toast',
          });
        }

        return uploadFile({ file, ownerId, accountId, path }).then(uploadedFile => {
          if (uploadedFile) {
            setFiles(prevFile => prevFile.filter(f => f.name !== file.name));
          }
        });
      });

      await Promise.all(uploadPromise);
    },
    [accountId, ownerId, path]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onRemove = useCallback((e: React.MouseEvent<SVGSVGElement>, fileName: string) => {
    e.stopPropagation();
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  }, []);

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button
        type='button'
        className={cn('uploader-button hover:bg-brand/10 cursor-pointer', className)}
      >
        <UploadCloud />
        <p>Upload File</p>
      </Button>

      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className='flex items-center gap-3 w-full'>
                  <Thumbnail type={type} ext={extension} url={convertFileToUrl(file)} />
                  <div className='flex-col items-center w-full'>
                    <div className='preview-item-name'>{file.name}</div>
                    <Hover text={`Sedang mengunggah: ${progressValue}%`} asChild>
                      <Progress value={progressValue} />
                    </Hover>
                  </div>
                </div>
                <Hover text='Cancel upload' asChild>
                  <X
                    size={25}
                    onClick={e => onRemove(e, file.name)}
                    className='p-1 hover:text-light-400 hover:rounded-full hover:bg-brand'
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
