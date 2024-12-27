import { Listener, Subjects, ExpirationCompleted } from "@ethtickets/common";

export class ExpirationCompletedListener extends Listener<ExpirationCompleted> {
  service = "email";

  async onMessage(data: ExpirationCompleted["data"]) {}
  readonly subject = Subjects.ExpirationComplete;
}
