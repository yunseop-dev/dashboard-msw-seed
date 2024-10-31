import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Customer, GetCustomersParams } from '../../types';
import { customerService } from '../../services/customerService';

export const useGetCustomers = (
  params: GetCustomersParams,
  options?: Omit<UseQueryOptions<Customer[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Customer[], Error>({
    queryKey: ['customers', params],
    queryFn: () => customerService.getCustomers(params),
    ...options,
  });
};