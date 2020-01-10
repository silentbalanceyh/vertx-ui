import Ux from 'ux';
import Ex from 'ex';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * condition 处理
     */
    const condition = Ux.toQuery("condition");
    if (condition) {
        const conditionStr = Ux.decryptBase64(condition);
        try {
            state.$query = JSON.parse(conditionStr);
        } catch (error) {

        }
    } else {
        const grid = Ux.fromHoc(reference, "grid");
        if (grid.query) {
            state.$query = Ux.clone(grid.query);
        }
    }
    reference.setState(state);
};
const yiTodo = (reference) => {
    const state = {};
    const status = Ux.toQuery("status");
    let $activeKey = "tabPending";
    if ("FINISHED" === status || "CANCELED" === state) {
        $activeKey = "tabDone";
    }
    state.$activeKey = $activeKey;
    Ex.yiStandard(reference, state);
};
/*
 * 左边树的选择处理
 */
const rxCategory = (reference) => (selected = []) => {
    const {$selection, config = {}} = reference.props;
    const grid = Ux.fromHoc(reference, "grid");
    if ($selection && grid.query) {
        const data = Ux.onDatum(reference, "data.category");
        const calculated = Ex.onTree(selected, data, {
            mode: $selection.mode,
            tree: config.tree,
        });
        const criteria = {};
        const {condition = {}} = $selection;
        Object.keys(condition).forEach(condField => {
            const mapField = condition[condField];
            criteria[condField] = calculated.map(each => each[mapField]);
        });
        const $query = Ux.clone(grid.query);
        if (!$query.criteria) {
            $query.criteria = {};
        }
        Object.assign($query.criteria, criteria);
        reference.setState({$query});
    }
};
const rxTabClick = (reference) => ($activeKey) =>
    reference.setState({$activeKey});
export default {
    yiPage,
    yiTodo,
    rxCategory,
    rxTabClick
}