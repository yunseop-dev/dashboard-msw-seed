import React from 'react';
import { useGetCustomerPurchases } from '../hooks/queries';

interface CustomerPurchaseDetailProps {
  customerId: number | null;
}

export const CustomerPurchaseDetail: React.FC<CustomerPurchaseDetailProps> = ({ customerId }) => {
  const { data: purchases, isLoading } = useGetCustomerPurchases(
    customerId || 0,
    { enabled: !!customerId }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {purchases?.map((purchase, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={purchase.imgSrc}
              alt={purchase.product}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{purchase.product}</h3>
              <span className="text-blue-600 font-semibold">
                {purchase.price.toLocaleString()}원
              </span>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>구매일: {new Date(purchase.date).toLocaleDateString()}</p>
              <p>수량: {purchase.quantity}개</p>
              <p>총액: {(purchase.price * purchase.quantity).toLocaleString()}원</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};