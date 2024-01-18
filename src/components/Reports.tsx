import {
  ReportType,
  ReportMetadata,
  getReports,
  removeReport,
} from "../utils/reports";

import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Link from "@mui/material/Link";

import { BASE_URL } from "../constants.ts";
import { useMemo, useState } from "react";
import { CellRendererParams } from "../utils/types.ts";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Button from "@mui/material/Button";
import ReportEditor from "./ReportEditor.tsx";

const Reports = () => {
  const [api, setApi] = useState<GridApi | null>(null);

  const [editModalOpened, setEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 40,
    };
  }, []);

  const navigate = useNavigate();

  const reports: ReportType[] = getReports();

  // reports has aggrid config data that we need to remove before handing over to
  // aggrid
  const reportsStripped = reports.map((i) => i.metaData);

  const getSelectedRowData = () => {
    if (api != null) {
      const selectedData = api.getSelectedRows() as [];
      return selectedData;
    }
    return [];
  };

  const colDefs = [
    {
      headerName: "Report Name",
      field: "name",
      filter: true,
      rowGroup: false,
      resizable: true,

      cellRenderer: (value: CellRendererParams) => {
        return (
          <Link href={`${BASE_URL}/report/${value.data.id}`} underline="always">
            {value.value}
          </Link>
        );
      },
    },
    {
      headerName: "Description",
      field: "description",
      filter: true,
    },
    {
      headerName: "Data Source",
      field: "dataSource",
      filter: true,
    },
    { headerName: "Date Created", field: "dateCreated", filter: true },
    { headerName: "Categories", field: "categoryList", filter: true },
    { headerName: "Shared With", field: "emailList", filter: true },
    {
      headerName: "Start Date",
      field: "startDate",
    },
    {
      headerName: "End Date",
      field: "endDate",
      enableRowGroup: true,
    },
    {
      headerName: "",
      field: "icon",
      resizable: true,

      width: 20,
      cellRenderer: function () {
        return (
          <div className="row-button-container">
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => {
                setEditModalOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => {
                setConfirmDeleteOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ] as ColDef<ReportMetadata>[];

  const gridOptions = {
    columnDefs: colDefs,
    defaultColDef,
  };

  console.log(gridOptions);

  const createNew = () => {
    navigate("/create-report");
  };

  console.log("confirmDeleteOpen", confirmDeleteOpen);

  const selectedItems = getSelectedRowData();

  return (
    <div className="application-layout">
      <div className="reports-header">
        <div className="report-title">Custom Reports</div>

        <Button variant="contained" onClick={createNew}>
          New Report
        </Button>
      </div>
      <div className="report-config"></div>
      <div className="grid-container">
        <AgGridReact
          className="ag-theme-material grid"
          rowData={reportsStripped}
          columnDefs={colDefs}
          gridOptions={gridOptions}
          rowSelection={"multiple"}
          onGridReady={(params) => {
            setApi(params.api);
          }}
        />
      </div>
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting a task will remove a task from the scheduler. If the task
            is executing it will continue to run, but it wont ever run again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>No</Button>
          <Button
            onClick={() => {
              selectedItems.forEach((report: { id: number }) => {
                removeReport(report.id);
              });
              setConfirmDeleteOpen(false);
              navigate("/");
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {selectedItems.length > 0 && (
        <ReportEditor
          onClose={() => {
            setEditModalOpen(false);
          }}
          open={editModalOpened}
          reports={selectedItems}
        />
      )}
    </div>
  );
};

export default Reports;
