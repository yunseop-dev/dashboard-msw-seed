import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Purchase } from '../../types';
import { purchaseService } from '../../services/purchaseService';

export const useGetCustomerPurchases = (
  customerId: number,
  options?: Omit<UseQueryOptions<Purchase[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Purchase[], Error>({
    queryKey: ['customerPurchases', customerId],
    queryFn: () => purchaseService.getCustomerPurchases(customerId),
    ...options,
  });
};