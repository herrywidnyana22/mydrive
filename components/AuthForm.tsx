'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

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
const AuthForm = ({ type }: { type: AuthFormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formSchema = authSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
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
                        placeholder='Enter your full naame'
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
          <Button
            type='submit'
            disabled={isLoading}
            className='form-submit-button cursor-pointer'
          >
            {type === 'login' ? 'Login' : 'Register'}
            {isLoading && <Loader2 size={24} className='animate-spin' />}
          </Button>
          {errorMsg && <p className='error-message'>{errorMsg}</p>}

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
    </>
  );
};

export default AuthForm;
