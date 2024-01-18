import { faker } from '@faker-js/faker';

export const generateOrderItems = (orders, menuItems, checks) => {
  const orderItems = [];
  orders.forEach(order => {
    const check = faker.helpers.arrayElement(checks.filter(c => c.order_id === order.id));
    const menuItem = faker.helpers.arrayElement(menuItems);
    const quantity = faker.number.float({ min: 1, max: 5 });
    const itemSubtotal = menuItem.price * quantity;
    const itemTaxes = itemSubtotal * 0.1; // Example tax rate

    orderItems.push({
      id: faker.string.uuid(),
      order_id: order.id,
      menu_item_id: menuItem.id,
      check_id: check.id,
      item_quantity: quantity,
      void_total: faker.number.float({ min: 0, max: 5 }),
      item_subtotal: itemSubtotal,
      item_exclusive_taxes: itemTaxes,
      item_inclusive_taxes: itemTaxes / 2, 
      item_taxes_total: itemTaxes,
      auto_gratuity_total: itemSubtotal * 0.1
    });
  });

  return orderItems;
};

