import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    ticket: {
      id: string;
    };
    version: number;
    id: string;
  };
}
