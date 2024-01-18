import { faker } from '@faker-js/faker';

export const generateReconciliations = (closeSummaries) => {
  const reconciliations = [];
  closeSummaries.forEach(summary => {
    reconciliations.push({
      id: faker.string.uuid(),
      close_summary_id: summary.id,
      reconciliation_type: faker.helpers.arrayElement(['Employee', 'Team']),
      cash_open: faker.number.float({ min: 100, max: 1000 }),
      net_sales: summary.net_sales,
      payments_cash: faker.number.float({ min: 100, max: 1000 }),
      payments_non_cash: faker.number.float({ min: 100, max: 1000 }),
      payments_total: faker.number.float({ min: 200, max: 2000 }),
      tips_non_cash: faker.number.float({ min: 10, max: 100 }),
      tip_deduction: faker.number.float({ min: 0, max: 50 }),
      auto_gratuity: faker.number.float({ min: 10, max: 100 }),
      paid_in: summary.paid_in_total,
      paid_out: summary.paid_out_total,
      cash_due: faker.number.float({ min: 100, max: 500 }),
      cash_close: faker.number.float({ min: 100, max: 1000 }),
      tips_deposited: faker.number.float({ min: 10, max: 100 }),
    });
  });

  return reconciliations;
};

