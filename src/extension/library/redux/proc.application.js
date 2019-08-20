import Ux from "ux";

const procApp = (data) => ({app: Ux.storeApp(data)});
const procInit = (data = []) => {
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
    procApp,
    procInit,
}