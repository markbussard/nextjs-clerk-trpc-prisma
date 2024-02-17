'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { z } from 'zod';

import {
  Button,
  CircularProgress,
  FormHelperText,
  GoogleIcon,
  Label,
  TextInput
} from '~/components';
import { useZodForm } from '~/hooks';

const schema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'You must provide an email address' })
      .email('Please enter a valid email address'),
    password: z.string().min(8, 'Password should be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password should be at least 8 characters')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type FormValues = z.infer<typeof schema>;

export const SignupForm = () => {
  const { signUp, isLoaded: isSignUpLoaded, setActive } = useSignUp();

  const [isPendingVerification, setIsPendingVerification] = useState(false);

  const router = useRouter();

  const zodForm = useZodForm({
    schema,
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSignUpSubmit = useCallback(
    async (values: FormValues) => {
      if (!isSignUpLoaded) {
        return;
      }
      try {
        await signUp.create({
          emailAddress: values.email,
          password: values.password
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code'
        });

        setIsPendingVerification(true);
      } catch (e: unknown) {
        console.error('Error occurred during signin', e);
      }
    },
    [signUp, isSignUpLoaded]
  );

  const onVerificationSubmit = useCallback(
    async (values: FormValues) => {
      if (!isSignUpLoaded) {
        return;
      }

      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: values.email
        });
        if (completeSignUp.status !== 'complete') {
          /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
          console.log(JSON.stringify(completeSignUp, null, 2));
        }
        if (completeSignUp.status === 'complete') {
          await setActive({ session: completeSignUp.createdSessionId });
          router.push('/');
        }
      } catch (err: unknown) {
        console.error('Error occurred while verifying code', err);
      }
    },
    [signUp, isSignUpLoaded, setActive, router]
  );

  const handleGoogleSignUp = useCallback(async () => {
    if (!isSignUpLoaded) {
      return;
    }

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      });
    } catch (e: unknown) {
      console.error('Error occurred while initiating google oauth signin', e);
    }
  }, [isSignUpLoaded, signUp]);

  return (
    <>
      {isPendingVerification ? (
        <>
          <form
            className="mb-6 flex w-3/5 flex-col"
            onSubmit={zodForm.handleSubmit(onSignUpSubmit)}
            id="register-form"
          >
            <div className="mb-6 flex flex-col gap-6">
              <div>
                <Label className="mb-1.5" htmlFor="email-input">
                  Email
                </Label>
                <TextInput
                  id="email-input"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  placeholder="Enter email address"
                  className="py-6 text-base placeholder:text-base"
                  error={zodForm.formState.errors.email}
                  {...zodForm.register('email')}
                />
                <FormHelperText error={zodForm.formState.errors.email} />
              </div>
              <div>
                <Label className="mb-1.5">Password</Label>
                <TextInput
                  type="password"
                  autoComplete="current-password"
                  autoCorrect="off"
                  placeholder="Enter password"
                  className="py-6 placeholder:text-base"
                  error={zodForm.formState.errors.password}
                  {...zodForm.register('password')}
                />
                <FormHelperText error={zodForm.formState.errors.password} />
              </div>
              <div>
                <Label className="mb-1.5">Confirm Password</Label>
                <TextInput
                  type="password"
                  autoComplete="current-password"
                  autoCorrect="off"
                  placeholder="Confirm password"
                  className="py-6 placeholder:text-base"
                  error={zodForm.formState.errors.confirmPassword}
                  {...zodForm.register('confirmPassword')}
                />
                <FormHelperText
                  error={zodForm.formState.errors.confirmPassword}
                />
              </div>
            </div>
            <Button
              type="submit"
              size="large"
              className="text-md gap-2"
              disabled={zodForm.formState.isSubmitting}
            >
              {zodForm.formState.isSubmitting && (
                <CircularProgress className="stroke-white" size={25} />
              )}
              Sign up
            </Button>
          </form>
          <p className="mb-6 text-sm">
            {`Already have an account?`}{' '}
            <Link href="signin" className="text-blue-600">
              Sign in
            </Link>
          </p>
          <div className="mb-6 flex w-full items-center justify-center">
            <div className="flex w-3/5 items-center">
              <div className="border-grey w-2/5 flex-grow border-t"></div>
              <span className="text-dark-grey mx-4 w-1/5 flex-shrink text-center font-semibold">
                or
              </span>
              <div className="border-grey w-2/5 flex-grow border-t"></div>
            </div>
          </div>
          <Button
            size="large"
            className="w-64 gap-2"
            variant="outlined"
            color="darkGrey"
            onClick={handleGoogleSignUp}
          >
            <GoogleIcon />
            Sign up with Google
          </Button>
        </>
      ) : (
        <>
          <form
            className="mb-6 flex w-3/5 flex-col"
            onSubmit={zodForm.handleSubmit(onVerificationSubmit)}
            id="register-form"
          >
            <div className="mb-6 flex flex-col gap-6">
              <div>
                <Label
                  className="font-montserrat mb-2.5 font-semibold"
                  htmlFor="email-input"
                >
                  Verify your email
                </Label>
                <TextInput
                  id="email-input"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  placeholder="Enter email address"
                  className="py-6 text-base placeholder:text-base"
                  error={zodForm.formState.errors.email}
                  {...zodForm.register('email')}
                />
                <FormHelperText error={zodForm.formState.errors.email} />
              </div>
              <div>
                <Label className="font-montserrat mb-2.5 font-semibold">
                  Password
                </Label>
                <TextInput
                  type="password"
                  autoComplete="current-password"
                  autoCorrect="off"
                  placeholder="Enter password"
                  className="py-6 placeholder:text-base"
                  error={zodForm.formState.errors.password}
                  {...zodForm.register('password')}
                />
                <FormHelperText error={zodForm.formState.errors.password} />
              </div>
              <div>
                <Label className="font-montserrat mb-2.5 font-semibold">
                  Confirm Password
                </Label>
                <TextInput
                  type="password"
                  autoComplete="current-password"
                  autoCorrect="off"
                  placeholder="Confirm password"
                  className="py-6 placeholder:text-base"
                  error={zodForm.formState.errors.confirmPassword}
                  {...zodForm.register('confirmPassword')}
                />
                <FormHelperText
                  error={zodForm.formState.errors.confirmPassword}
                />
              </div>
            </div>
            <Button
              type="submit"
              size="large"
              className="text-md gap-2"
              disabled={zodForm.formState.isSubmitting}
            >
              {zodForm.formState.isSubmitting && (
                <CircularProgress className="stroke-white" size={25} />
              )}
              Sign up
            </Button>
          </form>
          <Link href="signin" className="text-blue-600">
            Back to signin
          </Link>
        </>
      )}
    </>
  );
};
