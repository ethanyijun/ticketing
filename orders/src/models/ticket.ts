import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  version: string;
  isReserved: boolean;
}

// An interface that describes the properties
// that a Ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: string;
  isReserved: boolean;
}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
      min: 0,
    },
    version: {
      type: String,
      required: true,
    },
    isReserved: {
      type: Boolean,
      required: true,
      default: false,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
