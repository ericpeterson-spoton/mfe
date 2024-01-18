import {
  MetricType,
  SpotOnColDefs,
  ReactSelectOptions,
  GenericDataSourceType,
} from "./types";
import fakeDataSources from "../utils/fakeDataSources.ts";
import { getSourceList } from "../datasources/catalog.ts";

export function getMetrics(metadata: SpotOnColDefs[]): MetricType[] {
  // get all columns with available agg functions

  const columns = metadata.filter((i) => i.so_availableAggFunctions != null);

  const ret = columns.flatMap((i): MetricType[] => {
    return i.so_availableAggFunctions!.map(
      (j): MetricType => ({
        columnName: i.field as string,
        aggFunc: j,
      })
    );
  });

  return ret;
}

export function getGroupBys(
  metadata: SpotOnColDefs[],
  chosenColumns: string[]
): ReactSelectOptions[] {
  const chosenColumnSet = new Set(chosenColumns);
  const columns = metadata.filter(
    (i) => i.enableRowGroup === true && chosenColumnSet.has(i.field as string)
  );
  return columns.map((i) => ({
    value: i.field as string,
    label: i.headerName as string,
  }));
}

export function getColumns(metadata: SpotOnColDefs[]): ReactSelectOptions[] {
  return metadata.map((i) => ({
    value: i.field as string,
    label: i.headerName as string,
  }));
}

export const getAvailableDataSources = (): ReactSelectOptions[] => {
  return getSourceList().map((i) => ({
    label: i.name,
    value: i.name,
  }));

  return Object.keys(fakeDataSources).map((i) => ({ label: i, value: i }));
};

export const getAvailableMetrics = (
  dataSource: GenericDataSourceType,
  chosenMetrics: string[],
  columnsAvailable: string[]
): ReactSelectOptions[] => {
  const chosenColumns = chosenMetrics.map((i) => {
    const tokens = i.split(",");
    return tokens[0];
  });

  const columns = new Set(chosenColumns);
  const columnsAvailableSet = new Set(columnsAvailable);
  const availableMetrics = getMetrics(dataSource.metadata);

  // we can only choose one agg function per column. So this code makes sure that the column doesnt have a agg function applied
  // and the column is in the set of available columns
  const filtered = availableMetrics.filter(
    (i) => !columns.has(i.columnName) && columnsAvailableSet.has(i.columnName)
  );

  return filtered.map((i) => ({
    label: `${i.columnName} (${i.aggFunc})`,
    value: `${i.columnName},${i.aggFunc}`,
  }));
};
