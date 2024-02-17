import { forwardRef } from 'react';

import { cn } from '~/utils';

export type LabelProps = {
  required?: boolean;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const { className, children, required, ...rest } = props;
  return (
    <label
      ref={ref}
      className={cn(
        'block text-base font-normal leading-6',
        required &&
          "after:ml-1 after:inline after:align-middle after:content-['*']",
        className
      )}
      {...rest}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';
