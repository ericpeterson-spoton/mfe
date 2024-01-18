import { faker } from '@faker-js/faker';

export const generateDiscounts = () => {
  const discounts = [];
  for (let i = 0; i < 50; i++) { // Adjust the number of discounts as needed
    const isPercentage = faker.datatype.boolean();
    discounts.push({
      id: faker.string.uuid(),
      name: `Discount ${i}`,
      amount: isPercentage ? 0 : faker.number.float({ min: 5, max: 20 }),
      percentage: isPercentage ? faker.number.float({ min: 1, max: 30 }) : 0,
      is_percentage: isPercentage,
      is_active: faker.helpers.arrayElement(['y', 'n']),
    });
  }
  return discounts;
};
