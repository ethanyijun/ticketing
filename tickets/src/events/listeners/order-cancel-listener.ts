// import { Listener } from "@ethtickets/common";
// import { Order } from "../../models/order";

// export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
//   async onMessage(data: OrderUpdatedEvent["data"]): Promise<void> {
//     const { id, title, price, version } = data;
//     const order = await Order.findByEvent({ id, version });

//     if (!Order) {
//       console.log("Not found!!!");
//       return;
//     }
//     order.set({ title, price, version });
//     await order.save();
//   }
//   readonly subject = Subjects.OrderUpdated;
// }
