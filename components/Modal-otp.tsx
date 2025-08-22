'use client';

import {
  AlertDialog,
  AlertDialogAction,
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

  const onSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (passcode.length < 6 || isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);
    try {
      const sessionId = await verifyOTP({ accountId, passcode });
      if (sessionId) {
        setIsOpen(false);
        router.push('/'); // Redirect to dashboard or desired page
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

  // ✅ Run when OTP input changes
  const handleChange = (value: string) => {
    setPassCode(value);
    if (value.length === 6) {
      onSubmit(); // Auto-submit when full
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className='alert-dialog'>
        <AlertDialogHeader className='relative flex justify-center'>
          <AlertDialogTitle className='h2 text-center'>
            Enter your OTP Code
            <Image
              src={'/assets/icons/remove.svg'}
              alt='close-icon'
              height={20}
              width={20}
              className='otp-close-button'
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
            <InputOTPSlot index={0} className='otp-slot' />
            <InputOTPSlot index={1} className='otp-slot' />
            <InputOTPSlot index={2} className='otp-slot' />
            <InputOTPSlot index={3} className='otp-slot' />
            <InputOTPSlot index={4} className='otp-slot' />
            <InputOTPSlot index={5} className='otp-slot' />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className='flex w-full flex-col gap-4'>
            <AlertDialogAction
              onClick={onSubmit}
              type='button'
              className='submit-btn h-12'
              disabled={isLoading || passcode.length < 6}
            >
              Continue
              {isLoading && (
                <Image
                  src={'assets/icons/loader.svg'}
                  alt='loading-icon'
                  height={20}
                  width={20}
                  className='animate-spin'
                />
              )}
            </AlertDialogAction>

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
