import { faker } from '@faker-js/faker';

export const generateFakeShiftsData = (employees) => {
  const shifts = [];
  employees.forEach(employee => {
    for (let day = 0; day < 60; day += 2) {
      const clockIn = faker.date.soon({days:1, refDate: Date(2023, 0, day + 1)});
      const shiftDuration = faker.number.int({ min: 4, max: 8 });
      const clockOut = new Date(clockIn.getTime() + shiftDuration * 60 * 60 * 1000);
      const unpaidBreak = faker.number.float({ min: 0, max: 30});
      const regularHoursWorked = shiftDuration - unpaidBreak / 60;
      const otHours = regularHoursWorked > 8 ? regularHoursWorked - 8 : 0;
      const rate = faker.number.float({ min: 15, max: 30 });
      const totalPay = regularHoursWorked * rate;
      const cashTips = faker.number.float({ min: 0, max: 100 });
      const cardTips = faker.number.float({ min: 0, max: 100 });
      const totalTips = cashTips + cardTips;
      const cashSales = faker.number.float({ min: 100, max: 1000 });
      const cardSales = faker.number.float({ min: 100, max: 1000 });
      const totalSales = cashSales + cardSales;

      shifts.push({
        id: faker.string.uuid(),
        employee_id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        date: clockIn.toISOString().split('T')[0],
        clockIn: clockIn.toISOString(),
        clockOut: clockOut.toISOString(),
        unpaidBreak: unpaidBreak,
        regularHours: regularHoursWorked,
        otHours: otHours,
        totalHours: regularHoursWorked + otHours,
        rate: rate,
        totalPay: totalPay,
        cashTips: cashTips,
        cardTips: cardTips,
        totalTips: totalTips,
        cashSales: cashSales,
        cardSales: cardSales,
        totalSales: totalSales,
      });
    }
  });

  return shifts;
};
