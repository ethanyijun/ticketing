import { Subjects } from "./subjects";

export interface UserCreated {
  subject: Subjects.UserCreated;
  data: {
    userId: string;
    userEmail: string;
  };
}
