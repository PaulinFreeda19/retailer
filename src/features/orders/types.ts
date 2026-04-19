export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "Pending" | "Completed";
}