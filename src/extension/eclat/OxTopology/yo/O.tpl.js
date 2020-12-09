import Ux from "ux";

const yiTpl = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
}
const yoGraphic = (inherit, reference) => {
    const graphic = Ux.fromHoc(reference, 'graphic');
    const {$position} = reference.props;
    if ($position) {
        if (!graphic.graph) graphic.graph = {position: {}};
        Object.assign(graphic.graph.position, $position);
    }
    inherit.config = graphic;
    /*
     * 动图切换
     */
    const {$container} = reference.props;
    if ($container) {
        inherit.$container = $container;
    }
}
export default {
    yiTpl,
    yoGraphic,
}