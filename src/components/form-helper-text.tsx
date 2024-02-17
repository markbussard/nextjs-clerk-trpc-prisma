'use client';

import { forwardRef } from 'react';
import { type FieldError } from 'react-hook-form';

import { cn } from '~/utils';

export type FormHelperTextProps = {
  error?: FieldError;
} & React.HTMLAttributes<HTMLParagraphElement>;

export const FormHelperText = forwardRef<
  HTMLParagraphElement,
  FormHelperTextProps
>((props, ref) => {
  const { className, error, children, ...rest } = props;

  const body = error ? error.message : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn('text-red pl-1 pt-1 text-xs', className)}
      {...rest}
    >
      {body}
    </p>
  );
});

FormHelperText.displayName = 'FormHelperText';
