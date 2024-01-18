import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ReportMetadata, updateReportMetaData } from "../utils/reports";
import { StringToBooleanDict } from "../utils/types";

type ReportEditorProps = {
  reports: ReportMetadata[];
  open: boolean;
  onClose: () => void;
};

const ReportEditor = ({ reports, open, onClose }: ReportEditorProps) => {
  console.log("reports.length", reports.length);

  console.log("reports", reports);

  const [name, setName] = useState(reports[0].name);

  const [selectedCategories, setSelectedCategories] = useState(
    reports.length === 1 ? reports[0].categoryList : []
  );
  const [selectedEmails, setSelectedEmails] = useState(
    reports.length === 1 ? reports[0].emailList : []
  );
  const [multiEditCheckState, setMultiEditCheckState] =
    useState<StringToBooleanDict>({});

  const [description, setDescription] = useState(reports[0].description);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setMultiEditCheckStateVal = (inputName: string, val: any) => {
    const mergedObj = { ...multiEditCheckState, ...{ [inputName]: val } };
    setMultiEditCheckState(mergedObj);

    console.log(mergedObj);

    //to do: iterate reports and update. then call our parent callback function
    //onUpdateItems(reports)
  };

  const isMultiEditChecked = (inputName: string) => {
    const ret =
      // eslint-disable-next-line no-prototype-builtins
      multiEditCheckState.hasOwnProperty(inputName) &&
      multiEditCheckState[inputName] === true
        ? true
        : false;

    return ret;
  };

  const nameInput = (
    <div className="form-label-input-pair">
      <label htmlFor="reportName">Report Name:</label>
      <input
        className="text-input"
        name="report-name"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
    </div>
  );

  const descriptionInput = (
    <div className="form-label-input-pair">
      <label htmlFor="reportName">Report Description:</label>
      <input
        className="text-input"
        name="report-name"
        type="text"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
    </div>
  );

  const categoryPickerInput = (
    <div className="form-label-input-pair">
      <label htmlFor="group-by">Categories:</label>
      <CreatableSelect
        isMulti
        isClearable
        value={selectedCategories?.map((i) => ({ label: i, value: i }))}
        onChange={(e) => {
          setSelectedCategories(e.map((i) => i.value));
        }}
      />
    </div>
  );

  const shareWithPickerInput = (
    <div className="form-label-input-pair">
      <label htmlFor="group-by">Share With:</label>
      <CreatableSelect
        isMulti
        isClearable
        value={selectedEmails?.map((i) => ({ label: i, value: i }))}
        onChange={(e) => {
          setSelectedEmails(e.map((i) => i.value));
        }}
      />
    </div>
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function wrapSingleEdit(className: string, control: any) {
    return <div className={className}>{control}</div>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function wrapMultiEdit(className: string, inputName: string, control: any) {
    return (
      <div className={className}>
        <div className={"parent"}>
          <div className="div3">{control}</div>
          <div className="div4">
            <Checkbox
              // label=""
              checked={isMultiEditChecked(inputName)}
              onChange={(event) => {
                setMultiEditCheckStateVal(inputName, event.target.checked);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const saveReports = () => {
    if (reports.length === 1) {
      const newReport: ReportMetadata = {
        ...reports[0],
        name,
        description,
        emailList: selectedEmails,
        categoryList: selectedCategories,
      };

      updateReportMetaData(newReport);
    }
    console.log("multiEditCheckState", multiEditCheckState);
    onClose();
  };

  console.log("report name=", name);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Edit Reports</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          When editing multiple tasks, only checked items will be save to all
          selected tasks.
        </DialogContentText>

        <div className="edit-page">
          <div className="edit-inputs">
            {reports.length === 1 &&
              wrapSingleEdit("vertical-input", nameInput)}

            {reports.length === 1 &&
              wrapSingleEdit("vertical-input", descriptionInput)}

            {reports.length > 1
              ? wrapMultiEdit("vertical-input", "category", categoryPickerInput)
              : wrapSingleEdit("vertical-input", categoryPickerInput)}
            {reports.length > 1
              ? wrapMultiEdit(
                  "vertical-input",
                  "emailList",
                  shareWithPickerInput
                )
              : wrapSingleEdit("vertical-input", shareWithPickerInput)}
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={saveReports} autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportEditor;
