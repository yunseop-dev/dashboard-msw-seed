import { delay, http, HttpResponse, type JsonBodyType } from 'msw';
import { mockCustomers, mockPurchaseFrequency, mockPurchases } from './data';

const random = (min: number, max: number = 0) => {
  if (max === 0) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomResponseNotifier = async <
  T extends JsonBodyType,
  U extends JsonBodyType,
>(
  successResponses: {
    response: T;
    status: number;
    headers?: Headers;
  }[],
  failedResponses: {
    response: U;
    status: number;
  }[],
) => {
  const responseList = [
    ...successResponses.map((item) =>
      HttpResponse.json(item.response, {
        status: item.status,
      }),
    ),
    ...failedResponses.map((item) =>
      HttpResponse.json(item.response, {
        status: item.status,
      }),
    ),
  ];
  const len = responseList.length;
  const randomNumber = random(len - 1);
  await delay(random(300, 500));
  return responseList[randomNumber];
};

// Handlers
const getPurchaseFrequency: Parameters<typeof http.get>[1] = async ({ request }) => {
  const url = new URL(request.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  return randomResponseNotifier(
    [{ response: mockPurchaseFrequency, status: 200 }],
    [{ response: { code: 'ERROR', message: 'Failed to fetch purchase frequency' }, status: 500 }]
  );
};

const getCustomers: Parameters<typeof http.get>[1] = async ({ request }) => {
  const url = new URL(request.url);
  const name = url.searchParams.get('name');
  const sortBy = url.searchParams.get('sortBy') as 'asc' | 'desc' | null;

  let filteredCustomers = [...mockCustomers];

  if (name) {
    filteredCustomers = filteredCustomers.filter(customer =>
      customer.name.includes(name)
    );
  }

  if (sortBy) {
    filteredCustomers.sort((a, b) =>
      sortBy === 'asc'
        ? a.totalAmount - b.totalAmount
        : b.totalAmount - a.totalAmount
    );
  }

  return randomResponseNotifier(
    [{ response: filteredCustomers, status: 200 }],
    [{ response: { code: 'ERROR', message: 'Failed to fetch customers' }, status: 500 }]
  );
};

const getCustomerPurchases: Parameters<typeof http.get>[1] = async ({ params }) => {
  const customerId = parseInt(params.id as string);
  const customerPurchases = mockPurchases[customerId];

  if (!customerPurchases) {
    return randomResponseNotifier(
      [],
      [{ response: { code: 'ERROR', message: 'Customer not found' }, status: 404 }]
    );
  }

  return randomResponseNotifier(
    [{ response: customerPurchases, status: 200 }],
    [{ response: { code: 'ERROR', message: 'Failed to fetch customer purchases' }, status: 500 }]
  );
};

export function handlers() {
  return [
    http.get('/api/purchase-frequency', getPurchaseFrequency),
    http.get('/api/customers', getCustomers),
    http.get('/api/customers/:id/purchases', getCustomerPurchases)
  ];
}