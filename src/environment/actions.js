import { createAction } from "redux-act";
// Action Types
export default {
    // 输出专用Action，Reducer中的统一Action处理
    fnFlush: createAction(`${process.env.$K_EVENT}/RX/DATA/FLUSH`)
};
