export const insertIntoTables = async ( 
    pool,
    employees,
    shifts,
    menuItems,
    discounts,
    orders,
    checks,
    orderItems,
    payments,
    closeSummaries,
    reconciliations) => {

    
    await insertEmployees(pool, employees);
    await insertShifts(pool, shifts);
    await insertMenuItems(pool, menuItems);
    await insertDiscounts(pool, discounts);
    
    await insertOrders(pool, orders);
    await insertChecks(pool,checks);
    await insertOrderItems(pool, orderItems);

    await insertPayments(pool, payments);
    await insertCloseSummaries(pool, closeSummaries); 
    await insertReconciliations(pool, reconciliations);
}


const insertEmployees = async (pool, employees) => {
  const query = `
    INSERT INTO employees (
      id, last_name, first_name, name, dob, hire_date, 
      terminate_date, is_terminated, tax_filing_status, email, job
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)
  `;
  for (const employee of employees) {
    const values = [
      employee.id, employee.lastName, employee.firstName, employee.name, employee.dob, 
      employee.hireDate, employee.terminateDate, employee.isTerminated, 
      employee.taxFilingStatus, employee.email, employee.job
    ];
    await pool.query(query, values);
  }
};

const insertShifts = async (pool, shifts) => {
  const query = `
    INSERT INTO shifts (
      id, employee_id, name, date, clock_in, clock_out, unpaid_break, 
      regular_hours, ot_hours, total_hours, rate, total_pay, cash_tips, 
      card_tips, total_tips, cash_sales, card_sales, total_sales
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
  `;
  for (const shift of shifts) {
    const values = [
      shift.id, shift.employee_id, shift.name, shift.date, shift.clockIn, shift.clockOut, 
      shift.unpaidBreak, shift.regularHours, shift.otHours, shift.totalHours, shift.rate, 
      shift.totalPay, shift.cashTips, shift.cardTips, shift.totalTips, shift.cashSales, 
      shift.cardSales, shift.totalSales
    ];
    await pool.query(query, values);
  }
};

const insertMenuItems = async (pool, menuItems) => {
  const query = `
    INSERT INTO menu_items (
      id, name, category, price, cost, current_item, is_taxable
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  for (const item of menuItems) {
    const values = [
      item.id,item.name, item.category, item.price, item.cost, item.current_item, item.is_taxable
    ];
    await pool.query(query, values);
  }
};

const insertDiscounts = async (pool, discounts) => {
  const query = `
    INSERT INTO discounts (
      id, name, amount, percentage, is_percentage, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `;
  for (const discount of discounts) {
    const values = [
      discount.id, discount.name, discount.amount, discount.percentage, 
      discount.is_percentage, discount.is_active
    ];
    await pool.query(query, values);
  }
};

const insertOrders = async (pool, orders) => {
  const query = `
    INSERT INTO orders (
      id, date, weekday, void_total, surcharge_revenue, gratuity, refund_total,
      taxes, subtotal, total, daypart, payment_processed, payment_type, card_type,
      employee_id, employee_name
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
  `;
  for (const order of orders) {
    const values = [
      order.id, order.date, order.weekday, order.void_total, order.surcharge_revenue,
      order.gratuity, order.refund_total, order.taxes, order.subtotal, order.total,
      order.daypart, order.payment.payment_processed, order.payment.payment_type,
      order.payment.card_type, order.employee_id, order.employee_name
    ];
    await pool.query(query, values);
  }
};


export const insertChecks = async (pool,checks) => {
  const query = `
    INSERT INTO checks (
      id, close_summary_id, order_id, discount_id, check_total, check_subtotal,
      surcharge_total, discounts_total, void_total, exclusive_taxes, inclusive_taxes,
      tips_total, auto_gratuity_total, employee_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  `;
  for (const check of checks) {
    const values = [
      check.id, check.close_summary_id, check.order_id, check.discount_id,
      check.check_total, check.check_subtotal, check.surcharge_total, check.discounts_total,
      check.void_total, check.exclusive_taxes, check.inclusive_taxes, check.tips_total,
      check.auto_gratuity_total, check.employee_id
    ];
    await pool.query(query, values);
  }
};

const insertOrderItems = async (pool, orderItems) => {
  const query = `
    INSERT INTO order_items (
      id, order_id, menu_item_id, check_id, item_quantity, void_total, 
      item_subtotal, item_exclusive_taxes, item_inclusive_taxes, item_taxes_total, 
      auto_gratuity_total
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `;
  for (const item of orderItems) {
    const values = [
      item.id, item.order_id, item.menu_item_id, item.check_id, 
      item.item_quantity, item.void_total, item.item_subtotal, item.item_exclusive_taxes, 
      item.item_inclusive_taxes, item.item_taxes_total, item.auto_gratuity_total
    ];
    await pool.query(query, values);
  }
};

const insertPayments = async (pool, payments) => {
  const query = `
    INSERT INTO payments (
      id, check_id, order_id, payment_type, card_type, payment_processed, tippable
    ) VALUES ($1, $2, $3, $4, $5, $6,$7)
  `;
  for (const payment of payments) {
    const values = [
      payment.id, payment.check_id,payment.order_id, payment.payment_type, 
      payment.card_type, payment.payment_processed, payment.tippable
    ];
    await pool.query(query, values);
  }
};

const insertCloseSummaries = async (pool, closeSummaries) => {
  const query = `
    INSERT INTO close_summaries (
      id, employee_id, date, note, gross_sales, net_sales, inclusive_taxes, 
      exclusive_taxes, payment_quantity, payment_total, paid_in_quantity, paid_in_total, 
      paid_out_total, paid_out_quantity
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14)
  `;
  for (const summary of closeSummaries) {
      const values = [
        summary.id, summary.employee_id, summary.date, summary.note, summary.gross_sales, 
        summary.net_sales, summary.inclusive_taxes, summary.exclusive_taxes, summary.payment_quantity, 
        summary.payment_total, summary.paid_in_quantity, summary.paid_in_total, 
        summary.paid_out_total, summary.paid_out_quantity
      ];
      await pool.query(query, values);
    
  }
};

export const insertReconciliations = async (pool, reconciliations) => {
  const query = `
    INSERT INTO reconciliations (
      id, close_summary_id, reconciliation_type, cash_open, net_sales, 
      payments_cash, payments_non_cash, payments_total, tips_non_cash, tip_deduction, 
      auto_gratuity, paid_in, paid_out, cash_due, cash_close, tips_deposited
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
  `;
  for (const reconciliation of reconciliations) {
    const values = [
      reconciliation.id, reconciliation.close_summary_id, reconciliation.reconciliation_type, reconciliation.cash_open, reconciliation.net_sales,
      reconciliation.payments_cash, reconciliation.payments_non_cash, reconciliation.payments_total, reconciliation.tips_non_cash, reconciliation.tip_deduction,
      reconciliation.auto_gratuity, reconciliation.paid_in, reconciliation.paid_out, reconciliation.cash_due, reconciliation.cash_close, reconciliation.tips_deposited
    ];
    await pool.query(query, values);
  }
};