import { v4 as uuidv4 } from "uuid";

export const getDefaultChart = () => {
  return {
    modelType: "range",
    chartId: uuidv4(),
    chartType: "groupedColumn",
    chartThemeName: "ag-default",
    chartOptions: {
      column: {
        title: {
          fontFamily: "Verdana, sans-serif",
          fontWeight: "bold",
          fontSize: 16,
          color: "rgb(70, 70, 70)",
        },
      },
    },
    chartPalette: {
      fills: [
        "#f3622d",
        "#fba71b",
        "#57b757",
        "#41a9c9",
        "#4258c9",
        "#9a42c8",
        "#c84164",
        "#888888",
      ],
      strokes: [
        "#aa4520",
        "#b07513",
        "#3d803d",
        "#2d768d",
        "#2e3e8d",
        "#6c2e8c",
        "#8c2d46",
        "#5f5f5f",
      ],
    },
    cellRange: {
      rowStartIndex: null,
      rowStartPinned: null,
      rowEndIndex: null,
      rowEndPinned: null,
      columns: ["ag-Grid-AutoColumn"],
    },
    suppressChartRanges: false,
    unlinkChart: false,
    version: "30.2.1",
  };
};
