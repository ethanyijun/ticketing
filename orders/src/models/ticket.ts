// import mongoose from "mongoose";
// // import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// // An interface that describes the properties
// // that are requried to create a new Ticket
// interface TicketAttrs {
//   title: string;
//   price: number;
//   isReserved: boolean;
//   id: string;
// }

// // An interface that describes the properties
// // that a Ticket Document has
// interface TicketDoc extends mongoose.Document {
//   title: string;
//   price: number;
//   version: number;
//   isReserved: boolean;
// }

// // An interface that describes the properties
// // that a Ticket Model has
// interface TicketModel extends mongoose.Model<TicketDoc> {
//   build(attrs: TicketAttrs): TicketDoc;
//   findByEvent(event: {
//     id: string;
//     version: number;
//   }): Promise<TicketDoc | null>;
// }

// const ticketSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     isReserved: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//   },
//   {
//     toJSON: {
//       transform(doc, ret) {
//         ret.id = ret._id;
//         delete ret._id;
//         // delete ret.__v;
//       },
//     },
//   }
// );

// ticketSchema.statics.build = (attrs: TicketAttrs) => {
//   return new Ticket({
//     _id: attrs.id,
//     title: attrs.title,
//     price: attrs.price,
//     isReserved: attrs.isReserved,
//   });
// };
// ticketSchema.set("versionKey", "version");
// // ticketSchema.plugin(updateIfCurrentPlugin);
// ticketSchema.pre("save", function (done) {
//   this.$where = {
//     version: this.get("version") - 1,
//   };
//   done();
// });

// ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
//   return Ticket.findOne({
//     _id: event.id,
//     version: event.version - 1,
//   });
// };
// const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

// export { Ticket };
import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  isReserved: boolean;
  id: string;
  // userId: string;
}

// An interface that describes the properties
// that a Ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  // userId: string;
  version: number;
  orderId: string;
  isReserved: boolean;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // userId: {
    //   type: String,
    //   required: true,
    // },
    isReserved: {
      type: Boolean,
      required: true,
      default: false,
    },
    orderId: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
ticketSchema.set("versionKey", "version");
// ticketSchema.pre("save", function (done) {
//   this.$where = {
//     version: this.get("version") - 1,
//   };
//   done();
// });
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // return new Ticket(attrs);
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    isReserved: attrs.isReserved,
  });
};
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
