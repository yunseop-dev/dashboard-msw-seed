
import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '../../test-utils';
import { CustomerList } from '../CustomerList';
import * as customerRemotes from '../../services/customerService';
import * as purchaseRemotes from '../../services/purchaseService';
import { mockCustomers, mockPurchases } from '../../mocks/data';

describe('CustomerList', () => {
  it('초기 렌더링 시 고객 목록을 불러와 테이블에 표시합니다.', async () => {
    vi.spyOn(customerRemotes.customerService, 'getCustomers').mockResolvedValue(mockCustomers);

    render(<CustomerList />);

    await screen.findByText(mockCustomers[0].name);
    screen.getByText('ID');
    screen.getByText('이름');
    screen.getByText('구매 횟수');
    screen.getByText('총 구매 금액');
  });

  it('고객 이름으로 검색이 가능합니다.', async () => {
    const getCustomers = vi.spyOn(customerRemotes.customerService, 'getCustomers')
      .mockResolvedValue(mockCustomers);

    render(<CustomerList />);

    const searchInput = screen.getByPlaceholderText('고객 이름 검색');
    await userEvent.type(searchInput, '홍길동');

    expect(getCustomers).toHaveBeenCalledWith({
      name: '홍길동'
    });
  });

  it('총 구매 금액을 기준으로 정렬이 가능합니다.', async () => {
    const getCustomers = vi.spyOn(customerRemotes.customerService, 'getCustomers')
      .mockResolvedValue(mockCustomers);

    render(<CustomerList />);

    const sortHeader = screen.getByText('총 구매 금액');
    await userEvent.click(sortHeader);

    expect(getCustomers).toHaveBeenCalledWith({
      sortBy: 'asc'
    });

    await userEvent.click(sortHeader);
    expect(getCustomers).toHaveBeenCalledWith({
      sortBy: 'desc'
    });
  });

  it('로딩 중일 때는 로딩 스피너를 표시합니다.', async () => {
    vi.spyOn(customerRemotes.customerService, 'getCustomers').mockImplementation(
      () => new Promise(() => { })
    );

    render(<CustomerList />);

    screen.getByTestId('loading-spinner');
  });

  it('구매 내역이 없을 때 메시지를 표시합니다.', async () => {
    vi.spyOn(customerRemotes.customerService, 'getCustomers').mockResolvedValue([]);

    render(<CustomerList />);

    await screen.findByText('데이터가 없습니다');
  });

  it('고객 행을 클릭하면 구매 상세 내역 모달이 열립니다.', async () => {
    vi.spyOn(customerRemotes.customerService, 'getCustomers').mockResolvedValue(mockCustomers);
    const getCustomerPurchases = vi.spyOn(purchaseRemotes.purchaseService, 'getCustomerPurchases')
      .mockResolvedValue(mockPurchases[1]);

    render(<CustomerList />);

    const firstCustomerRow = await screen.findByText(mockCustomers[0].name);
    await userEvent.click(firstCustomerRow);

    screen.getByText('구매 상세 내역');
    expect(getCustomerPurchases).toHaveBeenCalledWith(mockCustomers[0].id);
  });

  it('초기화 버튼을 클릭하면 검색어와 정렬이 초기화됩니다.', async () => {
    const getCustomers = vi.spyOn(customerRemotes.customerService, 'getCustomers')
      .mockResolvedValue(mockCustomers);

    render(<CustomerList />);

    const searchInput = screen.getByPlaceholderText('고객 이름 검색');
    await userEvent.type(searchInput, '홍길동');

    const sortHeader = screen.getByText('총 구매 금액');
    await userEvent.click(sortHeader);

    const resetButton = screen.getByText('초기화');
    await userEvent.click(resetButton);

    expect(getCustomers).toHaveBeenCalledWith({});
  });

  it('모달을 닫을 수 있습니다.', async () => {
    vi.spyOn(customerRemotes.customerService, 'getCustomers').mockResolvedValue(mockCustomers);
    vi.spyOn(purchaseRemotes.purchaseService, 'getCustomerPurchases')
      .mockResolvedValue(mockPurchases[1]);

    render(<CustomerList />);

    const firstCustomerRow = await screen.findByText(mockCustomers[0].name);
    await userEvent.click(firstCustomerRow);

    const closeButton = screen.getByTestId('close-modal');
    await userEvent.click(closeButton);

    expect(screen.queryByText('구매 상세 내역')).toBeNull();
  });
});