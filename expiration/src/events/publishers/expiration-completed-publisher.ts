import { Publisher, Subjects, ExpirationCompleted } from "@ethtickets/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleted> {
  readonly subject = Subjects.ExpirationComplete;
}
