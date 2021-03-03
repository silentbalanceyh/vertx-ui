import Ux from 'ux';
import Cv from "./O.fn.constant";

export default () => {
    // API：读取租户信息
    return Ux.ajaxGet("/api/tenant", {}, Cv.OPTIONS);
}