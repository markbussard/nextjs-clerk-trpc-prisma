import { forwardRef } from 'react';
import { type FieldError } from 'react-hook-form';

import { cn } from '~/utils';

export type TextInputProps = {
  error?: FieldError;
  startIcon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const { className, error, startIcon, ...rest } = props;
    return (
      <div className="sm:col-span-3">
        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            className={cn(
              `block h-10 w-full rounded-md border-0 py-2.5 pr-5 ${
                startIcon ? 'pl-14' : 'pl-5'
              } ring-1 ring-inset ${
                error ? 'ring-red-600' : 'ring-gray-300'
              } placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset ${
                error ? 'focus:ring-red-600' : 'focus:ring-blue-600'
              }`,
              className
            )}
            {...rest}
          />
        </div>
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
