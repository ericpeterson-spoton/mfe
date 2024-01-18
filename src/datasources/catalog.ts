// This catalog appears to be hardcoded, but it is intended to be dynamic and built upon app initialization.
// The main idea is that eventually we will request available sources from an external service and populate
// this structure dynamically. This allows us to develop against a stable interface so when
// we begin to support an external list of sources it will just work.

import fakeDataSources from "../utils/fakeDataSources.ts";
import { StringToDataSourceDict } from "../utils/types.ts";

import {
  getRows as rocksetOrders,
  metadata as rocksetMetadata,
} from "./rockset_orders.ts";

function simulateAsyncFetch(ms: number) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(fakeDataSources.labor.rowData), ms)
  );
}

const dataCatalog: StringToDataSourceDict = {
  orders: {
    name: "orders",
    getRows: () => {
      return fakeDataSources.orders.rowData;
    },
    getMeta: () => {
      return fakeDataSources.orders.metadata;
    },
  },
  labor: {
    name: "labor",
    getRows: () => {
      return fakeDataSources.labor.rowData;
    },
    getMeta: () => {
      return fakeDataSources.labor.metadata;
    },
  },
  asyncSourceTest: {
    name: "asyncSourceTest",
    getRows: async (startDate: Date, endDate: Date, columns: string[]) => {
      console.log("asyncSourceTest called", startDate, endDate, columns);
      return await simulateAsyncFetch(5000);
    },
    getMeta: () => {
      return fakeDataSources.labor.metadata;
    },
  },

  rocksetOrders: {
    name: "rocksetOrders",
    getRows: rocksetOrders,
    getMeta: () => {
      return rocksetMetadata as [];
    },
  },
};

export const getSourceList = () => {
  const keys = Object.keys(dataCatalog);

  const ret = keys.map((key) => ({ ...dataCatalog[key] }));
  return ret;
};

export default dataCatalog;
