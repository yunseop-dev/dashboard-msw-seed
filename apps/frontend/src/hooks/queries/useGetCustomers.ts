import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Customer } from '../../types';
import { customerService } from '../../services/customerService';

export const useGetCustomers = (
  options?: Omit<UseQueryOptions<Customer[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: () => customerService.getCustomers(),
    ...options,
  });
};