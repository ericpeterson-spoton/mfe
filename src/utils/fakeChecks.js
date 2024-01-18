import { faker } from '@faker-js/faker';

export const generateChecks = (orders, discounts, closeSummaries, employees) => {
  const checks = [];

  orders.forEach(order => {
    const discount = faker.helpers.arrayElement(discounts);
    const closeSummary = faker.helpers.arrayElement(closeSummaries);
    const employee = faker.helpers.arrayElement(employees);
    const subtotal = faker.number.float({ min: 50, max: 300 });
    const exclusiveTaxes = subtotal * 0.1; // Example tax rate
    const inclusiveTaxes = subtotal * 0.05; // Example tax rate
    const total = subtotal + exclusiveTaxes + inclusiveTaxes;

    checks.push({
      id: faker.string.uuid(),
      close_summary_id: closeSummary.id,
      order_id: order.id,
      discount_id: discount.id,
      check_total: total,
      check_subtotal: subtotal,
      surcharge_total: faker.number.float({ min: 5, max: 20 }),
      discounts_total: discount.is_percentage ? subtotal * (discount.percentage / 100) : discount.amount,
      void_total: faker.number.float({ min: 0, max: 10 }),
      exclusive_taxes: exclusiveTaxes,
      inclusive_taxes: inclusiveTaxes,
      tips_total: total * 0.15,  
      auto_gratuity_total: faker.number.float({ min: 5, max: 25 }),
      employee_id: employee.id
    });
  });

  return checks;
};

