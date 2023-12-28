export const kafkaConfigWrapper = {
  kafka: {
    produce: jest.fn().mockImplementation(() => {}),
    consume: jest.fn().mockImplementation(() => {}),
  },
};
