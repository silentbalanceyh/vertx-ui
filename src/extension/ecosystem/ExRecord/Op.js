import Ex from 'ex';
import Ux from 'ux';
import U from "underscore";

const mountOp = (reference, form = {}) => {
    const {$forbidden = {}} = reference.props;
    const $opHidden = $forbidden['op.hidden'];
    if ($opHidden && U.isArray(form.ui)) {
        form.ui.forEach(row => row.forEach(cell => {
            if (cell.field && "$button" === cell.field) {
                cell.hidden = true;
            }
            if (cell.metadata && 0 <= cell.metadata.indexOf('$button')) {
                cell.hidden = true;
            }
        }))
    }
    return form;
};

const yiPage = (reference) => {
    const {$name, data = {}} = reference.props;
    const state = {};
    if ($name) {
        Ex.I.form({code: $name}).then(form => {
            state.$ready = {};
            state.$config = mountOp(reference, form);
            state.$inited = data;
            reference.setState(state);
        })
    } else {
        console.error("[ Ex ] `ExRecord` 缺少重要变量 $name ");
    }
};
const yuPage = (reference, virtualRef) => {
    const $checked = Ex.upValue(reference.props, virtualRef.props, "$name");
    if ($checked) {
        /*
         * 重刷界面
         */
        reference.setState({$ready: false});
        Ux.toLoading(() => yiPage(reference));
    }
};
export default {
    yiPage,
    yuPage,
}