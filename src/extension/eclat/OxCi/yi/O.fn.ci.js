import Event from '../event';
import Ux from 'ux';
import JsxPage from '../Web.Page';
import Ex from "ex";
import yiInit from './O.fn.data';

const yiDefinition = (reference, state = {}) => Ex.I.relation().then(definitions => {
    state.$definition = definitions;
    return Ux.promise(state);
});
const yiTab = (reference, state = {}) => {
    const config = Ux.fromHoc(reference, "tabs");
    const $tabs = Ux.configTab(reference, config);
    if (Ux.isArray($tabs.items)) {
        $tabs.items.forEach(item => {
            let fnRender = JsxPage[item.key];
            if (Ux.isFunction(fnRender)) {
                fnRender = fnRender(reference);
            }
            if (Ux.isFunction(fnRender)) {
                item.fnRender = fnRender;
            }
        });
    }
    $tabs.className = "ex-tabs";
    state.$tabs = $tabs;
    return Ux.promise(state);
};
export default (reference) => {
    const initState = {};
    /*
     * 堆栈初始化
     */
    initState.$stack = [];
    initState.$stack.push(Event.ciStart(reference));
    initState.$index = 0;
    /*
     * 构造第一次请求
     */
    return yiTab(reference, initState)
        .then(state => yiInit(reference, state))
        .then(state => yiDefinition(reference, state))
        .then(Ux.ready).then(Ux.pipe(reference));
}