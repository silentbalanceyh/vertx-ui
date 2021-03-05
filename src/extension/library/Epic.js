import Ux from "ux";
import Types from "./Types";
import I from "./ajax";

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
    epicApp: Ux.rxEdict(Types.epicApp, I.app, procApp),
    epicInit: Ux.rxEdict(Types.epicInit, I.inited, procInit),
    epicTabular: Ux.rxEdict(Types.epicTabular, I.tabular, data => Ux.rxDatum(data))
}