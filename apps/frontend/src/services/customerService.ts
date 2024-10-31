import { api } from '../lib/axios';
import { Customer } from '../types';

export const customerService = {
  getCustomers: async () => {
    const { data } = await api.get<Customer[]>('/api/customers');
    return data;
  }
};