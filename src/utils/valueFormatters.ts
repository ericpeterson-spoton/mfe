import { ValueFormatterParams } from "ag-grid-community";
import { SpotOnColDefs, StringToValidatorDict } from "./types";

const valueFormatters: StringToValidatorDict = {
  lowerCaseRenderer: (params: ValueFormatterParams) => {
    return params.value?.toLowerCase();
  },

  numberFormatter: (params: ValueFormatterParams) => {
    // console.log("numberFormatter params", params);

    const so_params = params?.colDef as SpotOnColDefs;
    const aggFunction = so_params?.so_chosenAggFunction;

    if (aggFunction == null || aggFunction !== "count") {
      const colDefs: SpotOnColDefs = params.colDef;
      const options = colDefs.so_INTLNumberFormatOptions;
      const locale = colDefs.so_localeCode ?? "en-US";
      const formatter = new Intl.NumberFormat(locale, options);
      return formatter.format(params.value);
    } else {
      return params.value;
    }
  },
};

export default valueFormatters;
