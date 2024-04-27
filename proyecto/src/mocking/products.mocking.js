import { faker } from "@faker-js/faker";

//faker.locale = "en";

export const generateProduct = () => {
  return {
    id:faker.number.int({ max: 100 }),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    code: faker.string.uuid(),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
    stock: faker.number.int({ max: 100 }),
    category: faker.helpers.arrayElement(["a","b","c","d"]),
    thumbnails: faker.helpers.arrayElement(["url_image1", "url_image2"]),
  };
};