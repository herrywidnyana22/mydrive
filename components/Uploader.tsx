'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import Image from 'next/image';
import Hover from './Hover';
import Thumbnail from './Thumbnail';
import { registerUploadedFile } from '@/lib/actions/file.action';
import { MAX_FILE_SIZE } from '@/constants';
import { usePathname } from 'next/navigation';
import { getFileType, convertFileToUrl, cn } from '@/lib/utils';
import { UploaderProps } from '@/types';
import { uploadFileWithProgress } from '@/lib/actions/file.upload';

type UploadingFile = { file: File; progress: number };

const Uploader = ({ ownerId, accountId, className }: UploaderProps) => {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const path = usePathname();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadingFiles = acceptedFiles.map(file => ({ file, progress: 0 }));
    setFiles(prev => [...prev, ...uploadingFiles]);

    const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles(prev => prev.filter(f => f.file.name !== file.name));
        return toast('File terlalu besar (max 50MB)', { className: 'error-toast' });
      }

      try {
        const uploaded = await uploadFileWithProgress({
          file,
          onProgress: (percent) => {
            setFiles(prev =>
              prev.map(f =>
                f.file.name === file.name ? { ...f, progress: percent } : f
              )
            );
          },
        });

        // 🧾 Simpan metadata ke database
        await registerUploadedFile({
          bucketFile: uploaded,
          ownerId,
          accountId,
          path,
        });
        setFiles(prev => prev.filter(f => f.file.name !== file.name));
        toast.success(`${file.name} berhasil diupload`);
      } catch (err) {
        console.error('Upload gagal:', err);
        toast.error(`Gagal upload ${file.name}`);
        setFiles(prev => prev.filter(f => f.file.name !== file.name));
      }
    });

    await Promise.all(uploadPromises);
  }, [accountId, ownerId, path]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onRemove = useCallback(
    (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
      e.stopPropagation();
      setFiles(prev => prev.filter(f => f.file.name !== fileName));
    },
    []
  );

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Hover asChild text='Upload file di sini'>
        <Button type='button' className={cn('uploader-button hover:bg-brand/10', className)}>
          <Image src='/assets/icons/upload.svg' height={24} width={24} alt='upload' />
          <p>Upload File</p>
        </Button>
      </Hover>

      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Mengunggah</h4>
          {files.map(({ file, progress }, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className='flex items-center gap-3 w-full'>
                  <Thumbnail type={type} ext={extension} url={convertFileToUrl(file)} />
                  <div className='flex-col w-full'>
                    <div className='preview-item-name'>{file.name}</div>
                    <Hover text={`Menggunggah: ${progress}%`} asChild>
                      <Progress value={progress} />
                    </Hover>
                  </div>
                </div>
                <Hover text='Batalkan'>
                  <Image
                    alt='close'
                    src='/assets/icons/remove.svg'
                    height={32}
                    width={32}
                    onClick={e => onRemove(e, file.name)}
                    className='p-1 hover:text-light-400 cursor-pointer'
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
