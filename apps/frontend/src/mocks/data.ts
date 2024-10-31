import { PurchaseFrequency, Customer, Purchase } from "../types";

export const mockPurchaseFrequency: PurchaseFrequency[] = [
  { range: "0 - 20000", count: 10 },
  { range: "20001 - 30000", count: 16 },
  { range: "30001 - 40000", count: 44 },
  { range: "40001 - 50000", count: 28 },
  { range: "50001 - 60000", count: 11 },
  { range: "60001 - 70000", count: 17 },
  { range: "70001 - 80000", count: 0 },
  { range: "80001 - 90000", count: 0 },
  { range: "90001 - 100000", count: 13 }
];

export const mockCustomers: Customer[] = [
  { id: 1, name: "홍길동", count: 9, totalAmount: 740000 },
  { id: 2, name: "김영희", count: 10, totalAmount: 468000 },
  { id: 3, name: "이철수", count: 8, totalAmount: 400000 }
];

export const mockPurchases: Record<number, Purchase[]> = {
  1: [
    {
      date: "2024-07-03",
      quantity: 4,
      product: "코트",
      price: 400000,
      imgSrc: "http://localhost:4000/imgs/coat.jpg"
    },
    {
      date: "2024-07-13",
      quantity: 1,
      product: "코트",
      price: 100000,
      imgSrc: "http://localhost:4000/imgs/coat.jpg"
    }
  ]
};
