import Ex from "ex";
import Ux from "ux";
import Op from "./O.on";

const yiModel = (reference, state) => {
    state.$menus = Ux.g6DataTree({state});
    state.$switcher = true;         // 默认只选择二级分类
    state.$selected = undefined;
    state.$expand = false;
    return Ux.promise(state);
};

const yiPage = (reference) => {
    Ex.yiStandard(reference)
        .then(state => yiModel(reference, state))
        .then(Ux.pipe(reference));
};

const yoSwitch = (reference) => {
    const attrs = {};
    attrs.checkedChildren = true;
    attrs.unCheckedChildren = false;
    const {$switcher = true} = reference.state;
    attrs.checked = $switcher;
    attrs.onChange = Op.onSwitch(reference);
    return attrs;
};
const yoLeft = (reference) => {
    const {$expand = false} = reference.state;
    const attrs = {};
    attrs.span = $expand ? 23 : 20;
    return attrs;
};
const yoRight = (reference) => {
    const {$expand = false} = reference.state;
    const attrs = {};
    attrs.span = $expand ? 1 : 4;
    return attrs;
};
export default {
    yiPage,
    yoSwitch,
    yoLeft,
    yoRight
}