import rockset from "rockset";
import { GetRowsAsyncFunction } from "../utils/types";
import dayjs from "dayjs";

const apiserver = "https://api.use1a1.rockset.com";
const apikey =
  "gnK5oiKkOTd4fTqyDWYyOgEm9IOZAEtjfBqhU3TvOmmmYajbl62exooAKk5RLB0M";

const rocksetClient = rockset(apikey, apiserver);

export const getRows: GetRowsAsyncFunction = async (startDate, endDate) => {
  const ret = await rocksetClient.queryLambdas.executeQueryLambda(
    "prod_playground",
    "orders_list",
    "1745ddb7c1ce694a",
    {
      parameters: [
        {
          name: "gte_date",
          type: "date",
          value: dayjs(startDate).format("YYYY-MM-DD"),
        },
        {
          name: "location_uid",
          type: "string",
          value: "Location27531",
        },
        {
          name: "lte_date",
          type: "date",
          value: dayjs(endDate).format("YYYY-MM-DD"),
        },
        {
          name: "organization_uid",
          type: "string",
          value: "6542b0097acab238f50b62a6",
        },
      ],
    }
  );

  return ret.results;
};

export const metadata = [
  {
    headerName: "Employee Id",
    field: "employee_id",
    sortable: true,
    filter: true,
    enableRowGroup: true,
  },
  {
    headerName: "Employee Full Name",
    field: "employee_full_name",
    sortable: true,
    filter: true,
    enableRowGroup: true,
  },
  {
    headerName: "POS Order Id",
    field: "pos_order_id",
    sortable: true,
    filter: true,
    enableRowGroup: true,
  },
  {
    headerName: "POS Order Number",
    field: "pos_order_number",
    sortable: true,
    filter: true,
    enableRowGroup: true,
  },
  {
    headerName: "Business Date",
    field: "business_date_key",
    sortable: true,
    filter: true,
    enableRowGroup: true,
  },
  {
    headerName: "Daypart",
    field: "daypart",
    sortable: true,
    filter: true,
    enableRowGroup: true,
  },
  {
    headerName: "Discounts Total",
    field: "discounts_total",
    sortable: true,
    filter: true,
    so_valueFormatter: "numberFormatter",
    so_INTLNumberFormatOptions: { style: "currency", currency: "USD" },
    so_availableAggFunctions: ["sum", "avg", "count"],
    defaultAggFunc: "sum",
    cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Void Total",
    field: "void_total",
    sortable: true,
    filter: true,
    so_valueFormatter: "numberFormatter",
    so_INTLNumberFormatOptions: { style: "currency", currency: "USD" },
    so_availableAggFunctions: ["sum", "avg", "count"],
    defaultAggFunc: "sum",
    cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Item Quantity",
    field: "item_quantity",
    sortable: true,
    filter: true,
  },
  {
    headerName: "Order Subtotal",
    field: "order_subtotal",
    sortable: true,
    filter: true,
    so_valueFormatter: "numberFormatter",
    so_INTLNumberFormatOptions: { style: "currency", currency: "USD" },
    so_availableAggFunctions: ["sum", "avg", "count"],
    defaultAggFunc: "sum",
    cellStyle: { textAlign: "right" },
  },
  {
    headerName: "Taxes",
    field: "taxes_total",
    sortable: true,
    filter: true,
    so_valueFormatter: "numberFormatter",
    so_INTLNumberFormatOptions: { style: "currency", currency: "USD" },
    so_availableAggFunctions: ["sum", "avg", "count"],
    defaultAggFunc: "sum",
    cellStyle: { textAlign: "right" },
    so_cellRenderer: "redGradient",
  },
  {
    headerName: "Guest Count",
    field: "guest_count",
    sortable: true,
    filter: true,
  },
];
