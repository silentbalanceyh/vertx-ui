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
        if (!$table.pagination) {
            $table.pagination = {};
        }
        $table.pagination.pageSize = 8;
        state.$table = $table;

        const sec = 30;     // default的值是 30 s
        state.$duration = sec;
        state.$durationValue = sec;
        state.$timer = Event.rxTimer(reference, sec * 1000);
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
        Ex.yiStandard(reference, state).then(Ux.pipe(reference));
    })
};
const $opSave = (reference) => (params) =>
    Ex.form(reference).save(Ex.outJob(params), {
        uri: "/api/job/info/mission/:key",
        dialog: "saved"
    });
const yuPage = (reference) => {
    const {$loading = false, $timer} = reference.state;
    if ($loading && $timer) {
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
        /*
         * 更新 $timer 设置
         */
        reference.setState({$timer: undefined});
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