/*
 * 构造图专用数据
 */
import Ux from "ux";

const yiPage = (reference) => {
    const state = {};
    return Ux.promise(state).then(processed => {
        const graph = Ux.g6UiEditor(reference, "web-g6-editor");

        const {
            data = {
                nodes: [],
                edges: []
            }
        } = reference.props;

        graph.fromJSON(data);
        processed.$ready = true;
        reference.setState(state);
    })
}

export default {
    yiPage,
}