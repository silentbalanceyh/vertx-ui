// 导入外层
import Cv from "../constant";

const mapRedux = (object, original) => {
    if (Cv.DEBUG) {
        let message = `%c 「Zero」 Redux Data Flow`;
        console.groupCollapsed(message, "color:white;background-color:#09c;font-weight:100");
        if ("string" === typeof object) {
            console.log("「Zero」 Redux Key: ", object);
        } else {
            console.log("「Zero」 Object Data: ", object);
        }
        console.log("「Zero」 Original Data: ", original);
        console.groupEnd();
    }
    // 解决Redux中的数据问题
    return object;
};
export default {
    mapRedux,
}