import Ux from "ux";
import Ex from 'ex';
import Event from "./Op.Event";

const yiTree = (reference, state = {}) => {
    const {config = {}, $supportKeys} = reference.props;
    const {datum = {}, group = {}} = config;
    const {forest = {}} = group.config ? group.config : {};
    /*
     * 过滤处理
     */
    let treeArray = datum;
    if ($supportKeys) {
        const treeSet = new Set($supportKeys);
        treeArray = treeArray.filter(item => {
            if ("ci.type" === item.type) {
                return treeSet.has(item.key);
            } else return true;
        })
    }
    return Ux.forest(treeArray, forest).then($source => {
        state.$tree = $source;
        return Ux.promise(state);
    });
}

const yiPage = (reference) => {
    const state = {};
    const {$views = []} = reference.props;
    state.$button = Ux.sexOp(reference, Event);
    state.$ready = true;
    state.$views = $views;
    state.$module = "rule.op.definition";
    const maxHeight = Ux.toHeight(ADJUST);
    state.$heightStyle = {style: {maxHeight}};
    yiTree(reference, state)
        .then(Ux.ready).then(Ux.pipe(reference));
};
const yuPage = (reference, virtualRef) => {
    const check = Ex.upValue(reference.props, virtualRef.props, "$supportKeys");
    if (check) {
        yiTree(reference, {})
            .then(Ux.ready).then(Ux.pipe(reference));
    }
};
const ADJUST = 180;
export default {
    ...Event,
    ADJUST,
    yiPage,
    yuPage
}