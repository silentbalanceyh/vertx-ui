/*
 * 构造图专用数据
 */
import Ux from "ux";

const yiPage = (reference) => {
    const state = {};
    return Ux.promise(state).then(processed => {
        const {$gEvent} = reference.props;
        $gEvent.initialize();
        const graph = $gEvent.g6Graph();

        const {
            data = {
                nodes: [],
                edges: []
            }
        } = reference.props;

        graph.fromJSON(data);
        // 初始化侧边栏
        $gEvent.stencilOn();
        // 开启重置
        $gEvent.resizeOn();

        processed.$ready = true;
        reference.setState(state);
    })
}

export default {
    yiPage,
}