import Ex from "ex";

export default (reference, config = {}, hide) => (event) => {
    const {item} = config;
    const model = item.getModel();
    /* 隐藏 */
    hide(event);
    Ex.g6ItemRemove(config.graph, model);
}