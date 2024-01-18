import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { useState } from "react";

import {
  ColumnDefGeneratorParms,
  RowGroupPanelValue,
  SpotOnColDefs,
  StringToExtents,
} from "../utils/types.ts";
import generateColumnDefs from "../utils/generateColumnDefs.ts";
import { GridApi } from "ag-grid-community";

type GridReadyFunction = {
  onGridReady: (api: GridApi) => void;
};

type TableProps = GridReadyFunction & ColumnDefGeneratorParms;

const Table = ({
  onGridReady,
  groupBy,
  pivot,
  metrics,
  filters,
  dataSource,
  columns,
}: TableProps) => {
  const [api, setApi] = useState<GridApi | null>(null);

  const columnDefs = generateColumnDefs({
    dataSource,
    groupBy,
    pivot,
    metrics,
    filters,
    columns,
  });

  console.log("columnDefs", columnDefs);

  const [quickFilterText, setQuickFilterText] = useState("");
  const onQuickFilterTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuickFilterText(event.target.value);
    if (api) {
      api.setQuickFilter(event.target.value);
    }
  };

  const gridOptions = {
    suppressAggFuncInHeader: true,
    rowGroupPanelShow: "never" as RowGroupPanelValue,
  };

  const columnsWithCellRenderer = columnDefs
    .filter((i: SpotOnColDefs) => i.so_cellRenderer != null)
    .map((i) => i.field as string);

  const context: StringToExtents = {};

  columnsWithCellRenderer.forEach((col) => {
    context[col] = { min: Infinity, max: -Infinity };
  });

  // for each row for each columnWith cell renderer we generate a min and max
  // this can be used for coloring numeric cell making the larger values standout
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource.rowData.forEach((row: any) => {
    columnsWithCellRenderer.forEach((col: string) => {
      if (Number.isFinite(row[col])) {
        if (row[col] < context[col].min) {
          context[col].min = row[col];
        }
        if (row[col] > context[col].max) {
          context[col].max = row[col];
        }
      }
    });
  });

  return (
    <>
      <>
        <label htmlFor="group-by">Quick Filter: </label>
        <input
          className="text-input"
          type="text"
          value={quickFilterText}
          onChange={onQuickFilterTextChange}
          placeholder="Enter Any Value"
        />

        <AgGridReact
          // force ag-grid to rerender if these change
          key={`${JSON.stringify(groupBy)}${JSON.stringify(
            pivot
          )}${JSON.stringify(metrics)}`}
          quickFilterText={quickFilterText}
          className="report-table ag-theme-material"
          rowData={dataSource.rowData}
          pivotMode={pivot.length > 0}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          context={context}
          defaultColDef={{
            editable: false,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
          }}
          onGridReady={(params) => {
            setApi(params.api);
            onGridReady(params.api);
          }}
          groupIncludeTotalFooter={
            groupBy.length &&
            columnDefs.filter((i) => i.aggFunc != null).length > 0
              ? true
              : false
          }
        />
      </>
    </>
  );
};

export default Table;
