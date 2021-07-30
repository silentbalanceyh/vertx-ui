import Ux from "ux";
import Event from "./Op.Event";

const yiPage = (reference) => {
    const state = {};
    const {config = {}, $keySet} = reference.props;
    state.$button = Ux.sexOp(reference, Event);

    const {datum = []} = config;
    const source = Ux.clone(datum);

    state.$validation = source.map(item => item.key);
    state.$source = Ux.toTree(source, {title: "name"});
    {
        state.$keySet = $keySet;
    }
    state.$datum = datum;
    state.$ready = true;
    /*
     * 调用顶层方法执行分类
     */
    reference.setState(state);
    if ($keySet) {
        Ux.fn(reference).rxTree(Array.from($keySet), {
            // 按钮特殊状态
            $selected: {
                // 特殊
                "rule.category.definition": true,
            }
        });
    }
}
export default {
    yiPage
}