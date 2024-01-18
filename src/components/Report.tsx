import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Select from "react-select";
import Button from "@mui/material/Button";
import Table from "./Table";
import dataCatalog from "../datasources/catalog.ts";
import GoBack from "@mui/icons-material/ArrowBack";
import Print from "@mui/icons-material/Print";
import Export from "@mui/icons-material/TableRows";
import { useNavigate } from "react-router-dom";

import {
  addReport,
  ReportType,
  updateReport,
  getReport,
} from "../utils/reports";

import {
  getAvailableMetrics,
  getGroupBys,
  getColumns,
  getAvailableDataSources,
} from "../utils/misc.ts";
import { ReactSelectOptions, SpotOnColDefs } from "../utils/types.ts";
import { GridApi } from "ag-grid-community";

const getNextId = () => Date.now();

const DEFAULT_DATA_SOURCE = "orders";

const Report = () => {
  const availableDataSources = getAvailableDataSources();

  const { id } = useParams();
  const [api, setApi] = useState<GridApi | null>(null);
  const [metadata, setMetadata] = useState<[]>([]);

  const navigate = useNavigate();

  let loadedReport: ReportType | undefined;

  if (id) {
    loadedReport = getReport(Number(id));
  }

  let defaultStartDate;
  let defaultEndDate;

  if (!loadedReport) {
    const d = new Date();
    defaultEndDate = dayjs(d);
    d.setDate(d.getDate() - 30);
    defaultStartDate = dayjs(d);
  } else {
    defaultStartDate = dayjs(loadedReport.metaData.startDate);
    defaultEndDate = dayjs(loadedReport.metaData.endDate);
  }

  const [columns, setColumns] = useState<string[]>(
    loadedReport
      ? loadedReport.metaData.columns
      : metadata.map((i: SpotOnColDefs) => i.field as string)
  );
  const [dataSource, setDataSource] = useState(
    loadedReport ? loadedReport.metaData.dataSource : DEFAULT_DATA_SOURCE
  );
  const [metrics, setMetrics] = useState<string[]>(
    loadedReport ? loadedReport.metaData.metrics || [] : []
  );
  const [groupBy, setGroupBy] = useState<string[]>(
    loadedReport ? loadedReport.metaData.groupBy : []
  );
  const [pivot, setPivot] = useState<string[]>(
    loadedReport ? loadedReport.metaData.pivot : []
  );
  const [startDate, setStartDate] = useState<Dayjs | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(defaultEndDate);
  const [rowData, setRowData] = useState<[]>([]);
  const [reportName, setReportName] = useState(
    loadedReport ? loadedReport.metaData.name : ""
  );

  useEffect(() => {
    async function getRows() {
      const rowData = await dataCatalog[dataSource]?.getRows(
        startDate!.toDate(),
        endDate!.toDate(),
        columns
      );

      setRowData(rowData as []);
      setMetadata(dataCatalog[dataSource]?.getMeta());
    }

    if (startDate != null && endDate != null) {
      getRows();
    }
  }, [dataSource, startDate, endDate, columns]);

  useEffect(() => {
    const defaultColumns = metadata.map(
      (i: SpotOnColDefs) => i.field as string
    );

    setColumns(defaultColumns);
  }, [metadata]);

  const saveReport = () => {
    if (id) {
      // this is an existing report
      const newReport: ReportType = {
        metaData: {
          id: Number(id),
          startDate: startDate!.toDate(),
          endDate: endDate!.toDate(),
          name: reportName,
          dataSource,
          groupBy,
          pivot,
          columns,
          metrics,
          description: loadedReport!.metaData.description,
          emailList: loadedReport!.metaData.emailList,
          categoryList: loadedReport!.metaData.categoryList,
        },

        aggridConfig: {},
      };

      updateReport(newReport);
    } else {
      // a new report
      const newReport: ReportType = {
        metaData: {
          id: getNextId(),
          startDate: startDate!.toDate(),
          endDate: endDate!.toDate(),
          name: reportName,
          dateCreated: new Date(),
          dataSource,
          groupBy,
          pivot,
          columns,
          metrics,
          description: "",
          emailList: [],
          categoryList: [],
        },

        aggridConfig: {},
      };

      addReport(newReport);
    }
  };

  const columnOptions: ReactSelectOptions[] = getColumns(metadata);

  const columnsValue = columns.map((option) => ({
    value: option,
    label: option,
  }));

  const metricOptions = getAvailableMetrics(
    { metadata, rowData },
    metrics,
    columns
  );

  const metricsValue = metrics.map((option) => {
    const tokens = option.split(",");
    return {
      value: option,
      label: `${tokens[0]} (${tokens[1]})`,
    };
  });

  const groupingOptions = getGroupBys(metadata, columns);

  const groupingValue = groupBy.map((option) => ({
    value: option,
    label: option,
  }));

  const pivotValue = pivot.map((option) => ({
    value: option,
    label: option,
  }));

  console.log("row data = ", rowData);
  console.log("metadata = ", metadata);

  return (
    <div id="report" className="report-layout">
      <div className="report-config-container">
        <div className="report-header">
          <div className="report-title">
            {loadedReport ? loadedReport.metaData.name : "Create New Report"}{" "}
          </div>

          <div className="report-actions-container">
            <div className="print-export-button-container">
              <Button variant="outlined" startIcon={<Print />}>
                Print
              </Button>

              <Button
                variant="outlined"
                startIcon={<Export />}
                onClick={() => {
                  console.log("export to csv", api);
                  api?.exportDataAsCsv();
                }}
              >
                Export
              </Button>
            </div>

            <div className="save-go-back-container">
              <Button
                onClick={() => {
                  navigate("/");
                }}
                variant="outlined"
                startIcon={<GoBack />}
              >
                Reports
              </Button>
              <Button variant="contained" onClick={saveReport}>
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="report-config">
          <div className="datasource-report-name-container">
            <div className="form-label-input-pair data-source-picker-container">
              <label htmlFor="data-source">Data Source:</label>

              <Select
                options={availableDataSources}
                value={availableDataSources.find((i) => i.value === dataSource)}
                onChange={(e) => {
                  setDataSource(e!.value);
                  setGroupBy([]);
                  setPivot([]);
                  setMetrics([]);
                }}
              />
            </div>

            <div className="form-label-input-pair">
              <label htmlFor="reportName">Report Name:</label>
              <input
                className="text-input"
                name="report-name"
                type="text"
                value={reportName}
                onChange={(e) => {
                  setReportName(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="time-range-picker">
            <div className="form-label-input-pair">
              <label htmlFor="reportName">Start Date:</label>
              <DatePicker
                slotProps={{ textField: { size: "small" } }}
                defaultValue={defaultStartDate}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
            </div>
            <div className="form-label-input-pair">
              <label htmlFor="reportName"> End Date:</label>
              <DatePicker
                slotProps={{ textField: { size: "small" } }}
                defaultValue={defaultEndDate}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </div>
          </div>
        </div>

        <div className="report-groups-and-pivots">
          <div className="form-label-input-pair">
            <label htmlFor="group-by">Columns:</label>

            <Select
              options={columnOptions}
              isMulti
              onChange={(e) => {
                setColumns(e.map((i) => i.value));
              }}
              value={columnsValue}
            />
          </div>
          <div className="groupby-metric-pivot-picker-container">
            <div className="form-label-input-pair sized">
              <label htmlFor="group-by">Group By:</label>

              <Select
                options={groupingOptions}
                isMulti
                onChange={(e) => {
                  setGroupBy(e.map((i) => i.value));
                }}
                value={groupingValue}
              />
            </div>
            <div className="form-label-input-pair sized">
              <label htmlFor="metrics">Metrics:</label>

              <Select
                options={metricOptions}
                isMulti
                onChange={(e) => {
                  setMetrics(e.map((i) => i.value));
                }}
                value={metricsValue}
              />
            </div>
            <div className="form-label-input-pair sized">
              <label htmlFor="pivot">Pivot:</label>

              <Select
                options={groupingOptions}
                isMulti
                onChange={(e) => {
                  setPivot(e.map((i) => i.value));
                }}
                value={pivotValue}
              />
            </div>
          </div>
        </div>
      </div>

      <div id="container" className="grid-container">
        <Table
          onGridReady={(api: GridApi) => setApi(api)}
          groupBy={groupBy}
          pivot={pivot}
          columns={columns}
          metrics={metrics.map((i) => {
            // values are in the form column,function
            const tokens = i.split(",");
            return { columnName: tokens[0], aggFunc: tokens[1] };
          })}
          dataSource={{ rowData, metadata }}
          filters={columns}
        />
      </div>
    </div>
  );
};

export default Report;
