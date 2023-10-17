import { Publisher, Subjects, OrderCancelledEvent } from "@ethtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderDeleted;
}
