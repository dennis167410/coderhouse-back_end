import { faker } from "@faker-js/faker";

export const generateCart = () => {
  return {
    id:faker.number.int({ max: 10 }),
    product: {
            id: faker.number.int({ max: 100 }),
            quantity: faker.number.int({ max: 100 })
        }, 
  };
};