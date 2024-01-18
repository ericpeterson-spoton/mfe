// seedFakerData.js
import { generateFakeLaborData } from "./fakeLaborData.js";
import { generateFakeShiftsData } from "./fakeShiftsData.js";
import { generateMenuItems } from "./fakeMenuItems.js";
import { generateDiscounts } from "./fakeDiscounts.js";
import { generateOrders } from "./fakeOrderData.js";
import { generateChecks } from "./fakeChecks.js";
import { generateOrderItems } from "./fakeOrderItems.js";
import { generatePayments } from "./fakePayments.js";
import { generateCloseSummaries } from "./fakeCloseSummaries.js";
import { generateReconciliations } from "./fakeReconciliations.js";
import { insertIntoTables } from "./src/utils/insertSeedData.js";
import { roundFloatsInObject } from "./roundFloatsInObject.js";
import pool from "../config/database.js";

const seedData = async () => {
  const employees = generateFakeLaborData();
  const shifts = generateFakeShiftsData(employees);
  const menuItems = generateMenuItems();
  const discounts = generateDiscounts();

  const numberOfOrders = 500;

  const orders = generateOrders(menuItems, numberOfOrders, employees);
  const closeSummaries = generateCloseSummaries(employees);
  const checks = generateChecks(orders, discounts, closeSummaries, employees);
  const orderItems = generateOrderItems(orders, menuItems, checks);
  const payments = generatePayments(checks);
  const reconciliations = generateReconciliations(closeSummaries);

  roundFloatsInObject(employees);
  roundFloatsInObject(shifts);
  roundFloatsInObject(menuItems);
  roundFloatsInObject(discounts);
  roundFloatsInObject(orders);
  roundFloatsInObject(closeSummaries);
  roundFloatsInObject(checks);
  roundFloatsInObject(orderItems);
  roundFloatsInObject(payments);
  roundFloatsInObject(reconciliations);

  try {
    const client = await pool.connect();
    await insertIntoTables(
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
      reconciliations
    );
    client.release();
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    await pool.end();
  }
};

seedData();
