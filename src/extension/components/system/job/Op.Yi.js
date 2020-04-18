import Ux from "ux";
import Ex from "ex";
import renderOp from "./Web.Op";
import Event from "./event";

const yiExtra = (reference) => {
    let buttons = Ux.fromHoc(reference, "extra");
    if (Ux.isArray(buttons)) {
        buttons = Ux.aiExprButtons(buttons);
    }
    return buttons;
};
const yiTree = (state, data = []) => {
    const module = Ux.fromHoc({state}, "module");
    if (module && module.category) {
        const category = Ux.sorterObject(module.category);
        const menus = [];
        Object.keys(category).forEach(key => {
            const menu = {};
            menu.key = key;
            menu.text = category[key];
            menu.counter = data.filter(item => item.code.startsWith(key)).length;
            menus.push(menu);
        });
        state.$menus = menus;
    }
    return Ux.promise(state);
}
export default (reference) => {
    const state = {};
    Ex.I.jobs().then((data = []) => {
        state.$data = data;
        /*
         * 表格数据
         */
        const $table = Ux.sexTable(reference, "table");
        $table.columns = [renderOp(reference)].concat($table.columns);
        if (!$table.pagination) {
            $table.pagination = {};
        }
        $table.pagination.pageSize = 8;
        state.$table = $table;

        /*
         * 自动刷新专用
         */
        const sec = 30;     // default的值是 30 s
        state.$duration = sec;
        state.$durationValue = sec;
        // state.$timer = Event.rxTimer(reference, sec * 1000);

        /*
         * tabs 动态处理
         */
        const $tabs = Ux.fromHoc(reference, "tabs");
        $tabs.onEdit = Event.rxTabEdit(reference);
        $tabs.type = "editable-card";
        $tabs.hideAdd = true;
        $tabs.className = "ex-tabs";
        state.$tabs = $tabs;
        state.$extra = yiExtra(reference);

        Ex.yiStandard(reference, state)
            .then(state => yiTree(state, data))
            .then(Ux.pipe(reference));
    })
};