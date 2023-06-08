/*
 * 纯粹为了编译不报错，统计完整的 Injection 核心
 */
const selfFn = item => item;
const trueFn = item => true;

export class GInject {

    // ---------------- 默认实现，返回自引用，为了编译
    onNodeInitBefore = selfFn;
    onNodeInitAfter = selfFn;
    onEdgeInitBefore = selfFn;
    onEdgeInitAfter = selfFn;

    onEdgeConnectedAfter = selfFn;
    onNodeAddAfter = selfFn;

    onWindowClose = selfFn;
    onWindowSubmit = selfFn;
    // 默认返回 true
    onEdgeConnectedBefore = trueFn;

    onNodeRemovable = trueFn;
    onEdgeRemovable = trueFn;
    onNodeClick = selfFn;
    onNodeClickDouble = selfFn;

    // 默认返回空 Set
    onNodeFilter = trueFn;
    // Commands
    onSubmit = selfFn;
    onReset = selfFn;
    onTpl = selfFn;
    onZoomIn = selfFn;
    onZoomOut = selfFn;
}