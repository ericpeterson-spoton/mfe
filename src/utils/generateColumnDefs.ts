import {
  ColumnDefGeneratorParms,
  MetricType,
  StringToNumberDict,
  StringToStringDict,
  MetricColumnDefGeneratorParms,
  GroupByColumnDefGeneratorParms,
  PivotColumnDefGeneratorParms,
  ValueFormatterColumnDefGeneratorParms,
} from "./types.ts";
import { ColDef } from "ag-grid-community";
import valueFormatters from "./valueFormatters.ts";
import cellRenderers from "./cellRenderers.tsx";

// generateColumnDefs is done by composing a bunch of smaller functions
// each responsible for only a small subset of the functionality.
// this should make testing easier as each can be done in isolation.
//
// Note that metadata has the same shape as ag-grid columnDefs, but it doesnt contain anything that can be
// configured at runtime, for example metrics, pivots, groupby.
// this means on our first pass we just map over metadata to create new config items and
// we pass this result down to other functions to append their config.

export function generateColumnDefs_metrics({
  metrics,
  columnDefs,
  groupBy,
}: MetricColumnDefGeneratorParms) {
  // using metrics we'll generate a map of columnName to agg function
  const columnAggFunctions: StringToStringDict = metrics.reduce(
    (acc, current: MetricType) => {
      return { ...acc, ...{ [current.columnName]: current.aggFunc } };
    },
    {}
  );

  const newColumnDefs = columnDefs.map((i) => {
    //if metrics includes this field we'll create a the aggFunction in the column defs
    return {
      ...i,
      // aggfunctions only make sense if we have groupby
      // if no metrics are defined we'll use the default metric
      ...((columnAggFunctions[i.field as string] != null ||
        i.defaultAggFunc != null) &&
        groupBy.length > 0 && {
          so_chosenAggFunction:
            columnAggFunctions[i.field as string] ?? i.defaultAggFunc,
          headerName: `${i.headerName} (${
            columnAggFunctions[i.field as string] ?? i.defaultAggFunc
          })`,
          aggFunc: columnAggFunctions[i.field as string] ?? i.defaultAggFunc,
        }),
    };
  });

  return newColumnDefs;
}

export function generateColumnDefs_groupBy({
  groupBy,
  columnDefs,
}: GroupByColumnDefGeneratorParms) {
  // using groupBy we'll generate a map of columnName to array index function so we can do a quick lookup and
  // lift the index to use

  const columnGroupByIndexes: StringToNumberDict = groupBy.reduce(
    (acc, current: string, index: number) => {
      return { ...acc, ...{ [current]: index } };
    },
    {}
  );

  const newColumnDefs = columnDefs.map((i) => {
    return {
      ...i,
      ...(columnGroupByIndexes[i.field as string] != null && {
        rowGroupIndex: columnGroupByIndexes[i.field as string],
      }),
    };
  });

  return newColumnDefs;
}

export function generateColumnDefs_pivot({
  pivot,
  columnDefs,
}: PivotColumnDefGeneratorParms) {
  // using groupBy we'll generate a map of columnName to array index function so we can do a quick lookup and
  // lift the index to use

  const columnPivotIndexes: StringToNumberDict = pivot.reduce(
    (acc, current: string, index: number) => {
      return { ...acc, ...{ [current]: index } };
    },
    {}
  );

  const newColumnDefs = columnDefs.map((i) => {
    return {
      ...i,
      ...(columnPivotIndexes[i.field as string] != null && {
        pivotIndex: columnPivotIndexes[i.field as string],
      }),
    };
  });

  return newColumnDefs;
}

export function generateColumnDefs_valueFormatter({
  columnDefs,
}: ValueFormatterColumnDefGeneratorParms) {
  const newColumnDefs = columnDefs.map((i) => {
    let formatterFunction = null;

    if (i.so_valueFormatter != null) {
      formatterFunction = valueFormatters[i.so_valueFormatter];
    }
    return {
      ...i,
      ...(formatterFunction != null && {
        valueFormatter: formatterFunction,
      }),
    };
  });

  return newColumnDefs;
}

export function generateColumnDefs_cellRenderer({
  columnDefs,
}: ValueFormatterColumnDefGeneratorParms) {
  const newColumnDefs = columnDefs.map((i) => {
    let cellRendererFunction = null;

    if (i.so_cellRenderer != null) {
      cellRendererFunction = cellRenderers[i.so_cellRenderer];
    }
    return {
      ...i,
      ...(cellRendererFunction != null && {
        cellRenderer: cellRendererFunction,
      }),
    };
  });

  return newColumnDefs;
}

function generateColumnDefs({
  dataSource,
  metrics,
  groupBy,
  pivot,
  columns,
}: ColumnDefGeneratorParms): ColDef[] {
  const columnsSet = new Set(columns);

  // first lets get rid of columns that are not visible
  const newMetadata = dataSource.metadata.filter((i) =>
    columnsSet.has(i.field as string)
  );

  let columnDefs = generateColumnDefs_metrics({
    metrics,
    columnDefs: newMetadata,
    groupBy,
  });

  columnDefs = generateColumnDefs_pivot({
    pivot,
    columnDefs,
  });

  columnDefs = generateColumnDefs_groupBy({
    groupBy,
    columnDefs,
  });

  columnDefs = generateColumnDefs_valueFormatter({
    columnDefs,
  });

  columnDefs = generateColumnDefs_cellRenderer({
    columnDefs,
  });

  return columnDefs;
}

export default generateColumnDefs;
