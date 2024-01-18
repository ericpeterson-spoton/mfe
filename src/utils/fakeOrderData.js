import { faker } from "@faker-js/faker";
import { formatDate } from "../utils/formatUtils.js";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "November",
  "December",
];

const sumItems = (items, field) =>
  items.reduce((sum, item) => sum + item[field], 0);

const generateItem = (menuItems) => {
  const menuItem = faker.helpers.arrayElement(menuItems);
  const gratuity = faker.number.float({ min: 0, max: 20 });
  const taxes = faker.number.float({ min: 1, max: 5 });
  const total = menuItem.price + gratuity + taxes;
  return {
    item_id: faker.string.uuid(),
    item_name: menuItem.name,
    void_total: faker.number.float({ min: 0, max: 10 }),
    surcharge_revenue: faker.number.float({ min: 0, max: 5 }),
    gratuity: gratuity,
    refund_total: faker.number.float({ min: 0, max: 5 }),
    taxes: taxes,
    subtotal: menuItem.price,
    total: total,
  };
};

const generateGuest = (menuItems) => {
  const items = Array.from(
    { length: faker.number.float({ min: 1, max: 5 }) },
    () => generateItem(menuItems)
  );
  return {
    guest_id: faker.string.uuid(),
    guest_name: faker.person.fullName(),
    items: items,
    void_total: sumItems(items, "void_total"),
    surcharge_revenue: sumItems(items, "surcharge_revenue"),
    gratuity: sumItems(items, "gratuity"),
    refund_total: sumItems(items, "refund_total"),
    taxes: sumItems(items, "taxes"),
    subtotal: sumItems(items, "subtotal"),
    total: sumItems(items, "total"),
  };
};

const generateCheck = (menuItems) => {
  const guests = Array.from(
    { length: faker.number.float({ min: 1, max: 3 }) },
    () => generateGuest(menuItems)
  );
  return {
    check_id: faker.string.uuid(),
    guests: guests,
    void_total: sumItems(guests, "void_total"),
    surcharge_revenue: sumItems(guests, "surcharge_revenue"),
    gratuity: sumItems(guests, "gratuity"),
    refund_total: sumItems(guests, "refund_total"),
    taxes: sumItems(guests, "taxes"),
    subtotal: sumItems(guests, "subtotal"),
    total: sumItems(guests, "total"),
  };
};

const randomize = (array) => array[Math.floor(Math.random() * array.length)];

const generateChangeSet = (menuItems) => {
  const field = randomize([
    "name",
    "address",
    "street",
    "city",
    "state",
    "zip",
    "phone",
  ]);

  let old_value;
  let new_value;

  const streets = [
    "Washington Rd",
    "Jefferson Pkwy",
    "Madison Blvd",
    "Van Buren Street",
    "Pear Ct",
  ];

  const addresses = ["123", "54612", "345342", "34", "21"];
  const names = ["Roy", "Robert", "William", "Jonny", "Sara", "Karen"];
  const zipcodes = ["60102", "78984", "54120", "212987", "76094", "23876"];
  const states = ["IL", "IN", "NY", "OH", "CA", "FL", "AZ"];

  const phoneNumbers = [
    "234-752-9575",
    "234-765-3455",
    "464-126-9535",
    "124-896-1545",
    "654-656-2455",
    "232-734-5325",
  ];

  const cities = [
    "Chicago",
    "Boston",
    "Toronto",
    "Los Angeles",
    "San Francisco",
    "Denver",
  ];

  const usernames = ["Jack Meyer", "Mike Johson", "Sara Petrolis"];

  if (field === "address") {
    old_value = randomize(addresses);
    new_value = randomize(addresses);
  } else if (field === "street") {
    old_value = randomize(streets);
    new_value = randomize(streets);
  } else if (field === "name") {
    old_value = randomize(names);
    new_value = randomize(names);
  } else if (field === "city") {
    old_value = randomize(cities);
    new_value = randomize(cities);
  } else if (field === "zip") {
    old_value = randomize(zipcodes);
    new_value = randomize(zipcodes);
  } else if (field === "phone") {
    old_value = randomize(phoneNumbers);
    new_value = randomize(phoneNumbers);
  } else if (field === "state") {
    old_value = randomize(states);
    new_value = randomize(states);
  }
  return {
    location_id: faker.string.uuid(),
    field,
    old_value,
    new_value,
    editor: randomize(usernames),
  };
};

