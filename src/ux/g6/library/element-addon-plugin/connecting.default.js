import EdgeCi from '../element-cell/ci.edge';

export default {
    anchor: 'center',
    dangling: false,
    highlight: true,
    snap: true,
    createEdge: () => {
        const NodeCi = EdgeCi('edge-ci');
        return new NodeCi({});
    },
    validateConnection(params = {}) {
        const {
            sourceMagnet,
            targetMagnet,
        } = params;
        /**
         * 连接点测试
         * 1. 从头开始拉线，sourceMagnet, targetMagnet 都不为空
         * 2. 直接修改连接，其中有一个为空
         */
        return (targetMagnet || sourceMagnet);
    }
}