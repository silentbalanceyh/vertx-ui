import Ex from "ex";
import Ux from "ux";
import Op from "../event";
import layout from './O.layout';

const yiModel = (reference, state) => {
    const models = Ux.onDatum({state}, "resource.models");
    const category = Ux.onDatum({state}, "graphic.nodes");
    state.$models = Ex.g6Model(models, category);
    state.$switcher = false;
    state.$selected = undefined;
    state.$expand = false;
    return Ux.promise(state);
};

const yiPage = (reference) => {
    Ex.yiStandard(reference, true)
        .then(state => yiModel(reference, state))
        .then(state => reference.setState(state));
};

const yoSwitch = (reference) => {
    const attrs = {};
    attrs.checkedChildren = true;
    attrs.unCheckedChildren = false;
    attrs.onChange = Op.onSwitch(reference);
    return attrs;
};

export default {
    yiPage,
    yoSwitch,
    ...layout
}