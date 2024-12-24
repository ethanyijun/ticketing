import { TicketCreatedEvent, Subjects, KafkaConfig } from "@ethtickets/common";
import { NodeMailer } from "../../../nodemailer";
import { TicketCreatedListener } from "../ticket-created-listener";
jest.mock("../../../nodemailer", () => ({
  NodeMailer: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn(),
  })),
}));

describe("TicketCreatedListener", () => {
  let kafkaConfigMock: jest.Mocked<KafkaConfig>;
  let listener: TicketCreatedListener;
  const sendEmailMock = jest.fn();

  beforeEach(() => {
    // Mock the sendEmail method
    (NodeMailer as jest.Mock).mockImplementation(() => ({
      sendEmail: sendEmailMock,
    }));
    kafkaConfigMock = {
      produce: jest.fn(),
      consume: jest.fn(),
    } as unknown as jest.Mocked<KafkaConfig>;
    // Create a new instance of the listener
    listener = new TicketCreatedListener(kafkaConfigMock);
  });

  it("should have the correct subject", () => {
    expect(listener.subject).toEqual(Subjects.TicketCreated);
  });

  it("should send an email when a ticket is created", async () => {
    const eventData: TicketCreatedEvent["data"] = {
      id: "123",
      title: "Test Ticket",
      price: 100,
      userId: "user123",
      userEmail: "user@example.com",
      availableTickets: 2,
      version: 0,
    };

    // Call the onMessage method with mock data
    await listener.onMessage(eventData);

    // Assert that sendEmail was called with correct arguments
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock).toHaveBeenCalledWith(
      "user@example.com",
      "You have new ticket created from ticketing",
      "Ticket: Test Ticket has been created for you."
    );
  });
});
