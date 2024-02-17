'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormProps } from 'react-hook-form';
import { type ZodType } from 'zod';

export const useZodForm = <TSchema extends ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & { schema: TSchema }
) => {
  const { schema, ...rest } = props;
  return useForm<TSchema['_input']>({
    resolver: zodResolver(schema),
    ...rest
  });
};
