import Ux from "ux";
/*
 * 判断自我关系的合法性
 * 1）如果是自引用只可当前节点
 * 2）其他节点不可创建自引用
 */
const isLoopOk = (edge, managed = {}) =>
    Ux.x6IsLoop(edge, managed);
/*
 * 其他节点不可创建关系
 */
const isUnmanaged = (edge, managed = {}) =>
    Ux.x6IsUnmanaged(edge, managed);

const rxEdgeInit = (edge, reference) =>
    Ux.x6xEdgeInit(edge, reference);
const rxEdgeInitType = (reference) =>
    Ux.x6xEdgeInitType(reference);
const rxNodeFilter = (reference) =>
    Ux.x6xNodeFilter(reference);

// =====================================================
// on 前缀
// =====================================================
const onWindowClose = () =>
    Ux.x6oWindowClose();
const onWindowSubmit = (reference) =>
    Ux.x6oWindowSubmit(reference);
const onNodeRemovable = (reference, managed) =>
    Ux.x6oNodeRemovable(reference, managed);
const onEdgeConnectedAfter = (reference) =>
    Ux.x6oEdgeConnectedAfter(reference);
/*
 * 验证当前连接的这条线是否合法
 */
const onEdgeConnectedBefore = (reference, managed = {}) =>
    Ux.x6oEdgeConnectedBefore(reference, managed);
const onReset = (reference, dataDefault = {}) =>
    Ux.x6oReset(reference, dataDefault);
/**
 *
 * @class X6
 */
export default {
    // 窗口关闭专用函数
    onWindowClose,
    // 窗口提交专用函数
    onWindowSubmit,
    // 移除按钮
    onNodeRemovable,
    // 连接之后调用
    onEdgeConnectedAfter,
    // 连接之前调用
    onEdgeConnectedBefore,
    // 重置专用函数
    onReset,
    // rx 系列,
    rxEdgeInit,
    rxEdgeInitType,
    rxNodeFilter,
    // is 系列
    isLoopOk,
    isUnmanaged,
}