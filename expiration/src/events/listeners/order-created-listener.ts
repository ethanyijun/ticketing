import { Listener, OrderCreatedEvent, Subjects } from "@ethtickets/common";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  service = "expiration";
  async onMessage(data: OrderCreatedEvent["data"]) {
    const { id: orderId } = data;
    const deplay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(
      "waiting for this many malliseconds to process the job",
      deplay
    );
    await expirationQueue.add({ orderId }, { delay: deplay });
  }
  readonly subject = Subjects.OrderCreated;
}
