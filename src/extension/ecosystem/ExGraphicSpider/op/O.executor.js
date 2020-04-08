import Ux from 'ux';

const edgeInit = (edge) => {
    const $inited = {};
    /* 上游 */
    const source = edge.getSource();
    Ux.g6GetNode(source, data => {
        $inited.upstream = data.identifier;
        $inited.upstreamName = data.name;
    });
    /* 下游 */
    const target = edge.getTarget();
    Ux.g6GetNode(target, data => {
        $inited.downstream = data.identifier;
        $inited.downstreamName = data.name;
    });
    $inited.key = Ux.randomUUID();
    return $inited;
};
const onAfterConnect = (gEvent) => (node = {}) => {
    /* 验证通过 */
    const {edge} = node;
    if (edge) {
        /* 打开 */
        gEvent.rsShow(edgeInit(edge), edge.getModel());
    }
};
export default {
    /* 连接完成后 */
    onAfterConnect,
}