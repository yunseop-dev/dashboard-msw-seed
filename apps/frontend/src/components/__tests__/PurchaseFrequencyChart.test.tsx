import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent, waitFor } from '../../test-utils';
import { PurchaseFrequencyChart } from '../PurchaseFrequencyChart';
import * as purchaseRemotes from '../../services/purchaseService';
import { mockPurchaseFrequency } from '../../mocks/data';

describe('PurchaseFrequencyChart', () => {
  it('초기 렌더링 시 기본 날짜 범위로 데이터를 불러옵니다.', async () => {
    const getPurchaseFrequency = vi.spyOn(purchaseRemotes.purchaseService, 'getPurchaseFrequency')
      .mockResolvedValue(mockPurchaseFrequency);

    render(<PurchaseFrequencyChart />);

    expect(getPurchaseFrequency).toHaveBeenCalledWith({
      from: '2024-07-01',
      to: '2024-07-31'
    });
  });

  it('날짜 범위를 변경하면 새로운 데이터를 불러옵니다.', async () => {
    const getPurchaseFrequency = vi.spyOn(purchaseRemotes.purchaseService, 'getPurchaseFrequency')
      .mockResolvedValue(mockPurchaseFrequency);

    render(<PurchaseFrequencyChart />);

    await waitFor(async () => {
      const startDateInput = screen.getByTestId('start-date');
      const endDateInput = screen.getByTestId('end-date');

      await userEvent.clear(startDateInput);
      await userEvent.type(startDateInput, '2024-08-01');
      await userEvent.clear(endDateInput);
      await userEvent.type(endDateInput, '2024-08-31');

      expect(getPurchaseFrequency).toHaveBeenCalledWith({
        from: '2024-08-01',
        to: '2024-08-31'
      });
    })
  });

  it('로딩 중일 때는 로딩 스피너를 표시합니다.', async () => {
    vi.spyOn(purchaseRemotes.purchaseService, 'getPurchaseFrequency')
      .mockImplementation(() => new Promise(() => { }));

    render(<PurchaseFrequencyChart />);

    screen.getByTestId('loading-spinner');
  });

  it('에러가 발생했을 때 에러 메시지를 표시합니다.', async () => {
    vi.spyOn(purchaseRemotes.purchaseService, 'getPurchaseFrequency')
      .mockRejectedValue(new Error('Failed to fetch'));

    render(<PurchaseFrequencyChart />);

    await screen.findByText('데이터를 불러오는데 실패했습니다.');
  });

  it('가격대별 구매 빈도 데이터가 차트에 올바르게 표시됩니다.', async () => {
    vi.spyOn(purchaseRemotes.purchaseService, 'getPurchaseFrequency')
      .mockResolvedValue(mockPurchaseFrequency);

    render(<PurchaseFrequencyChart />);

    await waitFor(() => {
      // 차트 데이터가 올바르게 전달되었는지 확인
      mockPurchaseFrequency.forEach(item => {
        screen.getByText(item.range);
      });
    })
  });

  it('날짜 입력이 유효하지 않으면 에러 메시지를 표시합니다.', async () => {
    vi.spyOn(purchaseRemotes.purchaseService, 'getPurchaseFrequency')
      .mockResolvedValue(mockPurchaseFrequency);

    render(<PurchaseFrequencyChart />);

    await waitFor(async () => {
      const startDateInput = screen.getByTestId('start-date');
      const endDateInput = screen.getByTestId('end-date');
  
      // 종료일이 시작일보다 앞선 경우
      await userEvent.clear(startDateInput);
      await userEvent.type(startDateInput, '2024-08-31');
      await userEvent.clear(endDateInput);
      await userEvent.type(endDateInput, '2024-08-01');
  
      screen.getByText('종료일은 시작일 이후여야 합니다.');
    })
  });

  it('데이터가 없을 때 적절한 메시지를 표시합니다.', async () => {
    vi.spyOn(purchaseRemotes.purchaseService, 'getPurchaseFrequency')
      .mockResolvedValue([]);

    render(<PurchaseFrequencyChart />);

    await screen.findByText('해당 기간에 구매 데이터가 없습니다.');
  });
});