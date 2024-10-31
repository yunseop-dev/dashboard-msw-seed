import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useGetPurchaseFrequency } from '../hooks/queries';

interface DatePickerProps {
  startDate: string;
  endDate: string;
  onChange: (range: { from: string; to: string }) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  return (
    <div className="flex gap-4 items-center">
      <input
        type="date"
        value={startDate}
        onChange={(e) => onChange({ from: e.target.value, to: endDate })}
        className="border p-2 rounded"
      />
      <span>~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange({ from: startDate, to: e.target.value })}
        className="border p-2 rounded"
      />
    </div>
  );
};

export const PurchaseFrequencyChart = () => {
  const [dateRange, setDateRange] = useState({
    from: '2024-07-01',
    to: '2024-07-31',
  });

  const { data, isLoading } = useGetPurchaseFrequency(dateRange);

  if (isLoading) return <div className="flex justify-center p-4">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">가격대별 구매 빈도</h2>
      <div className="mb-4">
        <DatePicker 
          startDate={dateRange.from}
          endDate={dateRange.to}
          onChange={setDateRange}
        />
      </div>
      <div className="overflow-x-auto">
        <BarChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </div>
    </div>
  );
};