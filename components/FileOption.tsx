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
import { deleteFile, renameFile, updateSharedFile } from '@/lib/actions/file.action';
import { usePathname } from 'next/navigation';
import { FileDetail, Share } from './FileOptionModal';
import { z } from 'zod';
import { toast } from 'sonner';

const FileOption = ({ file }: FileProps) => {
  const name = getFileName(file.name);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [action, setAction] = useState<OptionActionProps | null>(null);
  const [fileName, setFileName] = useState(name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>(file.users ?? []);
  const [inputShareValue, setInputShareValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const pathName = usePathname();

  const emailSchema = z.email('Invalid email address');

  const closeAll = () => {
    setIsLoading(false);
    setIsModalOpen(false);
    setIsOptionOpen(false);
    setErrorMsg('');
  };

  const onAction = async () => {
    if (!action) return;

    setIsLoading(true);
    let success = false;
    const executions = {
      share: () => onShareEmail(),
      delete: () => onDeleteFile(),
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
      toast.success(`${action.label} file berhasil`, {
        duration: 3000,
        description: (
          <p className='text-neutral-800'>
            <span className='text-brand'>{file.name}</span> berhasil di{action.value}
          </p>
        ),
      });
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

    const action = await updateSharedFile({
      fileId: file.$id,
      email,
      path: pathName,
      mode: 'unshare',
    });

    if (action) {
      setEmails(updatedEmails);
    }
    setIsLoading(false);
  };

  const onDeleteFile = async () => {
    try {
      const res = await deleteFile({
        fileId: file.$id,
        bucketFileId: file.bucketFileId,
        path: pathName,
      });

      return res;
    } catch (error) {
      return toast.error((error as Error).message);
    }
  };

  const onShareEmail = async () => {
    try {
      const newEmail = emailSchema.parse(inputShareValue.trim());

      if (emails.includes(newEmail)) {
        setErrorMsg(`${inputShareValue} sudah ada`);
        setIsLoading(false);
        return;
      }

      const updatedEmails = [...emails, newEmail]; // build new list
      setEmails(updatedEmails);

      setInputShareValue(''); // reset input
      const res = await updateSharedFile({
        fileId: file.$id,
        email: newEmail, // use fresh list
        path: pathName,
        mode: 'share',
      });

      return res; // so onAction gets success
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrorMsg(err.issues[0].message);
      } else {
        setErrorMsg((err as Error).message);
      }
      return false;
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
              setInputShareValue={setInputShareValue}
              onRemove={onUnshareUser}
              errorMsg={errorMsg}
              isLoading={isLoading}
            />
          )}
          {value === 'delete' && (
            <p className='delete-confirmation'>
              Yakin ingin menghapus <span className='delete-file-name'>{file.name}</span>?
            </p>
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
            width={30}
            height={30}
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
