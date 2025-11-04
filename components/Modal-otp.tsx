'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { sendEmailOTP, verifyOTP } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type ModalOtpProps = {
  accountId: string;
  email: string;
};

const ModalOtp = ({ accountId, email }: ModalOtpProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [passcode, setPassCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const onSubmit = async (code?: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    const otp = code ?? passcode;
    if (otp.length < 6 || isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);
    try {
      const sessionId = await verifyOTP({ accountId, passcode: otp });
      if (sessionId) {
        setIsOpen(false);
        router.push('/');
      }
    } catch (error) {
      console.log('Failed to verify OTP:', error);
      setErrorMessage('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOTP = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await sendEmailOTP({ email });
    } catch (error) {
      console.log('Failed to resend OTP:', error);
      setErrorMessage('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setPassCode(value);
    if (value.length === 6) {
      onSubmit(value);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent
        className={`alert-dialog transition-all duration-300 ${
          isLoading ? 'backdrop-blur-sm pointer-events-none' : ''
        }`}
      >
        {isLoading && (
          <div
            className="
              absolute inset-0 z-50 flex flex-col items-center justify-center
              rounded-xl bg-white/80 backdrop-blur-md
              border border-gray-100 shadow-inner
              transition-all duration-300
            "
          >
            <Image
              src="/assets/icons/loader-brand.svg"
              alt="loading-icon"
              height={40}
              width={40}
              className="animate-spin mb-4"
            />
            <p className="text-sm font-medium text-muted-foreground">Verifying OTP...</p>
          </div>
        )}

        <AlertDialogHeader className='relative flex justify-center'>
          <AlertDialogTitle className='h2 text-center'>
            Enter your OTP Code
            <Image
              src={'/assets/icons/remove.svg'}
              alt='close-icon'
              height={20}
              width={20}
              className='otp-close-button cursor-pointer'
              onClick={() => setIsOpen(false)}
            />
          </AlertDialogTitle>

          <AlertDialogDescription className='subtitle-2 text-center text-muted-foreground'>
            We&apos;ve sent a 6-digit OTP code to{' '}
            <span className='pl-1 text-brand'>{email}</span>.<br />
            Please enter it below to verify your account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP
          maxLength={6}
          value={passcode}
          disabled={isLoading}
          onChange={handleChange}
        >
          <InputOTPGroup className='otp mt-3'>
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot key={i} index={i} className='otp-slot' />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className='flex w-full flex-col gap-4'>
            <div className='subtitle-2 mt-2 text-center text-error'>{errorMessage}</div>
            <div className='subtitle-2 text-center text-muted-foreground'>
              Didn&apos;t receive the code?
              <Button
                type='button'
                variant='link'
                className='pl-1 text-brand hover:underline cursor-pointer'
                onClick={onResendOTP}
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalOtp;