export const generateOrders = (
  menuItems,
  numberOfOrders,
  employees,
  startDate,
  endDate,
  columns
) => {
  const orders = [];

  let columnsToInclude = new Set(columns);

  for (let i = 0; i < numberOfOrders; i++) {
    const date = faker.date.between({
      from: startDate.toISOString(),
      to: endDate.toISOString(),
    });

    const checks = Array.from(
      { length: faker.number.float({ min: 1, max: 3 }) },
      () => generateCheck(menuItems)
    );
    const guestsCount = checks.reduce(
      (count, check) => count + check.guests.length,
      0
    );
    const checksCount = checks.length;
    const employee = faker.helpers.arrayElement(employees);

    const changeSet = generateChangeSet();

    const visibleChangeSet = {
      ...(columnsToInclude.has("Field") && { field: changeSet.field }),
      ...(columnsToInclude.has("Old Value") && {
        old_value: changeSet.old_value,
      }),

      ...(columnsToInclude.has("New Value") && {
        new_value: changeSet.new_value,
      }),

      ...(columnsToInclude.has("Editor") && {
        editor: changeSet.editor,
      }),
    };

    const order = {
      ...visibleChangeSet,
      ...(columnsToInclude.has("Id") && { id: faker.string.uuid() }),
      ...(columnsToInclude.has("Date") && { date: new Date() }),

      ...(columnsToInclude.has("Weekday") && {
        weekday: dayNames[date.getDay()],
      }),

      ...(columnsToInclude.has("Day") && {
        day: date.getDate(),
      }),

      ...(columnsToInclude.has("Date") && {
        date: formatDate(date),
      }),

      ...(columnsToInclude.has("Date ISO Sortable") && {
        "ISO Date": date.toISOString(),
      }),

      ...(columnsToInclude.has("Month") && {
        month: date.getMonth(),
      }),

      ...(columnsToInclude.has("Month Name") && {
        month_name: monthNames[date.getMonth()],
      }),

      ...(columnsToInclude.has("Year") && {
        year: date.getFullYear(),
      }),

      ...(columnsToInclude.has("Checks") && {
        checks,
      }),

      ...(columnsToInclude.has("Void Total") && {
        void_total: sumItems(checks, "void_total"),
      }),

      ...(columnsToInclude.has("Surcharge Revenue") && {
        surcharge_revenue: sumItems(checks, "surcharge_revenue"),
      }),

      ...(columnsToInclude.has("Gratuity") && {
        gratuity: sumItems(checks, "gratuity"),
      }),

      ...(columnsToInclude.has("Refund Total") && {
        refund_total: sumItems(checks, "refund_total"),
      }),

      ...(columnsToInclude.has("Taxes") && {
        taxes: sumItems(checks, "taxes"),
      }),

      ...(columnsToInclude.has("Sub Total") && {
        subtotal: sumItems(checks, "subtotal"),
      }),

      ...(columnsToInclude.has("Total") && {
        total: sumItems(checks, "total"),
      }),

      ...(columnsToInclude.has("Daypart") && {
        daypart: randomize(["breakfast", "lunch", "dinner"]),
      }),

      ...(columnsToInclude.has("Payment") && {
        payment: {
          payment_processed: faker.datatype.boolean(),
          payment_type: randomize(["card", "cash"]),
          card_type: randomize(["Visa", "MasterCard", "Amex", "N/A"]),
        },
      }),

      ...(columnsToInclude.has("Guests Count") && {
        guestsCount,
      }),
      ...(columnsToInclude.has("Checks Count") && {
        checksCount,
      }),

      ...(columnsToInclude.has("Employee Id") && {
        employee_id: employee.id,
      }),

      ...(columnsToInclude.has("Employee Name") && {
        employee_name: employee.name,
      }),
    };

    orders.push(order);
  }
  return orders;
};
