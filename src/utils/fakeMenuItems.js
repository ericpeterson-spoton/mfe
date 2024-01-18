import { faker } from '@faker-js/faker';

export const generateMenuItems = () => {
  const categories = ['beer', 'food', 'N/A', 'merchandise'];
  const menuItems = [];

  for (let i = 0; i < 100; i++) {
    const category = faker.helpers.arrayElement(categories);
    const price = faker.number.float({ min: 5, max: 100 });
    const cost = price * faker.number.float({ min: 0.1, max: 0.2 });

    menuItems.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      category,
      price,
      cost,
      current_item: faker.helpers.arrayElement(['Y', 'N']),
      is_taxable: faker.helpers.arrayElement(['Y', 'N'])
    });
  }

  return menuItems;
};

