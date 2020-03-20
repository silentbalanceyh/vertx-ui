import Ev from '../event';

export default (reference) => ({
    /* 连线完成之后 */
    onAfterConnect: Ev.onEdgeAddAfter(reference),
    /* 节点添加之后 */
    onAfterAddItem: Ev.onNodeAddAfter(reference),
    /* 激活锚点过后 */
    onAfterEachAnchorActive: Ev.onAnchorActiveAfter(reference),
})