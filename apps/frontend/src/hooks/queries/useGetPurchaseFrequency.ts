import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PurchaseFrequency, PurchaseFrequencyParams } from '../../types';
import { purchaseService } from '../../services/purchaseService';

export const useGetPurchaseFrequency = (
  params: PurchaseFrequencyParams,
  options?: Omit<UseQueryOptions<PurchaseFrequency[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PurchaseFrequency[], Error>({
    queryKey: ['purchaseFrequency', params],
    queryFn: () => purchaseService.getPurchaseFrequency(params),
    ...options,
  });
};