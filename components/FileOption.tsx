'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fileOptionItems } from '@/constants';
import { constructDownloadUrl, getFileName } from '@/lib/utils';
import { FileProps, OptionActionProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import ButtonCustom from './Button-custom';
import { renameFile, updateSharedFile } from '@/lib/actions/file.action';
import { usePathname } from 'next/navigation';
import { FileDetail, Share } from './FileOptionModal';

const FileOption = ({ file }: FileProps) => {
  const name = getFileName(file.name);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [action, setAction] = useState<OptionActionProps | null>(null);
  const [fileName, setFileName] = useState(name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>(file.users ?? []);

  const pathName = usePathname();

  const closeAll = () => {
    setIsLoading(false);
    setIsModalOpen(false);
    setIsOptionOpen(false);
  };

  const onAction = async () => {
    if (!action) return;

    setIsLoading(true);
    let success = false;
    const executions = {
      share: async () =>
        await updateSharedFile({ fileId: file.$id, emails, path: pathName }),
      delete: () => console.log('delete'),
      rename: async () =>
        await renameFile({
          fileId: file.$id,
          name: fileName,
          ext: file.extension,
          path: pathName,
        }),
    };

    success = await executions[action.value as keyof typeof executions]();

    if (success) {
      closeAll();
    }

    setIsLoading(false);
  };

  const onCancel = () => {
    closeAll();
    setFileName(name);
  };

  const onUnshareUser = async (email: string) => {
    setIsLoading(true);
    const updatedEmails = emails.filter(e => e !== email);

    const action = await updateSharedFile({ fileId: file.$id, emails, path: pathName });

    if (action) {
      setEmails(updatedEmails);
    }
    closeAll();
  };

  const onInputShareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // cek kalau ada koma (,) atau enter-like separator
    if (value.includes(',')) {
      const parts = value
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);

      setEmails(prev => [...new Set([...prev, ...parts])]);

      // kosongkan input lagi
      e.target.value = '';
    }
  };

  const onModalOpen = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className='dialog'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>{label}</DialogTitle>
          {value === 'rename' && (
            <Input
              type='text'
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              className='rename-input-field'
            />
          )}
          {value === 'details' && <FileDetail file={file} />}
          {value === 'share' && (
            <Share
              file={file}
              onInputChange={onInputShareChange}
              onRemove={onUnshareUser}
              isLoading={isLoading}
            />
          )}
        </DialogHeader>
        {['rename', 'delete', 'share'].includes(value) && (
          <DialogFooter>
            <div className='w-full flex flex-col justify-between gap-2 md:flex-row'>
              <Button
                variant={'outline'}
                onClick={onCancel}
                className='cursor-pointer modal-cancel-button'
              >
                Cancel
              </Button>
              <ButtonCustom
                onClick={onAction}
                isLoading={isLoading}
                className='modal-submit-button'
              >
                <p>{label}</p>
              </ButtonCustom>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isOptionOpen} onOpenChange={setIsOptionOpen}>
        <DropdownMenuTrigger className='no-focus'>
          <Image
            alt='option icon'
            src={'./assets/icons/dots.svg'}
            width={35}
            height={35}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {fileOptionItems.map((option, i) => (
            <DropdownMenuItem
              key={`${option.value}-${i}`}
              onClick={() => {
                setAction(option);
                if (['rename', 'share', 'delete', 'details'].includes(option.value)) {
                  setIsModalOpen(true);
                }
              }}
              className='option-item'
            >
              {option.value === 'download' ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className='flex items-center gap-2'
                >
                  <Image src={option.icon} alt={option.label} height={30} width={30} />
                  {option.label}
                </Link>
              ) : (
                <div className='flex items-center gap-2'>
                  <Image src={option.icon} alt={option.label} height={30} width={30} />
                  {option.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {onModalOpen()}
    </Dialog>
  );
};

export default FileOption;
