export const roundFloatsInObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      roundFloatsInObject(obj[key]);
    } else if (typeof obj[key] === "number" && !Number.isInteger(obj[key])) {
      try {
        obj[key] = Math.round(obj[key] * 100) / 100;
      } catch (error) {
        console.log(error);
      }
    }
  });
};
