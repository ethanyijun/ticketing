export const kafkaConfigWrapper = {
  kafka: {
    produce: jest.fn().mockImplementation(() => {}),
  },
  connect: jest.fn().mockImplementation(() => {}),
};
