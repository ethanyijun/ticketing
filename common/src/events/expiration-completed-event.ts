import { Subjects } from "./subjects";

export interface ExpirationCompleted {
  subject: Subjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}
