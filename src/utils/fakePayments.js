
import { faker } from '@faker-js/faker';

export const generatePayments = (checks) => {
  const payments = [];
  checks.forEach(check => {
    const paymentType = faker.helpers.arrayElement(['cash', 'credit card']);
    const cardTypes = ['Visa', 'MasterCard', 'Amex'];
    payments.push({
      id: faker.string.uuid(),
      check_id: check.id,
      order_id: check.order_id,
      payment_type: paymentType,
      card_type: paymentType === 'credit card' ? faker.helpers.arrayElement(cardTypes) : 'N/A',
      payment_processed: faker.datatype.boolean(),
      tippable: faker.helpers.arrayElement(['Y', 'N']),
    });
  });

  return payments;
};
