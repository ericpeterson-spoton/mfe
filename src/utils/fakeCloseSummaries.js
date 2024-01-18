import { faker } from '@faker-js/faker';

export const generateCloseSummaries = (employees) => {
  const closeSummaries = [];
  for (let i = 0; i < 100; i++) {
    const employee = faker.helpers.arrayElement(employees);
    const date = faker.date.between({ from: '2023-01-01T00:00:00.000Z', to: '2023-03-01T00:00:00.000Z' });
    closeSummaries.push({
      id: faker.string.uuid(),
      date: date,
      employee_id: employee.id,
      note: faker.lorem.sentence(),
      gross_sales: faker.number.float({ min: 1000, max: 5000 }),
      net_sales: faker.number.float({ min: 500, max: 4500 }),
      inclusive_taxes: faker.number.float({ min: 50, max: 300 }),
      exclusive_taxes: faker.number.float({ min: 50, max: 300 }),
      payment_quantity: faker.number.int({ min: 1, max: 20 }),
      payment_total: faker.number.float({ min: 1000, max: 5000 }),
      paid_in_quantity: faker.number.int({ min: 1, max: 10 }),
      paid_in_total: faker.number.float({ min: 100, max: 1000 }),
      paid_out_total: faker.number.float({ min: 100, max: 1000 }),
      paid_out_quantity: faker.number.int({ min: 1, max: 10 }),
    });
  }

  return closeSummaries;
};