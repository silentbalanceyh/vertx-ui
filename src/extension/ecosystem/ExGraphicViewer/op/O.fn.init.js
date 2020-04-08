import Ux from 'ux';

const g6DataGraphic = (reference, data = {}, current = {}) => {
    const originalNodes = data.nodes;
    const originalEdges = data.edges;

    /* nodes,edges 计算 */
    const nodes = [];
    const edges = [];
    /*
     * 节点结构
     * {
     *      id:,
     *      label,
     *      icon,
     *      shape,
     *      data,
     *      size
     * },
     * 边线结构
     * {
     *      id,
     *      label,
     *      source,
     *      target
     * }
     */
    const {$graphic} = reference.state;
    const {config = {}} = reference.props;
    const {category = {}} = config;
    const {
        source = "graphic.nodes",
        field = "categoryThird"
    } = category;
    originalNodes.forEach(node => {
        const normalized = {};
        normalized.id = node.key;
        if ($graphic && $graphic.nodeConfig) {
            Object.assign(node, $graphic.nodeConfig);
        }
        /* label附加信息和icon 计算 */
        if (node.data) {
            const key = node.data[field];
            if (key) {
                const category = Ux.elementUniqueDatum(reference, source, 'key', key);
                if (category) {
                    normalized.icon = Ux.g6UiImage(category);
                    normalized.label = category.name + ": " + node.name;
                }
            }
        }
        normalized.data = Ux.clone(node.data);
        if (current.globalId === normalized.id) {
            normalized.x = 360;
            normalized.y = 100;
        }
        nodes.push(normalized);
    });
    const typeMap = Ux.g6DataEdgeType(reference);
    originalEdges.filter(edge => Ux.isObject(edge.data)).forEach(edge => {
        const normalized = {};
        normalized.id = edge.data.key;
        normalized.label = typeMap[edge.type];
        normalized.source = edge.source;
        normalized.target = edge.target;
        normalized.data = Ux.clone(edge.data);
        edges.push(normalized);
    });
    return {nodes, edges};
};
export default (reference, state = {}) => {
    const {data = {}, $inited = {}} = reference.props;
    /* 数据节点 */
    if (data.graphic) {
        state.$data = data.graphic;
    } else {
        state.$data = g6DataGraphic({state, props: reference.props}, data, $inited);
    }
    return Ux.promise(state);
}