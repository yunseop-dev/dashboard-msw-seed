import { api } from '../lib/axios';
import { Customer, GetCustomersParams } from '../types';

export const customerService = {
  getCustomers: async (params?: GetCustomersParams) => {
    const { data } = await api.get<Customer[]>(`/api/customers`, {
      params
    });
    return data;
  }
};