import {
  DataSourceType,
  GenericDataSourceType,
  StringToGenericDataSourceDict,
} from "./types";

// @ts-expect-error "no types supplied"
import { generateFakeLaborData } from "./fakeLaborData.js";

type FakeRowData = {
  checkId: string;
  month: string;
  date: string;
  weekday: string;
  total: number;
  taxes: number;
  daypart: string;
  item: string;
  category: string;
};

const testDataSource: DataSourceType<FakeRowData> = {
  metadata: [
    {
      headerName: "Check Id",
      field: "checkId",
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: "Month",
      field: "month",
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: "Weekday",
      field: "weekday",
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: "Total",
      field: "total",
      sortable: true,
      filter: "agNumberColumnFilter",
      so_valueFormatter: "numberFormatter",
      so_INTLNumberFormatOptions: { style: "currency", currency: "USD" },
      so_availableAggFunctions: ["sum", "avg", "count"],
      defaultAggFunc: "sum",
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Taxes",
      field: "taxes",
      sortable: true,
      filter: "agNumberColumnFilter",
      so_valueFormatter: "numberFormatter",
      so_INTLNumberFormatOptions: { style: "currency", currency: "USD" },
      so_availableAggFunctions: ["sum", "avg"],
      defaultAggFunc: "sum",
      cellStyle: { textAlign: "right" },
      so_cellRenderer: "redGradient",
    },
    {
      headerName: "Daypart",
      field: "daypart",
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: "Item",
      field: "item",
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: "Category",
      field: "category",
      sortable: true,
      filter: true,
      enableRowGroup: true,
      so_valueFormatter: "lowerCaseRenderer",
    },
  ],
  rowData: [
    {
      checkId: "5a763fc0-9b7e-4ece-a4d9-8dde11855fc3",
      month: "January",
      date: "01/23/23",
      weekday: "Thursday",
      total: 360.56877938634716,
      taxes: 56.67,
      daypart: "lunch",
      item: "Coke",
      category: "Beverage",
    },
    {
      checkId: "6b3147c3-c321-4dc2-824a-1d3454999471",
      month: "February",
      date: "02/17/23",
      weekday: "Wednesday",
      total: 91.44100146973506,
      taxes: 67.33,
      daypart: "breakfast",
      item: "Ham and Eggs",
      category: "Food",
    },

    {
      checkId: "6b3127c3-c321-4dc2-814a-1d3454999471",
      month: "March",
      weekday: "Wednesday",
      date: "03/20/23",
      total: 11.44100146973506,
      taxes: 27.33,
      daypart: "breakfast",
      item: "Orange Juice",
      category: "Beverage",
    },

    {
      checkId: "6b3047c3-c321-4dc2-844a-1d3454999471",
      month: "January",
      date: "01/23/23",
      weekday: "Wednesday",
      total: 16.44100146973506,
      taxes: 6.33,
      daypart: "dinner",
      item: "Sprite",
      category: "Beverage",
    },

    {
      checkId: "6b3147c3-c321-4dc2-844a-1d3404999471",
      weekday: "Thursday",
      month: "January",
      date: "01/23/23",
      total: 9.44100146973506,
      taxes: 6.33,
      daypart: "breakfast",
      item: "Orange Juice",
      category: "Beverage",
    },

    {
      checkId: "6b3147c3-c321-4dc2-844a-1d3454999479",
      weekday: "Thursday",
      month: "March",
      date: "03/20/23",
      total: 4.44100146973506,
      taxes: 67.33,
      daypart: "dinner",
      item: "Sprite",
      category: "Beverage",
    },

    {
      checkId: "fa3d5444-34de-4246-b672-2d100ab066d63",
      weekday: "Wednesday",
      month: "February",
      date: "02/17/23",
      total: 322.74264903296717,
      taxes: 24.54,
      daypart: "lunch",
      item: "PBR",
      category: "Wine & Beer",
    },
    {
      checkId: "fa3d5444-34de-4246-b672-2d100ab066d63",
      weekday: "Wednesday",
      month: "February",
      date: "02/17/23",
      total: 322.74264903296717,
      taxes: 24.54,
      daypart: "lunch",
      item: "Chardonnay",
      category: "Wine & Beer",
    },
    {
      checkId: "4e2e0243-388b-4a54-834f-bfcae465c33932",
      month: "April",
      weekday: "Thursday",
      date: "04/05/23",
      total: 398.50136898783967,
      taxes: 12.32,
      daypart: "dinner",
      item: "Meatloaf",
      category: "Food",
    },
    {
      checkId: "4e2e0243-388b-4a54-834f-bfcae465c33932",
      month: "April",
      date: "04/05/23",
      weekday: "Thursday",
      total: 28.50136898783967,
      taxes: 2.32,
      daypart: "dinner",
      item: "Coke",
      category: "Beverage",
    },
  ],
};

type FakeLaborRowData = {
  id: string;
  lastName: string;
  firstName: string;
  name: string;
  dob: Date;
  hireDate: Date;
  terminateDate: Date;
  isTerminated: boolean;
  taxFilingStatus: string;
  email: string;
  job: string;
};

const orderDataSource: DataSourceType<FakeLaborRowData> = {
  metadata: [
    {
      headerName: "Id",
      field: "id",
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: "Last Name",
      field: "lastName",
      sortable: true,
      filter: true,
      enableRowGroup: true,
    },
    {
      headerName: "First Name",
      field: "firstName",
      sortable: true,
      enableRowGroup: true,
    },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      enableRowGroup: true,
    },
    {
      headerName: "DOB",
      field: "dob",
      sortable: true,
      enableRowGroup: true,
    },
    {
      headerName: "Hire Date",
      field: "hireDate",
      sortable: true,
      enableRowGroup: true,
    },
    {
      headerName: "Terminate Date",
      field: "terminateDate",
      sortable: true,
      enableRowGroup: true,
    },
    {
      headerName: "Is Terminated",
      field: "isTerminated",
      sortable: true,
      enableRowGroup: true,
    },
    {
      headerName: "Tax Filing Status",
      field: "taxFilingStatus",
      sortable: true,
      enableRowGroup: true,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      enableRowGroup: true,
    },
    {
      headerName: "Job",
      field: "job",
      sortable: true,
      enableRowGroup: true,
    },
  ],

  rowData: generateFakeLaborData(),
};

const fakeDataSources: StringToGenericDataSourceDict = {
  orders: testDataSource as GenericDataSourceType,
  labor: orderDataSource as GenericDataSourceType,
  asyncSourceTest: orderDataSource as GenericDataSourceType,
};

export default fakeDataSources;
