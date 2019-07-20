import Ux from "ux";

const fnExApp = (data) => ({app: Ux.storeApp(data)});
const fnExInit = (data = []) => {
    const result = {};
    if (data[0]) {
        /* 第二参，写AppKey */
        Ux.storeApp(data[0], true);
    }
    result['app'] = data[0];
    result['datum.menus'] = data[1];
    return result;
};
export default {
    fnExApp,
    fnExInit,
}