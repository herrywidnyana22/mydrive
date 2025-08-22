import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { CustomButtonProps } from '@/types';
import Image from 'next/image';

const ButtonCustom = ({
  type = 'button',
  children,
  isLoading,
  onClick,
  className,
}: CustomButtonProps) => {
  return (
    <Button
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className={cn('bg-brand hover:bg-brand/70 cursor-pointer', className)}
    >
      {children}
      {isLoading && (
        <Image
          src={'assets/icons/loader.svg'}
          alt='loading-icon'
          height={20}
          width={20}
          className='animate-spin'
        />
      )}
    </Button>
  );
};

export default ButtonCustom;
