export const kafkaConfigWrapper = {
  kafka: {
    produce: jest.fn().mockImplementation(() => {}),
  },
};
