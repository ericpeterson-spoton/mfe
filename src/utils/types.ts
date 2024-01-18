import { ColDef, ValueFormatterParams } from "ag-grid-community";

type AggridAggFunctions =
  | "sum"
  | "min"
  | "max"
  | "count"
  | "avg"
  | "first"
  | "last";

type RendererFunction = "redGradient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SpotOnColDefs<T = any> extends ColDef<T> {
  // add whatever custom non-ag-grid/SpotOn keys you wish here but prefix with so_ to avoid conflicts

  // For number formatting we use the INTL.formatNumber function in combination with so_INTLNumberFormatOptions
  // Note: we are not smart about this and blindly passing so_INTLNumberFormatOptions to the function. This should allow
  // flexibility in the API as we can do whatever INTL.formatNumber does.
  so_valueFormatter?: "lowerCaseRenderer" | "numberFormatter";

  // if not given the default is 'en-US' see Intl.NumberFormat
  so_localeCode?: string;

  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
  so_INTLNumberFormatOptions?: Intl.NumberFormatOptions;

  so_availableAggFunctions?: AggridAggFunctions[];

  so_cellRenderer?: RendererFunction;

  // this gets set when columns are being generated. Use to change value format output based on aggFunction
  so_chosenAggFunction?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataSourceType<T = any> {
  metadata: SpotOnColDefs<T>[];
  rowData: unknown[];
}

export type GenericDataSourceType = {
  metadata: [];
  rowData: [];
};

export type MetricType = {
  columnName: string;
  aggFunc: string;
};

export type StringToStringDict = { [key: string]: string };
export type StringToNumberDict = { [key: string]: number };

export type StringToBooleanDict = { [key: string]: boolean };

export type ColumnDefGeneratorParms = {
  dataSource: DataSourceType;
  pivot: string[];
  groupBy: string[];
  metrics: MetricType[];
  filters?: unknown[];
  columns: string[];
};

export type PivotColumnDefGeneratorParms = {
  pivot: string[];
  columnDefs: SpotOnColDefs[];
};

export type MetricColumnDefGeneratorParms = {
  metrics: MetricType[];
  columnDefs: SpotOnColDefs[];
  groupBy: string[];
};

export type GroupByColumnDefGeneratorParms = {
  groupBy: string[];
  columnDefs: SpotOnColDefs[];
};

export type ValueFormatterColumnDefGeneratorParms = {
  columnDefs: SpotOnColDefs[];
};

export type StringToValidatorDict = {
  [key: string]: (params: ValueFormatterParams) => string;
};

export type ReactSelectOptions = {
  label: string;
  value: string;
};

export type StringToGenericDataSourceDict = {
  [key: string]: GenericDataSourceType;
};

export type Extents = {
  min: number;
  max: number;
};

export type StringToExtents = {
  [key: string]: Extents;
};

export type RowGroupPanelValue =
  | "always"
  | "never"
  | "onlyWhenGrouping"
  | undefined;

export type CellRendererParams = {
  value?: string;
  data: {
    id: number;
  };
};

export type GetRowsAsyncFunction = (
  startDate: Date,
  endDate: Date,
  columns: string[]
) => Promise<unknown>;

export type GetRowsFunction = (
  startDate: Date,
  endDate: Date,
  columns: string[]
) => [];

export type DataSource = {
  name: string;
  getMeta: () => [];
  getRows: GetRowsAsyncFunction | GetRowsFunction;
};

export type StringToDataSourceDict = {
  [key: string]: DataSource;
};
