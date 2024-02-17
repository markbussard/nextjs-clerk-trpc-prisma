import { Loader2, type LucideProps } from 'lucide-react';

import { cn } from '~/utils';

export type CircularProgressProps = LucideProps;

export const CircularProgress = (props: CircularProgressProps) => {
  const { className, size = 20, ...rest } = props;
  return (
    <Loader2
      className={cn('animate-spin stroke-blue-400', className)}
      size={size}
      {...rest}
    />
  );
};
