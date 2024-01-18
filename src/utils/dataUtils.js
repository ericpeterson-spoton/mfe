import { currencyFormatter } from "./formatUtils.js";
/**
 * Render a cell based on its value
 * @param {object} params - The parameters of the cell
 * @returns {string} - The rendered cell
 */
export const customCellRenderer = (params) => {
  if (params.value) {
    if (Array.isArray(params.value)) {
      return `Array[${params.value.length}]`;
    } else if (typeof params.value === "object") {
      return JSON.stringify(params.value, null, 2);
    }
    return params.value;
  }
  return null;
};

/**
 * Generate column definitions based on the data
 * @param {array} data - The data to generate column definitions from
 * @returns {array} - The generated column definitions
 */
export const generateColumnDefs = (
  data = [],
  groupBy = [],
  pivot = [],
  metrics = []
) => {
  if (data.length === 0) return [];

  let sample = data[0];
  let columnDefs = [];

  let groupByColumns = new Set(groupBy);
  let pivotColumns = new Set(pivot);
  let metricColumns = new Set(metrics);

  try {
    Object.keys(sample).forEach((key) => {
      let headerName = key
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      let columnDef = {
        headerName: headerName,
        field: key,
        sortable: true,
        filter: true,
        enableRowGroup: true,
        pivot: pivotColumns.has(headerName),
        rowGroup: groupByColumns.has(headerName),
        headerValueGetter: (params) => {
          return params.colDef.headerName;
        },
        aggFunc: metrics.has(headerName) ? "sum" : undefined,
      };

      const currencyFields = [
        "taxes",
        "subtotal",
        "total",
        "gratuity",
        "surcharge_revenue",
        "void_total",
        "refund_total",
      ];

      const currencyFieldSet = new Set(currencyFields);

      if (currencyFieldSet.has(key)) {
        // columnDef.aggFunc = "sum";
        columnDef.valueFormatter = currencyFormatter;
        columnDef.cellStyle = { "text-align": "right" };
        columnDef.filter = "agNumberColumnFilter";
      }

      if (Array.isArray(sample[key]) || typeof sample[key] === "object") {
        columnDef.cellRenderer = customCellRenderer;
      }

      columnDefs.push(columnDef);
    });

    return columnDefs;
  } catch (err) {
    console.error("Error generating column definitions:", err);
  }
};
