'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import Link from 'next/link';
import { createAccount, login } from '@/lib/actions/user.actions';
import ModalOtp from './Modal-otp';
import ButtonCustom from './Button-custom';

type AuthFormType = 'login' | 'register';

const authSchema = (formType: AuthFormType) => {
  return z.object({
    fullname:
      formType === 'register'
        ? z
            .string()
            .min(2, {
              message: 'fullname must be at least 2 characters.',
            })
            .max(50, {
              message: 'fullname maximum 50 characters.',
            })
        : z.string().optional(),

    email: z.email({
      message: 'Please enter a valid email address.',
    }),
  });
};
const FormAuth = ({ type }: { type: AuthFormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState('');
  const [accountId, setAccountId] = useState('');

  const formSchema = authSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const user =
        type === 'login'
          ? await login({ email: values.email })
          : await createAccount({
              fullName: values.fullname || '',
              email: values.email,
            });

      if (!user || !user.accountId) {
        form.setError('email', {
          type: 'manual',
          message:
            user?.error ||
            (type === 'login'
              ? 'Email not found. Please register first.'
              : 'This email is already registered.'),
        });
        return;
      }

      setAccountId(user.accountId);
    } catch (error) {
      form.setError('email', {
        type: 'manual',
        message:
          error instanceof z.ZodError ? error.issues[0].message : 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='auth-form'>
          <h1 className='form-title'>
            {type === 'login' ? 'Login to your account' : 'Create a new account'}
          </h1>
          {type === 'register' && (
            <FormField
              control={form.control}
              disabled={isLoading}
              name='fullname'
              render={({ field }) => (
                <FormItem>
                  <div className='form-item'>
                    <FormLabel className='form-label'>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your full name'
                        className='form-input'
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='form-message' />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            disabled={isLoading}
            name='email'
            render={({ field }) => (
              <FormItem>
                <div className='form-item'>
                  <FormLabel className='form-label'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your email'
                      className='form-input'
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className='form-message' />
              </FormItem>
            )}
          />
          <ButtonCustom
            type='submit'
            isLoading={isLoading}
            className='form-submit-button cursor-pointer'
          >
            {type === 'login' ? 'Login' : 'Register'}
          </ButtonCustom>
          {/* {errorMsg && <p className='error-message'>{errorMsg}</p>} */}

          <div className='body-2 flex justify-center'>
            <p className='text-muted-foreground'>
              {type === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <Link
                href={type === 'login' ? '/register' : '/login'}
                className='ml-1 font-medium text-brand hover:underline'
              >
                {type === 'login' ? 'Register' : 'Login'}
              </Link>
            </p>
          </div>
        </form>
      </Form>

      {accountId && <ModalOtp email={form.getValues('email')} accountId={accountId} />}
    </>
  );
};

export default FormAuth;
