import { api } from '../lib/axios';
import { Purchase, PurchaseFrequency, PurchaseFrequencyParams } from '../types';

export const purchaseService = {
  getPurchaseFrequency: async (params?: PurchaseFrequencyParams) => {
    const { data } = await api.get<PurchaseFrequency[]>(`/api/purchase-frequency`, {
      params
    });
    return data;
  },

  getCustomerPurchases: async (customerId: number) => {
    const { data } = await api.get<Purchase[]>(`/api/customers/${customerId}/purchases`);
    return data;
  }
};