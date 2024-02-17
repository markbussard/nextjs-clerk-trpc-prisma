import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium  transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-semibold font-montserrat',
  {
    variants: {
      variant: {
        contained: 'text-white',
        outlined:
          'bg-white border border-[var(--cva-color)] text-dark-grey bg-white hover:bg-[#F5F5F5]',
        text: 'bg-transparent border-none '
      },
      color: {
        primary: 'bg-blue-600 text-blue-400',
        secondary: 'bg-teal-400 text-white hover:bg-teal-600',
        darkGrey: 'bg-white text-gray-500'
      },
      size: {
        small: 'h-10 px-3',
        medium: 'h-11 px-4',
        large: 'h-12 px-8'
      }
    },
    compoundVariants: [
      {
        variant: 'contained',
        color: 'primary',
        className: 'bg-blue-600 text-white hover:bg-blue-700'
      },
      {
        variant: 'contained',
        color: 'secondary',
        className: 'bg-teal text-white hover:bg-teal-600'
      },
      {
        variant: 'outlined',
        color: 'primary',
        className:
          'border-2 border-blue-400 bg-white text-blue-400 hover:bg-blue-50'
      },
      {
        variant: 'outlined',
        color: 'secondary',
        className:
          'border-2 border-teal-400 bg-white text-teal-400 hover:bg-teal-50'
      },
      {
        variant: 'outlined',
        color: 'darkGrey',
        className:
          'border-2 border-gray-400 bg-white text-gray-600 hover:gray-50'
      },
      {
        variant: 'text',
        color: 'primary',
        className: 'bg-transparent text-blue-400 hover:bg-blue-50'
      },
      {
        variant: 'text',
        color: 'secondary',
        className: 'bg-transparent text-teal-400 hover:bg-teal-50'
      }
    ],
    defaultVariants: {
      variant: 'contained',
      color: 'primary',
      size: 'medium'
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, color, variant, size, children, ...rest } = props;
    return (
      <button
        type="button"
        className={cn(buttonVariants({ color, variant, size, className }))}
        ref={ref}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
