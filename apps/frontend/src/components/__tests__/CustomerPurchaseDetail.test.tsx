import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import { CustomerPurchaseDetail } from '../CustomerPurchaseDetail';
import * as purchaseRemotes from '../../services/purchaseService';
import { mockPurchases } from '../../mocks/data';

describe('CustomerPurchaseDetail', () => {
  it('구매 내역을 불러와서 표시합니다.', async () => {
    const customerId = 1;
    const purchases = mockPurchases[customerId];
    vi.spyOn(purchaseRemotes.purchaseService, 'getCustomerPurchases').mockResolvedValue(purchases);

    render(<CustomerPurchaseDetail customerId={customerId} />);

    await screen.findAllByText(purchases[0].product);

    const images = screen.getAllByRole('img');
    expect(images[0].getAttribute('src')).toBe(purchases[0].imgSrc);
    expect(images[0].getAttribute('alt')).toBe(purchases[0].product);
  });

  it('로딩 중일 때는 로딩 스피너를 표시합니다.', async () => {
    vi.spyOn(purchaseRemotes.purchaseService, 'getCustomerPurchases').mockImplementation(
      () => new Promise(() => { })
    );

    render(<CustomerPurchaseDetail customerId={1} />);

    screen.getByTestId('loading-spinner');
  });

  it('구매 내역이 없을 때 메시지를 표시합니다.', async () => {
    vi.spyOn(purchaseRemotes.purchaseService, 'getCustomerPurchases').mockResolvedValue([]);

    render(<CustomerPurchaseDetail customerId={1} />);

    await screen.findByText('구매 내역이 없습니다.');
  });

  it('에러가 발생했을 때 에러 메시지를 표시합니다.', async () => {
    vi.spyOn(purchaseRemotes.purchaseService, 'getCustomerPurchases').mockRejectedValue(
      new Error('Failed to fetch')
    );

    render(<CustomerPurchaseDetail customerId={1} />);

    await screen.findByText('데이터를 불러오는데 실패했습니다.');
  });

  it('각 구매 항목의 총액이 올바르게 계산되어 표시됩니다.', async () => {
    const customerId = 1;
    const purchases = mockPurchases[customerId];
    vi.spyOn(purchaseRemotes.purchaseService, 'getCustomerPurchases').mockResolvedValue(purchases);

    render(<CustomerPurchaseDetail customerId={customerId} />);

    const totalAmount = (purchases[0].price * purchases[0].quantity).toLocaleString();
    await screen.findByText(`총액: ${totalAmount}원`);
  });
});