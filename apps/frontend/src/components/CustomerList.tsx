import { useState } from 'react';
import { useGetCustomers } from '../hooks/queries';
import { CustomerPurchaseDetail } from './CustomerPurchaseDetail';
import { Modal } from './Modal';

type SortOrder = 'asc' | 'desc';

export const CustomerList = () => {
  const [searchName, setSearchName] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOrder>();

  const { data: customers = [], isLoading } = useGetCustomers({
    sortBy,
    name: searchName || undefined,
  });

  const handleReset = () => {
    setSearchName('');
    setSortBy(undefined);
  };

  const handleSort = () => {
    setSortBy(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">고객 목록</h2>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="고객 이름 검색"
              className="w-full border p-2 rounded pr-10"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            {searchName && (
              <button
                onClick={() => setSearchName('')}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ⨉
              </button>
            )}
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            초기화
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  구매 횟수
                </th>
                <th
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 select-none group"
                  onClick={() => handleSort()}
                >
                  총 구매 금액
                  {sortBy ? (
                    <span className="ml-1 inline-block">
                      {sortBy === 'asc' ? '↑' : '↓'}
                    </span>
                  ) : (
                    <span className="ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ↕
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr data-testid="loading-spinner">
                  <td colSpan={4} className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : customers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {customer.totalAmount.toLocaleString()}원
                  </td>
                </tr>
              ))}
              {!isLoading && customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    데이터가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={selectedCustomerId !== null}
        onClose={() => setSelectedCustomerId(null)}
        title="구매 상세 내역"
      >
        <CustomerPurchaseDetail customerId={selectedCustomerId} />
      </Modal>
    </>
  );
};