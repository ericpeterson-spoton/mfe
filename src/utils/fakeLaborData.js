import { faker } from "@faker-js/faker";

export const generateFakeLaborData = () => {
  const employees = [];
  for (let i = 0; i < 20; i++) {
    const isTerminated = faker.datatype.boolean(0.1);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const employee = {
      id: faker.string.uuid(),
      lastName: lastName,
      firstName: firstName,
      name: firstName + " " + lastName,
      dob: faker.date
        .birthdate({ min: 18, max: 65, mode: "age" })
        .toISOString()
        .split("T")[0],
      hireDate: faker.date
        .between({
          from: "2023-01-01T00:00:00.000Z",
          to: "2023-03-01T00:00:00.000Z",
        })
        .toISOString()
        .split("T")[0],
      terminateDate: isTerminated
        ? faker.date
            .between({
              from: "2023-01-01T00:00:00.000Z",
              to: "2023-03-01T00:00:00.000Z",
            })
            .toISOString()
            .split("T")[0]
        : null,
      isTerminated: isTerminated ? "Y" : "N",
      taxFilingStatus: faker.helpers.arrayElement(["Current", "Deleted"]),
      email: faker.internet.email(),
      job: faker.helpers.arrayElement([
        "Phone supervisor",
        "Busser",
        "Line Cook",
        "Foodrunner",
        "Server",
        "Dishwasher",
        "Service Bar",
        "Manager",
      ]),
    };
    employees.push(employee);
  }
  return employees;
};
