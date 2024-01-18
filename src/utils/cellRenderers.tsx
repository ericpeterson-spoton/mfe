import { ValueFormatterParams } from "ag-grid-community";
import { SpotOnColDefs } from "./types";
import valueFormatters from "./valueFormatters.ts";
// @ts-expect-error "no types supplied"
import { getColor } from "../utils/colorUtils.js";

const cellRenderers = {
  redGradient: (params: ValueFormatterParams) => {
    const column = params.column.getColId();
    const extents = params.context[column];

    if (!extents) {
      console.log("something wrong columns =", column);
      return;
    }

    const rgb = getColor(params.value, {
      min: extents.min,
      max: params.value > extents.max ? params.value : extents.max,
    });

    const soParams = params.colDef as SpotOnColDefs;

    const formatted =
      soParams.so_valueFormatter != null
        ? valueFormatters[soParams.so_valueFormatter](params)
        : params.value;

    const style = {
      width: "100%",
      height: "100%",
      //textAlign: align,
      backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`,
    };

    // const style = {
    // 		color: ${style.color};
    // 		background-color: ${style.background};
    // 		width: ${style.width};
    // 		height: ${style.height};
    // 		text-align: ${align};
    // 		line-height: inherit;
    // 		overflow: inherit;
    // 		text-overflow: inherit;"
    //   }}

    return (
      <div title="" className="" style={style}>
        {formatted}
      </div>
    );

    //return params.value?.toLowerCase();
  },
};

export default cellRenderers;
