import React, { useMemo, useState } from 'react';
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
        data-testid="start-date"
        type="date"
        value={startDate}
        onChange={(e) => onChange({ from: e.target.value, to: endDate })}
        className="border p-2 rounded"
      />
      <span>~</span>
      <input
        data-testid="end-date"
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
  const enabled = useMemo(() => new Date(dateRange.from).getTime() < new Date(dateRange.to).getTime(), [dateRange]);

  const { data, isLoading, isError } = useGetPurchaseFrequency(dateRange, {
    enabled,
  });

  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="flex justify-center items-center p-8 h-[34.5rem]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center p-8 h-[34.5rem]">
        데이터를 불러오는데 실패했습니다.
      </div>
    );
  }

  if (!isLoading && data?.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 h-[34.5rem]">
        해당 기간에 구매 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">가격대별 구매 빈도</h2>
      <div className="mb-4">
        <DatePicker
          startDate={dateRange.from}
          endDate={dateRange.to}
          onChange={setDateRange}
        />
        {!enabled && <span className='text-red-500'>종료일은 시작일 이후여야 합니다.</span>}
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