export type ReportMetadata = {
  name: string;
  id: number;
  startDate: Date;
  endDate: Date;
  dataSource: string;
  dateCreated?: Date;
  groupBy: string[];
  pivot: string[];
  columns: string[];
  metrics: string[];
  description: string;
  emailList: string[];
  categoryList: string[];
};

export type ReportType = {
  metaData: ReportMetadata;
  aggridConfig: unknown;
};

export const getReports = (): ReportType[] => {
  const reports = localStorage.getItem("customReports");

  if (reports) {
    return JSON.parse(reports);
  } else {
    return [];
  }
};

export const getReport = (id: number): ReportType | undefined => {
  const reports = localStorage.getItem("customReports");
  let reportsObject: ReportType[];

  if (reports) {
    reportsObject = JSON.parse(reports);

    return reportsObject.find((i: ReportType) => i.metaData.id === id);
  }
};

export const addReport = (report: ReportType) => {
  const reports = localStorage.getItem("customReports");
  let reportsObject: ReportType[];

  if (reports) {
    reportsObject = JSON.parse(reports);

    localStorage.setItem(
      "customReports",
      JSON.stringify([...reportsObject, report])
    );
  } else {
    localStorage.setItem("customReports", JSON.stringify([report]));
  }
};

export const removeReport = (id: number) => {
  const reports = localStorage.getItem("customReports");
  let reportsObject: ReportType[];

  if (reports) {
    reportsObject = JSON.parse(reports);

    const filteredReports = reportsObject.filter(
      (i: ReportType) => i.metaData.id !== id
    );

    localStorage.setItem("customReports", JSON.stringify(filteredReports));
  }
};

export const updateReport = (report: ReportType) => {
  const reports = localStorage.getItem("customReports");
  let reportsObject: ReportType[];

  if (reports) {
    reportsObject = JSON.parse(reports);

    const filteredReports = reportsObject.filter(
      (i: ReportType) => i.metaData.id !== report.metaData.id
    );

    localStorage.setItem(
      "customReports",
      JSON.stringify([...filteredReports, report])
    );
  }
};

export const updateReportMetaData = (report: ReportMetadata) => {
  const reports = localStorage.getItem("customReports");
  let reportsObject: ReportType[];

  if (reports) {
    reportsObject = JSON.parse(reports);

    const itemToUpdate = reportsObject.find(
      (i: ReportType) => i.metaData.id === report.id
    );

    console.log("updating item", itemToUpdate);

    if (itemToUpdate) {
      itemToUpdate.metaData = report;

      const filteredReports = reportsObject.filter(
        (i: ReportType) => i.metaData.id !== report.id
      );

      localStorage.setItem(
        "customReports",
        JSON.stringify([...filteredReports, itemToUpdate])
      );
    }
  }
};
