'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from './ui/input';

type AuthFormType = 'login' | 'register';

const formSchema = z.object({
  fullname: z
    .string()
    .min(2, {
      message: 'fullname must be at least 2 characters.',
    })
    .max(50, {
      message: 'fullname maximum 50 characters.',
    }),
});

const AuthForm = ({ type }: { type: AuthFormType }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='auth-form'>
          <FormField
            control={form.control}
            name='fullname'
            render={({ field }) => (
              <FormItem>
                <div className='form-item'>
                  <FormLabel className='form-label'>Fullname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your full naame'
                      className='input'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='fullname'
            render={({ field }) => (
              <FormItem>
                <div className='form-item'>
                  <FormLabel className='form-label'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email' className='input' {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type='submit' className='submit-btn'>
            {type === 'login' ? 'Login' : 'Register'}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
