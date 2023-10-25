export const kafkaWrapper = {
  kafka: {
    producer: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockImplementation(() => {}),
      disconnect: jest.fn().mockImplementation(() => {}),
      send: jest.fn().mockImplementation(({}: any) => {}),
    })),
  },
};
