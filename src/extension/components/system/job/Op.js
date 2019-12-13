import Ex from 'ex';
import Ux from 'ux';
import Event from './event';
import renderOp from './Web.Op';

const yiExtra = (reference) => {
    let buttons = Ux.fromHoc(reference, "extra");
    if (Ux.isArray(buttons)) {
        buttons = Ux.aiExprButtons(buttons);
    }
    return buttons;
};
const yiPage = (reference) => {
    const state = {};
    Ex.I.jobs().then((data = []) => {
        state.$data = data;
        const $table = Ux.sexTable(reference, "table");
        /*
         * 修改 columns
         */
        $table.columns = [renderOp(reference)].concat($table.columns);
        /*
         * Assist 和模块读取
         */
        state.$table = $table;
        state.$timer = Event.rxTimer(reference);
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
        Ex.yiStandard(reference, state);
    })
};
const $opSave = (reference) => (params) =>
    Ex.form(reference).save(Ex.outJob(params), {
        uri: "/api/job/info/mission/:key",
        dialog: "saved"
    });
const yuPage = (reference) => {
    const {$loading = false} = reference.state;
    if ($loading) {
        let state = reference.state;
        Ux.toLoading(() => Ex.I.jobs().then((data = []) => {
            state = Ux.clone(state);
            state.$loading = false;
            state.$data = data;
            reference.setState(state);
        }), 5)
    }
};
const yoPage = (reference) => {
    const {$timer} = reference.state;
    if ($timer) {
        clearInterval($timer);
    }
};
export default {
    /*
     * i - Initial：componentDidMount
     * u - Update：componentDidUpdate
     * o - Out：componentWillUnmount
     */
    yiPage,
    yuPage,
    yoPage,
    actions: {
        $opSave,
    }
}